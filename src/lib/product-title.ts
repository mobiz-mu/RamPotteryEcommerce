export type ProductTitleMeta = {
  cleanTitle: string;
  sku: string | null;
};

const TRAILING_REFERENCE_REGEX =
  /\s*(?:[-–—|,/]*\s*[\(\[]?\s*(?:ref(?:erence)?|sku)\s*[:#-]?\s*([A-Za-z0-9][A-Za-z0-9_-]{0,40})\s*[\)\]]?)\s*$/i;

function cleanSpaces(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function getProductTitleMeta(title: string | null | undefined): ProductTitleMeta {
  const originalTitle = cleanSpaces(title || "");

  if (!originalTitle) {
    return {
      cleanTitle: "",
      sku: null,
    };
  }

  const match = originalTitle.match(TRAILING_REFERENCE_REGEX);

  if (!match) {
    return {
      cleanTitle: originalTitle,
      sku: null,
    };
  }

  const sku = match[1]?.trim() || null;
  const cleanTitle = cleanSpaces(originalTitle.replace(TRAILING_REFERENCE_REGEX, ""));

  return {
    cleanTitle: cleanTitle || originalTitle,
    sku,
  };
}

export function getCleanProductSlug(slug: string | null | undefined) {
  return String(slug || "")
    .trim()
    .replace(/-(?:ref|sku)-[a-z0-9][a-z0-9_-]*$/i, "");
}