import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local.",
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const PROJECT_ROOT = process.cwd();

const CSV_PATH = path.join(
  PROJECT_ROOT,
  "scripts",
  "rampottery-products-upload-ready-optimized.csv",
);

const OPTIMIZED_IMAGES_DIR = path.join(
  PROJECT_ROOT,
  "public",
  "product-images-optimized",
);

const STORAGE_BUCKET = "product-images";

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/souvenier/g, "souvenir")
    .replace(/terracota/g, "terracotta")
    .replace(/buudha/g, "buddha")
    .replace(/buuddha/g, "buddha")
    .replace(/lumxi/g, "laxmi")
    .replace(/luxmi/g, "laxmi")
    .replace(/ganes\b/g, "ganesh")
    .replace(/maurti/g, "murti")
    .replace(/mueri/g, "murti")
    .replace(/uerti/g, "murti")
    .replace(/flowerr/g, "flower")
    .replace(/flowe/g, "flower")
    .replace(/poth/g, "pot")
    .replace(/candke/g, "candle")
    .replace(/prenium/g, "premium")
    .replace(/whitetika/g, "white tika")
    .replace(/ghgee/g, "ghee")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return normalizeText(value)
    .replace(/rs\s+/g, "rs-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toNullableNumber(value) {
  if (value === "" || value == null) return null;

  const cleaned = String(value)
    .replace(/rs\.?/gi, "")
    .replace(/,/g, "")
    .trim();

  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function toBoolean(value, fallback = true) {
  const v = String(value || "").toLowerCase().trim();

  if (["true", "yes", "1", "active"].includes(v)) return true;
  if (["false", "no", "0", "inactive"].includes(v)) return false;

  return fallback;
}

function contentTypeFromExtension(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".webp") return "image/webp";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";

  return "application/octet-stream";
}

function readCsv() {
  if (!fs.existsSync(CSV_PATH)) {
    throw new Error(`CSV file not found: ${CSV_PATH}`);
  }

  const raw = fs.readFileSync(CSV_PATH, "utf8").replace(/^\uFEFF/, "");

  const rows = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    trim: true,
    relax_column_count: true,
    relax_quotes: true,
  });

  return rows.filter((row) => {
    const title = String(row.title || "").trim();
    const slug = String(row.slug || "").trim();
    const category = String(row.category_name || row.category || "").trim();

    return title || slug || category;
  });
}

function getOptimizedImagesIndex() {
  if (!fs.existsSync(OPTIMIZED_IMAGES_DIR)) {
    throw new Error(`Optimized images folder not found: ${OPTIMIZED_IMAGES_DIR}`);
  }

  const files = fs
    .readdirSync(OPTIMIZED_IMAGES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((file) => file.toLowerCase().endsWith(".webp"));

  const byExactName = new Map();
  const bySlugName = new Map();

  for (const file of files) {
    byExactName.set(file.toLowerCase(), path.join(OPTIMIZED_IMAGES_DIR, file));
    bySlugName.set(slugify(path.basename(file, ".webp")), path.join(OPTIMIZED_IMAGES_DIR, file));
  }

  return {
    files,
    byExactName,
    bySlugName,
  };
}

function findLocalImage(row, imageIndex) {
  const sourceFullPath = String(row.source_full_path || "").trim();
  const imageFilename = String(row.image_filename || "").trim();
  const imageUrl = String(row.image_url || "").trim();

  const candidates = [];

  if (sourceFullPath) {
    candidates.push(sourceFullPath);
    candidates.push(
      path.join(OPTIMIZED_IMAGES_DIR, path.basename(sourceFullPath).replace(/\.(jpg|jpeg|png)$/i, ".webp")),
    );
  }

  if (imageFilename) {
    candidates.push(path.join(OPTIMIZED_IMAGES_DIR, path.basename(imageFilename)));
    candidates.push(
      path.join(OPTIMIZED_IMAGES_DIR, path.basename(imageFilename).replace(/\.(jpg|jpeg|png)$/i, ".webp")),
    );
  }

  if (imageUrl) {
    candidates.push(path.join(OPTIMIZED_IMAGES_DIR, path.basename(imageUrl)));
  }

  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate)) return candidate;
  }

  const exactNames = [
    path.basename(sourceFullPath || "").toLowerCase(),
    path.basename(imageFilename || "").toLowerCase(),
    path.basename(imageUrl || "").toLowerCase(),
  ].filter(Boolean);

  for (const exactName of exactNames) {
    const webpName = exactName.replace(/\.(jpg|jpeg|png)$/i, ".webp");

    if (imageIndex.byExactName.has(webpName)) {
      return imageIndex.byExactName.get(webpName);
    }
  }

  const possibleSlugs = [
    row.slug,
    row.title,
    `${row.title || ""} ${row.price || ""}`,
    `${row.title || ""} ${row.sku || ""}`,
    `${row.title || ""} ${row.ref || ""}`,
  ]
    .map(slugify)
    .filter(Boolean);

  for (const possibleSlug of possibleSlugs) {
    if (imageIndex.bySlugName.has(possibleSlug)) {
      return imageIndex.bySlugName.get(possibleSlug);
    }
  }

  const titleSlug = slugify(row.title || row.slug || "");

  if (titleSlug) {
    const fuzzyMatch = imageIndex.files.find((file) => {
      const fileSlug = slugify(path.basename(file, ".webp"));

      return (
        fileSlug === titleSlug ||
        fileSlug.includes(titleSlug) ||
        titleSlug.includes(fileSlug)
      );
    });

    if (fuzzyMatch) {
      return path.join(OPTIMIZED_IMAGES_DIR, fuzzyMatch);
    }
  }

  return null;
}

async function getCategoriesMap() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug");

  if (error) throw error;

  const map = new Map();

  for (const category of data || []) {
    map.set(normalizeText(category.name), category);
    map.set(normalizeText(category.slug), category);
    map.set(slugify(category.name), category);
    map.set(slugify(category.slug), category);
  }

  return map;
}

async function ensureCategory(categoryName, categoriesMap) {
  const cleanName = String(categoryName || "Other Category").trim() || "Other Category";

  const candidates = [
    cleanName,
    normalizeText(cleanName),
    slugify(cleanName),
    cleanName.replace("Souvenier", "Souvenir"),
    cleanName.replace("other category", "Other Category"),
  ];

  for (const candidate of candidates) {
    const normalized = normalizeText(candidate);
    const slugged = slugify(candidate);

    if (categoriesMap.has(normalized)) return categoriesMap.get(normalized);
    if (categoriesMap.has(slugged)) return categoriesMap.get(slugged);
  }

  const payload = {
    name: cleanName,
    slug: slugify(cleanName),
  };

  const { data, error } = await supabase
    .from("categories")
    .insert(payload)
    .select("id, name, slug")
    .single();

  if (error) throw error;

  categoriesMap.set(normalizeText(data.name), data);
  categoriesMap.set(normalizeText(data.slug), data);
  categoriesMap.set(slugify(data.name), data);
  categoriesMap.set(slugify(data.slug), data);

  console.log(`Created missing category: ${data.name}`);

  return data;
}

async function uploadImage(localFilePath, storagePath) {
  const fileBuffer = fs.readFileSync(localFilePath);

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: contentTypeFromExtension(localFilePath),
      upsert: true,
      cacheControl: "31536000",
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(storagePath);

  return data.publicUrl;
}

function buildStoragePath(categoryName, slug, localFilePath) {
  const ext = path.extname(localFilePath).toLowerCase() || ".webp";
  const safeCategory = slugify(categoryName || "products");
  const safeSlug = slugify(slug || path.basename(localFilePath, ext));

  return `products/${safeCategory}/${safeSlug}${ext}`;
}

function buildDescription(row) {
  const existing = String(row.description || "").trim();
  const specifications = String(row.specifications || "").trim();

  if (existing && specifications && !existing.includes("Specifications:")) {
    return `${existing}\n\nSpecifications: ${specifications}`;
  }

  if (existing) return existing;

  const title = row.title || "Ram Pottery handmade product";
  const category = row.category_name || row.category || "handmade pottery";
  const material = row.material || "handcrafted material";
  const colour = row.colour_finish || row.color || row.colour || "natural handcrafted finish";

  return `${title} is a premium Ram Pottery product crafted for customers who appreciate authentic handmade pieces in Mauritius. Made with ${String(material).toLowerCase()} and finished with ${String(colour).toLowerCase()}, this item is ideal for home décor, gifting, traditional use and elegant artisan styling.

Specifications: ${specifications || `Category: ${category} | Material: ${material} | Finish / Colour: ${colour} | Stock: 1000`}

Please note: as this is a handcrafted item, small variations in shape, tone, size and finish may occur. These natural differences make every Ram Pottery piece unique.`;
}

function buildShortDescription(row) {
  const existing = String(row.short_description || "").trim();

  if (existing) return existing;

  const title = row.title || "Ram Pottery handmade product";

  return `${title} by Ram Pottery Mauritius — a handcrafted piece for décor, gifting and traditional use.`;
}

function buildSeoTitle(row) {
  const existing = String(row.seo_title || "").trim();

  if (existing) return existing.slice(0, 68);

  return `${row.title || "Handmade Pottery"} | Ram Pottery Mauritius`.slice(0, 68);
}

function buildSeoDescription(row) {
  const existing = String(row.seo_description || "").trim();

  if (existing) return existing.slice(0, 155);

  return `Shop ${row.title || "handmade pottery"} from Ram Pottery Mauritius. Premium handcrafted pottery, ceramics and artisan décor for gifting and traditional use.`.slice(0, 155);
}

async function getUniqueProductSlug(value) {
  const baseSlug = slugify(value);

  if (!baseSlug) {
    throw new Error(`Could not generate slug from value: ${value}`);
  }

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const { data, error } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;

    if (!data) return slug;

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}


async function insertProduct(row, categoryId) {
  const title = String(row.title || "").trim();

  if (!title) {
    throw new Error("Missing product title");
  }

  const slug = await getUniqueProductSlug(row.slug || title);

  if (!slug) {
    throw new Error(`Missing product slug for: ${title}`);
  }

  const payload = {
    title,
    slug,
    short_description: buildShortDescription(row),
    description: buildDescription(row),
    seo_title: buildSeoTitle(row),
    seo_description: buildSeoDescription(row),
    price: toNullableNumber(row.price) ?? 0,
    compare_at_price: toNullableNumber(row.compare_at_price),
    badge: row.badge || null,
    category_id: categoryId,
    stock_qty: 1000,
    is_active: toBoolean(row.is_active, true),
    is_in_stock: true,
  };

  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select("id, slug")
    .single();

  if (error) throw error;

  return data;
}

async function insertProductImage(productId, storagePath, publicUrl, altText) {
  const { error } = await supabase.from("product_images").insert({
    product_id: productId,
    image_path: storagePath,
    image_url: publicUrl,
    alt_text: altText || null,
    sort_order: 0,
    is_primary: true,
  });

  if (error) throw error;
}

async function deleteExistingProducts() {
  console.log("");
  console.log("Deleting existing product_images...");
  const { error: imageError } = await supabase
    .from("product_images")
    .delete()
    .not("id", "is", null);

  if (imageError) throw imageError;

  console.log("Deleting existing products...");
  const { error: productError } = await supabase
    .from("products")
    .delete()
    .not("id", "is", null);

  if (productError) throw productError;

  console.log("Existing products deleted.");
  console.log("");
}

async function main() {
  console.log("");
  console.log("Ram Pottery CSV fresh import");
  console.log("----------------------------");
  console.log(`CSV: ${CSV_PATH}`);
  console.log(`Optimized images: ${OPTIMIZED_IMAGES_DIR}`);
  console.log("");

  await deleteExistingProducts();

  const rows = readCsv();
  const imageIndex = getOptimizedImagesIndex();
  const categoriesMap = await getCategoriesMap();

  console.log(`Rows found in CSV: ${rows.length}`);
  console.log(`Optimized WebP files found: ${imageIndex.files.length}`);
  console.log("");

  let success = 0;
  let failed = 0;
  const failures = [];

  for (const [index, row] of rows.entries()) {
    try {
      row.stock_qty = "1000";
      row.is_in_stock = "true";
      row.is_active = row.is_active || "true";

      const categoryName = row.category_name || row.category || "Other Category";
      const category = await ensureCategory(categoryName, categoriesMap);

      const localFile = findLocalImage(row, imageIndex);

      if (!localFile) {
        throw new Error(
          `Optimized image not found. title="${row.title}" image_filename="${row.image_filename}" source_full_path="${row.source_full_path}"`,
        );
      }

      const product = await insertProduct(row, category.id);

      const storagePath = buildStoragePath(category.name, product.slug, localFile);
      const publicUrl = await uploadImage(localFile, storagePath);

      await insertProductImage(
        product.id,
        storagePath,
        publicUrl,
        row.alt_text || `${row.title} - Ram Pottery Mauritius`,
      );

      success += 1;

      console.log(
        `[${index + 1}/${rows.length}] Imported: ${row.title} → ${path.basename(localFile)}`,
      );
    } catch (error) {
      failed += 1;

      failures.push({
        row: index + 1,
        title: row.title || "",
        slug: row.slug || "",
        category: row.category_name || row.category || "",
        image_filename: row.image_filename || "",
        source_full_path: row.source_full_path || "",
        error: error instanceof Error ? error.message : String(error),
      });

      console.error(`[${index + 1}/${rows.length}] Failed: ${row.title || "NO TITLE"}`);
      console.error(error instanceof Error ? error.message : error);
    }
  }

  console.log("");
  console.log("Import finished.");
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);

  if (failures.length) {
    const failPath = path.resolve("rampottery-import-failures.json");
    fs.writeFileSync(failPath, JSON.stringify(failures, null, 2), "utf8");
    console.log(`Failure log saved to: ${failPath}`);
  }

  console.log("");
}

main().catch((error) => {
  console.error("");
  console.error("Fatal import error:");
  console.error(error);
  process.exit(1);
});