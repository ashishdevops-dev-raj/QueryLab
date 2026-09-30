import { Copy, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useProjectStore } from "@/stores/useProjectStore";
import { useDataStore } from "@/stores/useDataStore";
import { useUIStore } from "@/stores/useUIStore";
import { downloadCsv, toCsv } from "@/utils/csv";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

export function DataEditor() {
  const projects = useProjectStore((state) => state.projects);
  const activeProjectId = useProjectStore((state) => state.activeProjectId);
  const activeTable = useDataStore((state) => state.activeTable);
  const setActiveTable = useDataStore((state) => state.setActiveTable);
  const updateCell = useDataStore((state) => state.updateCell);
  const addRow = useDataStore((state) => state.addRow);
  const deleteRow = useDataStore((state) => state.deleteRow);
  const duplicateRow = useDataStore((state) => state.duplicateRow);
  const generateSample = useDataStore((state) => state.generateSample);
  const openModal = useUIStore((state) => state.openModal);
  const project = projects.find((item) => item.id === activeProjectId);
  if (!project) return null;
  const table = project.tables.find((item) => item.tableName === activeTable) ?? project.tables[0];
  if (!table) return null;

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg bg-surface-container-lowest shadow-sm">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 bg-surface-container-low px-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="rounded bg-primary-fixed px-1 py-0.5 font-mono text-label-sm font-bold text-on-primary-fixed">
              [2]
            </span>
            <span className="text-headline-sm tracking-tight">Define Data</span>
          </div>
          <div className="flex items-center rounded bg-surface-container p-0.5">
            {project.tables.map((item) => (
              <button
                key={item.tableName}
                type="button"
                className={cn(
                  "flex items-center gap-1 rounded px-2 py-0.5 text-body-sm",
                  item.tableName === table.tableName
                    ? "bg-surface-container-lowest font-semibold text-primary shadow-sm"
                    : "text-on-surface-variant",
                )}
                onClick={() => setActiveTable(item.tableName)}
              >
                {item.tableName}
                <span className="rounded-full bg-primary-fixed px-1 font-mono text-label-sm text-on-primary-fixed">
                  {item.rows.length}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <Button size="sm" onClick={() => addRow(table.tableName)}>
            <Plus className="h-3.5 w-3.5" />
            New Row
          </Button>
          <Button variant="outline" size="sm" onClick={() => openModal("import")}>
            Import CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              downloadCsv(
                `${table.tableName}.csv`,
                toCsv(
                  table.columns.map((col) => col.name),
                  table.rows,
                ),
              );
              toast.success("CSV exported");
            }}
          >
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => generateSample(table.tableName)}>
            Generate Sample
          </Button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[500px] border-collapse text-left font-mono text-code-sm">
          <thead className="sticky top-0 z-10 bg-surface-container-low text-label-md text-on-surface-variant shadow-sm">
            <tr>
              <th className="w-12 px-2 py-1 text-center font-normal text-outline">#</th>
              {table.columns.map((column) => (
                <th key={column.name} className="px-3 py-1">
                  {column.name} <span className="font-mono text-label-sm text-outline">[{column.type}]</span>
                </th>
              ))}
              <th className="w-16" />
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={`${table.tableName}-${rowIndex}`} className="group hover:bg-primary-fixed/20">
                <td className="bg-surface-container-low/50 px-2 py-1 text-center text-outline">{rowIndex + 1}</td>
                {table.columns.map((column) => (
                  <td key={column.name} className="px-3 py-1">
                    <input
                      className="w-full bg-transparent font-mono text-code-sm text-on-surface focus:outline-none"
                      value={row[column.name] === null || row[column.name] === undefined ? "" : String(row[column.name])}
                      onChange={(event) => {
                        const raw = event.target.value;
                        const value =
                          column.type === "int" || column.type === "decimal"
                            ? raw === ""
                              ? null
                              : Number(raw)
                            : raw;
                        updateCell(table.tableName, rowIndex, column.name, value);
                      }}
                    />
                  </td>
                ))}
                <td className="px-2 py-1 text-right opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    className="mr-1 text-outline hover:text-on-surface"
                    aria-label="Duplicate row"
                    onClick={() => duplicateRow(table.tableName, rowIndex)}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="text-outline hover:text-error"
                    aria-label="Delete row"
                    onClick={() => deleteRow(table.tableName, rowIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            <tr
              className="cursor-pointer text-outline hover:bg-surface-container-low/60 hover:text-primary"
              onClick={() => addRow(table.tableName)}
            >
              <td className="px-2 py-1 text-center">+</td>
              <td className="px-3 py-1 italic" colSpan={table.columns.length + 1}>
                + Click to add row...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex h-7 shrink-0 items-center justify-between bg-surface-container-low px-3 font-mono text-label-sm text-on-surface-variant">
        <span>
          {table.rows.length} rows, {table.columns.length} columns
        </span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
          Live Bind
        </span>
      </div>
    </section>
  );
}
