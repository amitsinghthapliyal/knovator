const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export async function fetchImportLogs(page = 1, limit = 20) {
  const res = await fetch(
    `${API_BASE}/api/import-logs?page=${page}&limit=${limit}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch import logs");
  }

  return res.json();
}
