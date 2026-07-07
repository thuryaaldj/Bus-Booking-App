export function normalizeApiRecord(record) {
  if (!record || typeof record !== "object") return record;

  const id = record.id ?? record.Id ?? record.ID;
  return id != null ? { ...record, id: String(id) } : record;
}

export function normalizeApiList(data) {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeApiRecord);
}
