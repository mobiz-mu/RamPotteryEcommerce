export function formatMUR(value: number) {
  return new Intl.NumberFormat("en-MU", {
    style: "currency",
    currency: "MUR",
    maximumFractionDigits: 2,
  }).format(value);
}