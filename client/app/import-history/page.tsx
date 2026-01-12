import ImportHistoryTable from "@/components/ImportHistoryTable";

export default function ImportHistoryPage() {
  return (
    <main className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Import History</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track job feed imports, updates, and failures
        </p>
      </div>

      <ImportHistoryTable />
    </main>
  );
}
