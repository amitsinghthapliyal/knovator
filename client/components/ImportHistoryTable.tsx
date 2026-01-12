"use client";

import { useEffect, useState } from "react";
import { fetchImportLogs } from "@/lib/api";
import { ImportLog } from "@/types/importLog";

const LIMIT = 20;
const REFRESH_INTERVAL = 30_000;

export default function ImportHistoryTable() {
  const [logs, setLogs] = useState<ImportLog[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // ============================
  // Fetch data (pagination-safe)
  // ============================
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      const res = await fetchImportLogs(page, LIMIT);

      if (cancelled) return;

      // 🔐 Safety: page out of range → reset to page 1
      if (page > res.meta.totalPages && res.meta.totalPages > 0) {
        setPage(1);
        return;
      }

      setLogs(res.data); // ❗ NO frontend filtering
      setTotalPages(res.meta.totalPages);
      setLastUpdated(new Date());
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [page]);

  // ============================
  // Auto refresh (safe polling)
  // ============================
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetchImportLogs(page, LIMIT);

      setLogs(res.data);
      setTotalPages(res.meta.totalPages);
      setLastUpdated(new Date());
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [page]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Auto-refresh every 30s</span>
        {lastUpdated && (
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Feed</th>
              <th className="px-4 py-3 text-left font-medium">Run Time</th>
              <th className="px-4 py-3 text-center font-medium">Total</th>
              <th className="px-4 py-3 text-center font-medium">New</th>
              <th className="px-4 py-3 text-center font-medium">Updated</th>
              <th className="px-4 py-3 text-center font-medium">Failed</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  Loading…
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No import history available
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 max-w-md truncate">
                    <a
                      href={log.fileName}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      {log.fileName}
                    </a>
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>

                  <td className="px-4 py-3 text-center font-medium">
                    {log.totalFetched}
                  </td>

                  <td className="px-4 py-3 text-center text-green-600 font-medium">
                    {log.newJobs}
                  </td>

                  <td className="px-4 py-3 text-center text-blue-600 font-medium">
                    {log.updatedJobs}
                  </td>

                  <td
                    className={`px-4 py-3 text-center font-medium ${
                      log.failedJobs.length ? "text-red-600" : "text-gray-400"
                    }`}
                  >
                    {log.failedJobs.length}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1.5 rounded border text-sm disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1.5 rounded border text-sm disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
