import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const inputDir = path.join(process.cwd(), "public", "product-images-original");
const outputDir = path.join(process.cwd(), "public", "product-images-optimized");

const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function getFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return getFiles(fullPath);
      }

      if (!allowedExtensions.has(path.extname(entry.name).toLowerCase())) {
        return [];
      }

      return [fullPath];
    }),
  );

  return files.flat();
}

function safeFileName(filePath) {
  const parsed = path.parse(filePath);

  return `${parsed.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}.webp`;
}

async function optimizeImage(filePath) {
  const outputFileName = safeFileName(filePath);
  const outputPath = path.join(outputDir, outputFileName);

  await sharp(filePath)
    .rotate()
    .resize({
      width: 1400,
      withoutEnlargement: true,
    })
    .webp({
      quality: 72,
      effort: 6,
    })
    .toFile(outputPath);

  const before = await fs.stat(filePath);
  const after = await fs.stat(outputPath);

  console.log(
    `✅ ${path.basename(filePath)} → ${outputFileName} | ${(
      before.size /
      1024 /
      1024
    ).toFixed(2)}MB → ${(after.size / 1024 / 1024).toFixed(2)}MB`,
  );
}

async function main() {
  await ensureDir(inputDir);
  await ensureDir(outputDir);

  const files = await getFiles(inputDir);

  if (files.length === 0) {
    console.log("");
    console.log("No images found.");
    console.log(`Put your original images here: ${inputDir}`);
    console.log("");
    return;
  }

  for (const file of files) {
    await optimizeImage(file);
  }

  console.log("");
  console.log(`Done. Optimized WebP images are here: ${outputDir}`);
  console.log("");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});