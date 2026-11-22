// Minimal CSV parser (handles quoted fields, commas and line breaks inside quotes).
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') { row.push(field); field = ''; }
    else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += char;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

export interface PriceRow {
  service: string;
  price: string;
  details: string;
}

/** Reads a price sheet with Service, Price and Details columns (found by heading). */
export function priceRows(csv: string): PriceRow[] {
  const [header = [], ...rows] = parseCsv(csv);
  const col = (name: string, fallback: number) => {
    const i = header.findIndex((h) => h.trim().toLowerCase() === name);
    return i === -1 ? fallback : i;
  };
  const [service, price, details] = [col('service', 0), col('price', 1), col('details', 2)];

  return rows
    .filter((row) => row[service]?.trim())
    .map((row) => ({
      service: row[service].trim(),
      price: row[price]?.trim() ?? '',
      details: row[details]?.trim() ?? '',
    }));
}
