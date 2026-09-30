import { Link, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Bookmark,
  FolderOpen,
  MoreVertical,
  Play,
  Share2,
  Star,
  Terminal,
  Upload,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/common/EmptyState";
import { useProjectStore } from "@/stores/useProjectStore";
import { useHistoryStore } from "@/stores/useHistoryStore";
import { useQueryStore } from "@/stores/useQueryStore";
import { useUIStore } from "@/stores/useUIStore";
import { DATABASE_ENGINES } from "@/types/database";
import { relativeTime } from "@/utils/format";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { useMemo, useState } from "react";
import type { Project } from "@/types/project";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const KIND_LABEL: Record<Project["kind"], string> = {
  playground: "Active Playground",
  interview: "Assessment",
  replica: "Live Replica",
  analytics: "Parquet Store",
};

export function DashboardPage() {
  const navigate = useNavigate();
  const projects = useProjectStore((state) => state.projects);
  const hydrated = useProjectStore((state) => state.hydrated);
  const setActiveProject = useProjectStore((state) => state.setActiveProject);
  const toggleFavorite = useProjectStore((state) => state.toggleFavorite);
  const history = useHistoryStore((state) => state.entries);
  const openModal = useUIStore((state) => state.openModal);
  const runQuery = useQueryStore((state) => state.runQuery);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      projects.filter((project) => {
        const engineOk =
          filter === "all" ||
          (filter === "shared" ? Boolean(project.share) : project.engine === filter);
        const searchOk = project.name.toLowerCase().includes(search.toLowerCase());
        return engineOk && searchOk;
      }),
    [projects, filter, search],
  );

  if (!hydrated && projects.length === 0) {
    return (
      <AppShell>
        <div className="grid grid-cols-4 gap-3 p-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28" />
          ))}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1720px] space-y-6 p-4">
        <section className="flex flex-col justify-between gap-4 pb-2 xl:flex-row xl:items-center">
          <div>
            <div className="flex items-center gap-1 text-label-sm uppercase tracking-widest text-on-surface-variant">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              Cloud Cluster US-East (Virginia)
              <span className="text-outline">/</span>
              <span className="font-mono text-code-sm font-medium text-primary">Session #9041-A</span>
            </div>
            <h1 className="text-headline-lg tracking-tight">Welcome back, Alex</h1>
            <p className="max-w-2xl text-body-md text-on-surface-variant">
              Test, debug and master SQL across multiple database engines with zero setup.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="lg" onClick={() => openModal("createProject")}>
              + New Playground
              <span className="ml-1 rounded bg-white/20 px-1 font-mono text-code-sm">N</span>
            </Button>
            <Button variant="secondary" size="lg" onClick={() => openModal("import")}>
              <Upload className="h-4 w-4" />
              Import Schema
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate("/interview")}>
              Join Interview
            </Button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Active Projects"
            value={String(Math.max(12, projects.length))}
            icon={<FolderOpen className="h-5 w-5" />}
            meta={`${projects.filter((item) => item.favorite).length} favorites`}
          />
          <StatCard
            label="Queries Executed"
            value={(1278 + history.length).toLocaleString()}
            icon={<Terminal className="h-5 w-5" />}
            meta="99.4% rate"
          />
          <StatCard label="Saved Queries" value="87" icon={<Bookmark className="h-5 w-5" />} meta="14 production" />
          <StatCard label="Shared Playgrounds" value="16" icon={<Share2 className="h-5 w-5" />} meta="4 active" />
        </section>

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
          <section className="space-y-3 lg:col-span-8">
            <div className="flex flex-col justify-between gap-2 rounded-lg bg-surface-container-lowest p-2 shadow-sm md:flex-row md:items-center">
              <div className="flex gap-1 overflow-x-auto">
                {[
                  { id: "all", label: `All Projects (${projects.length})` },
                  { id: "postgres", label: "PostgreSQL" },
                  { id: "sqlserver", label: "SQL Server" },
                  { id: "mysql", label: "MySQL" },
                  { id: "shared", label: "Shared with Me" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={cn(
                      "whitespace-nowrap rounded px-3 py-1 text-body-sm",
                      filter === tab.id
                        ? "bg-primary-container font-medium text-on-primary-container shadow-sm"
                        : "text-on-surface-variant hover:bg-surface-container",
                    )}
                    onClick={() => setFilter(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <input
                className="min-w-[200px] rounded-lg bg-surface-container-low px-3 py-1.5 text-body-sm"
                placeholder="Filter workspaces..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            {filtered.map((project) => {
              const engine = DATABASE_ENGINES.find((item) => item.id === project.engine);
              return (
                <article
                  key={project.id}
                  className="relative flex flex-col justify-between gap-4 overflow-hidden rounded-lg bg-surface-container-lowest p-4 shadow-sm md:flex-row md:items-center"
                >
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 top-0 w-1",
                      project.kind === "playground" && "bg-primary",
                      project.kind === "interview" && "bg-secondary",
                      project.kind === "replica" && "bg-tertiary",
                      project.kind === "analytics" && "bg-outline",
                    )}
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1">
                      <h3 className="text-headline-sm font-semibold">{project.name}</h3>
                      <span className="rounded bg-primary-fixed px-1 py-0.5 font-mono text-label-sm text-on-primary-fixed-variant">
                        {KIND_LABEL[project.kind]}
                      </span>
                      <span className="flex items-center gap-1 rounded bg-surface-container px-1 py-0.5 font-mono text-code-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                        {engine?.label}
                      </span>
                    </div>
                    <p className="text-body-sm text-on-surface-variant">{project.description}</p>
                    <p className="mt-1 font-mono text-code-sm text-outline">
                      {project.tableCount} tables • Last edited {relativeTime(project.updatedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" aria-label="Favorite" onClick={() => toggleFavorite(project.id)}>
                      <Star className={cn("h-[18px] w-[18px]", project.favorite && "fill-tertiary text-tertiary")} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="More"
                      onClick={() => {
                        setActiveProject(project.id);
                        openModal("share");
                      }}
                    >
                      <MoreVertical className="h-[18px] w-[18px]" />
                    </Button>
                    <Button
                      onClick={() => {
                        setActiveProject(project.id);
                        navigate(`/playground/${project.id}`);
                      }}
                    >
                      Open Project
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="space-y-3 lg:col-span-4">
            <div className="overflow-hidden rounded-lg bg-surface-container-lowest shadow-sm">
              <div className="flex items-center justify-between bg-surface-container-low p-3">
                <span className="text-headline-sm font-semibold">Quick Query Playground</span>
                <span className="font-mono text-code-sm text-outline">Local mock</span>
              </div>
              <pre className="p-3 font-mono text-code-sm text-on-surface">{`SELECT u.username, COUNT(p.id)
FROM users u
JOIN posts p ON u.id = p.user_id
GROUP BY u.username;`}</pre>
              <div className="flex items-center justify-between bg-surface-container-low p-3">
                <span className="font-mono text-label-sm text-outline">Ctrl + Enter</span>
                <Button
                  size="sm"
                  onClick={async () => {
                    setActiveProject(projects[0]?.id ?? "");
                    const result = await runQuery(`SELECT u.username, COUNT(p.id) AS posts
FROM users u
JOIN posts p ON u.id = p.user_id
GROUP BY u.username;`);
                    toast.success(result.status === "success" ? "Query executed successfully" : "Query execution failed");
                    navigate("/playground");
                  }}
                >
                  <Play className="h-4 w-4" />
                  Quick Run
                </Button>
              </div>
            </div>

            <div className="rounded-lg bg-surface-container-lowest p-4 shadow-sm">
              <h3 className="mb-2 text-headline-sm font-semibold">Database health</h3>
              <div className="mb-2 h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{ name: "SQL Server", ms: 12 }, { name: "Postgres", ms: 9 }, { name: "MySQL", ms: 14 }]}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="ms" fill="#2563eb" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {[
                ["SQL Server 2022", "12ms"],
                ["PostgreSQL 16", "9ms"],
                ["MySQL 8.4", "14ms"],
              ].map(([name, latency]) => (
                <div key={name} className="flex items-center justify-between py-1 text-body-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-secondary" />
                    {name}
                  </span>
                  <span className="font-mono text-code-sm">{latency}</span>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-surface-container-lowest p-4 shadow-sm">
              <h3 className="mb-2 text-headline-sm font-semibold">Documentation</h3>
              <p className="text-body-sm text-on-surface-variant">
                DBML schema, in-memory SQL execution, interview test cases, and sharing all run locally until a backend is connected.
              </p>
              <Button variant="ghost" className="mt-2 px-0" onClick={() => openModal("help")}>
                Keyboard shortcuts
              </Button>
            </div>

            <div className="rounded-lg bg-surface-container-lowest p-4 shadow-sm">
              <h3 className="mb-2 text-headline-sm font-semibold">Recent activity</h3>
              <ul className="space-y-2">
                {history.slice(0, 4).map((entry) => (
                  <li key={entry.id} className="text-body-sm">
                    <p className="truncate font-mono text-code-sm">{entry.query}</p>
                    <p className="text-label-sm text-outline">{relativeTime(entry.timestamp)}</p>
                  </li>
                ))}
              </ul>
              <Link to="/history" className="mt-2 inline-block text-body-sm text-primary">
                View all history
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({
  label,
  value,
  icon,
  meta,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  meta: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-surface-container-lowest p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-label-md uppercase tracking-wider text-outline">{label}</span>
        <span className="rounded bg-surface-container-low p-1 text-primary">{icon}</span>
      </div>
      <p className="text-headline-lg font-bold">{value}</p>
      <p className="mt-2 font-mono text-code-sm text-on-surface-variant">{meta}</p>
    </div>
  );
}
