import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/EmptyState";
import { useQueryStore } from "@/stores/useQueryStore";
import { downloadCsv, toCsv } from "@/utils/csv";
import { toast } from "sonner";
import type { CellValue } from "@/types/database";

export function QueryResults() {
  const result = useQueryStore((state) => state.result);
  const isRunning = useQueryStore((state) => state.isRunning);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);

  const columns = useMemo<ColumnDef<Record<string, CellValue>>[]>(() => {
    if (!result?.columns.length) return [];
    return [
      {
        id: "rownum",
        header: "#",
        cell: ({ row }) => row.index + 1,
        size: 40,
      },
      ...result.columns.map((column) => ({
        accessorKey: column.name,
        header: () => (
          <span className="inline-flex items-center gap-1">
            {column.name}
            <span className="font-mono text-label-sm text-outline">[{column.type}]</span>
          </span>
        ),
        cell: ({ getValue }: { getValue: () => unknown }) => {
          const value = getValue() as CellValue;
          if (value === null || value === undefined) return <span className="italic text-outline">NULL</span>;
          return String(value);
        },
      })),
    ];
  }, [result]);

  const table = useReactTable({
    data: result?.rows ?? [],
    columns,
    state: { sorting, globalFilter, pagination: { pageIndex, pageSize: 25 } },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: "onChange",
    enableColumnResizing: true,
  });

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg bg-surface-container-lowest shadow-sm">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 bg-surface-container-low px-3">
        <div className="flex items-center gap-2">
          <span className="rounded bg-secondary-container px-1 py-0.5 font-mono text-label-sm font-bold text-on-secondary-container">
            Query Result
          </span>
          <span className="font-mono text-code-sm text-on-surface-variant">{result?.rowCount ?? 0} rows</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="relative">
            <Search className="absolute left-2 top-1.5 h-4 w-4 text-outline" />
            <input
              className="h-7 w-36 rounded bg-surface-container-lowest pl-7 pr-2 text-body-sm shadow-sm focus:w-48 focus:outline-none"
              placeholder="Filter results..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              aria-label="Filter results"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (!result) return;
              downloadCsv(
                "results.csv",
                toCsv(
                  result.columns.map((col) => col.name),
                  result.rows,
                ),
              );
              toast.success("CSV exported");
            }}
          >
            <Download className="h-3.5 w-3.5" />
            Download CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              if (!result) return;
              await navigator.clipboard.writeText(JSON.stringify(result.rows, null, 2));
              toast.success("Query copied");
            }}
          >
            Copy JSON
          </Button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        {isRunning ? <LoadingState label="Executing query…" /> : null}
        {!isRunning && !result ? (
          <EmptyState title="Run a SQL query to see results here." description="Press Ctrl + Enter in the SQL editor." />
        ) : null}
        {!isRunning && result?.status === "error" ? (
          <ErrorState
            title="Query failed"
            message={result.error?.message ?? "Query execution failed"}
            details={[
              result.error?.line ? `Line ${result.error.line}` : null,
              result.error?.column ? `Column ${result.error.column}` : null,
              result.error?.details,
            ]
              .filter(Boolean)
              .join(" • ")}
          />
        ) : null}
        {!isRunning && result?.status === "success" ? (
          <table className="w-full min-w-[750px] border-collapse text-left font-mono text-code-sm">
            <thead className="sticky top-0 z-10 bg-surface-container-low text-label-md text-on-surface-variant shadow-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="cursor-pointer px-3 py-1 hover:bg-surface-container"
                      style={{ width: header.getSize() }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-primary-fixed/20">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="cursor-copy px-3 py-1"
                      onClick={() => {
                        void navigator.clipboard.writeText(String(cell.getValue() ?? "NULL"));
                        toast.success("Query copied");
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
      {result?.status === "success" ? (
        <div className="flex h-7 items-center justify-between bg-surface-container-low px-3 font-mono text-label-sm">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </span>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" disabled={!table.getCanPreviousPage()} onClick={() => { table.previousPage(); setPageIndex((value) => Math.max(0, value - 1)); }}>
              Prev
            </Button>
            <Button variant="ghost" size="sm" disabled={!table.getCanNextPage()} onClick={() => { table.nextPage(); setPageIndex((value) => value + 1); }}>
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
