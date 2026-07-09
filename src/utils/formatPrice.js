export function parsePrice(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export function formatPriceDisplay(value, fallback = "N/A") {
  const price = parsePrice(value);
  return price != null ? `$${price}` : fallback;
}
