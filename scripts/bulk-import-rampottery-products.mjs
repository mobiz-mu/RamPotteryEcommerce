import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment."
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const CSV_PATH =
  "C:\\Users\\Mogan\\Downloads\\rampottery-products-upload-ready.csv";

const CATEGORY_FOLDERS = [
  "C:\\Users\\Mogan\\OneDrive\\Desktop\\Rampottery Products\\Category\\Ceramic Tulsi Pot",
  "C:\\Users\\Mogan\\OneDrive\\Desktop\\Rampottery Products\\Category\\Ceramic Vase",
  "C:\\Users\\Mogan\\OneDrive\\Desktop\\Rampottery Products\\Category\\Clay Cookingware",
  "C:\\Users\\Mogan\\OneDrive\\Desktop\\Rampottery Products\\Category\\Clay Flower pot",
  "C:\\Users\\Mogan\\OneDrive\\Desktop\\Rampottery Products\\Category\\Clay Matka",
  "C:\\Users\\Mogan\\OneDrive\\Desktop\\Rampottery Products\\Category\\Clay Murti",
  "C:\\Users\\Mogan\\OneDrive\\Desktop\\Rampottery Products\\Category\\clay pooja products",
  "C:\\Users\\Mogan\\OneDrive\\Desktop\\Rampottery Products\\Category\\Clay Souvenier",
  "C:\\Users\\Mogan\\OneDrive\\Desktop\\Rampottery Products\\Category\\Clay Wind chime",
  "C:\\Users\\Mogan\\OneDrive\\Desktop\\Rampottery Products\\Category\\Earthen Clay Lamp",
  "C:\\Users\\Mogan\\OneDrive\\Desktop\\Rampottery Products\\Category\\other category",
  "C:\\Users\\Mogan\\OneDrive\\Desktop\\Rampottery Products\\Category\\Painting & wax lamp",
  "C:\\Users\\Mogan\\OneDrive\\Desktop\\Rampottery Products\\Category\\Tableware",
  "C:\\Users\\Mogan\\OneDrive\\Desktop\\Rampottery Products\\Category\\Terracotta Home Decor",
];

const STORAGE_BUCKET = "product-images";

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/souvenier/g, "souvenir")
    .replace(/flower pot/g, "flower pot")
    .replace(/other category/g, "others")
    .replace(/\s+/g, " ")
    .trim();
}

function csvSplitLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function parseCsv(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = csvSplitLine(lines[0]).map((h) => h.trim());

  return lines.slice(1).map((line) => {
    const values = csvSplitLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = (values[index] ?? "").trim();
    });
    return row;
  });
}

function findExistingLocalFile(sourcePath, imageFilename) {
  if (sourcePath && fs.existsSync(sourcePath)) return sourcePath;

  for (const folder of CATEGORY_FOLDERS) {
    const candidate = path.join(folder, imageFilename);
    if (fs.existsSync(candidate)) return candidate;
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
  }

  return map;
}

function buildStoragePath(categoryName, slug, localFilePath) {
  const ext = path.extname(localFilePath).toLowerCase() || ".jpg";
  const safeCategory = normalizeText(categoryName).replace(/\s+/g, "-");
  return `products/${safeCategory}/${slug}${ext}`;
}

async function uploadImage(localFilePath, storagePath) {
  const fileBuffer = fs.readFileSync(localFilePath);

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: contentTypeFromExtension(localFilePath),
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

function contentTypeFromExtension(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".jpeg" || ext === ".jpg") return "image/jpeg";
  return "application/octet-stream";
}

function toNullableNumber(value) {
  if (value === "" || value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function toBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;
  const v = String(value || "").toLowerCase().trim();
  if (v === "true") return true;
  if (v === "false") return false;
  return fallback;
}

async function upsertProduct(row, categoryId) {
  const payload = {
    title: row.title,
    slug: row.slug,
    short_description: row.short_description || null,
    description: row.description || null,
    seo_title: row.seo_title || null,
    seo_description: row.seo_description || null,
    price: toNullableNumber(row.price) ?? 0,
    compare_at_price: toNullableNumber(row.compare_at_price),
    badge: row.badge || null,
    category_id: categoryId,
    stock_qty: Number(row.stock_qty || 10),
    is_active: toBoolean(row.is_active, true),
    is_in_stock: toBoolean(row.is_in_stock, true),
  };

  const { data, error } = await supabase
    .from("products")
    .upsert(payload, { onConflict: "slug" })
    .select("id, slug")
    .single();

  if (error) throw error;
  return data;
}

async function upsertProductImage(productId, storagePath, publicUrl, altText) {
  const { data: existing } = await supabase
    .from("product_images")
    .select("id")
    .eq("product_id", productId)
    .eq("image_path", storagePath)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await supabase
      .from("product_images")
      .update({
        image_url: publicUrl,
        alt_text: altText || null,
      })
      .eq("id", existing.id);

    if (error) throw error;
    return;
  }

  const { data: firstImage } = await supabase
    .from("product_images")
    .select("id")
    .eq("product_id", productId)
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("product_images").insert({
    product_id: productId,
    image_path: storagePath,
    image_url: publicUrl,
    alt_text: altText || null,
    sort_order: 0,
    is_primary: !firstImage,
  });

  if (error) throw error;
}

async function main() {
  console.log("Reading CSV...");
  const rows = parseCsv(CSV_PATH);
  console.log(`Found ${rows.length} rows in CSV`);

  const categoriesMap = await getCategoriesMap();

  let success = 0;
  let failed = 0;
  const failures = [];

  for (const [index, row] of rows.entries()) {
    try {
      const categoryName = row.category_name || row.category || "";
      const normalizedCategory = normalizeText(categoryName);
      const category = categoriesMap.get(normalizedCategory);

      if (!category) {
        throw new Error(`Category not found in database: ${categoryName}`);
      }

      const imageFilename = row.image_filename || path.basename(row.source_full_path || "");
      const localFile = findExistingLocalFile(row.source_full_path, imageFilename);

      if (!localFile) {
        throw new Error(`Image file not found: ${imageFilename}`);
      }

      const product = await upsertProduct(row, category.id);

      const storagePath = buildStoragePath(category.name, row.slug, localFile);
      const publicUrl = await uploadImage(localFile, storagePath);

      await upsertProductImage(
        product.id,
        storagePath,
        publicUrl,
        row.alt_text || row.title
      );

      success += 1;
      console.log(`[${index + 1}/${rows.length}] Imported: ${row.title}`);
    } catch (error) {
      failed += 1;
      failures.push({
        row: index + 1,
        title: row.title,
        slug: row.slug,
        error: error instanceof Error ? error.message : String(error),
      });
      console.error(`[${index + 1}/${rows.length}] Failed: ${row.title}`);
      console.error(error);
    }
  }

  console.log("\nImport finished.");
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);

  if (failures.length) {
    const failPath = path.resolve("rampottery-import-failures.json");
    fs.writeFileSync(failPath, JSON.stringify(failures, null, 2), "utf8");
    console.log(`Failure log saved to: ${failPath}`);
  }
}

main().catch((error) => {
  console.error("Fatal import error:", error);
  process.exit(1);
});