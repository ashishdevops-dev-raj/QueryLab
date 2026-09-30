import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { useHistoryStore } from "@/stores/useHistoryStore";
import { useProjectStore } from "@/stores/useProjectStore";
import { DATABASE_ENGINES } from "@/types/database";
import { relativeTime, formatMs } from "@/utils/format";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { isToday, isThisWeek, parseISO } from "date-fns";

export function HistoryPage() {
  const entries = useHistoryStore((state) => state.entries);
  const filters = useHistoryStore((state) => state.filters);
  const setFilters = useHistoryStore((state) => state.setFilters);
  const deleteEntry = useHistoryStore((state) => state.deleteEntry);
  const projects = useProjectStore((state) => state.projects);
  const setActiveProject = useProjectStore((state) => state.setActiveProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  const navigate = useNavigate();

  const visible = entries.filter((entry) => {
    const searchOk = entry.query.toLowerCase().includes(filters.search.toLowerCase());
    const dbOk = filters.database === "all" || entry.database === filters.database;
    const projectOk = filters.projectId === "all" || entry.projectId === filters.projectId;
    const statusOk = filters.status === "all" || entry.status === filters.status;
    const date = parseISO(entry.timestamp);
    const dateOk =
      filters.date === "all" || (filters.date === "today" && isToday(date)) || (filters.date === "week" && isThisWeek(date));
    return searchOk && dbOk && projectOk && statusOk && dateOk;
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-4 p-4">
        <h1 className="text-headline-md">Query History</h1>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-5">
          <input
            className="rounded border border-outline-variant bg-surface-container-lowest px-2 py-1.5 text-body-sm"
            placeholder="Search queries"
            value={filters.search}
            onChange={(event) => setFilters({ search: event.target.value })}
          />
          <select
            className="rounded border border-outline-variant bg-surface-container-lowest px-2 py-1.5 text-body-sm"
            value={filters.database}
            onChange={(event) => setFilters({ database: event.target.value as typeof filters.database })}
          >
            <option value="all">All databases</option>
            {DATABASE_ENGINES.map((engine) => (
              <option key={engine.id} value={engine.id}>
                {engine.label}
              </option>
            ))}
          </select>
          <select
            className="rounded border border-outline-variant bg-surface-container-lowest px-2 py-1.5 text-body-sm"
            value={filters.projectId}
            onChange={(event) => setFilters({ projectId: event.target.value })}
          >
            <option value="all">All projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <select
            className="rounded border border-outline-variant bg-surface-container-lowest px-2 py-1.5 text-body-sm"
            value={filters.status}
            onChange={(event) => setFilters({ status: event.target.value as typeof filters.status })}
          >
            <option value="all">All statuses</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
          </select>
          <select
            className="rounded border border-outline-variant bg-surface-container-lowest px-2 py-1.5 text-body-sm"
            value={filters.date}
            onChange={(event) => setFilters({ date: event.target.value as typeof filters.date })}
          >
            <option value="all">Any date</option>
            <option value="today">Today</option>
            <option value="week">This week</option>
          </select>
        </div>
        <div className="space-y-2">
          {visible.map((entry) => (
            <article key={entry.id} className="rounded-lg bg-surface-container-lowest p-3 shadow-sm">
              <pre className="overflow-auto font-mono text-code-sm">{entry.query}</pre>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-body-sm text-on-surface-variant">
                <span>
                  {DATABASE_ENGINES.find((item) => item.id === entry.database)?.label} • {entry.projectName} •{" "}
                  {entry.rowsReturned} rows • {formatMs(entry.executionTimeMs)} • {relativeTime(entry.timestamp)} •{" "}
                  {entry.status}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setActiveProject(entry.projectId);
                      updateProject(entry.projectId, { sql: entry.query });
                      navigate(`/playground/${entry.projectId}`);
                    }}
                  >
                    Open
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      await navigator.clipboard.writeText(entry.query);
                      toast.success("Query copied");
                    }}
                  >
                    Copy
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteEntry(entry.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
