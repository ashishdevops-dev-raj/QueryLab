import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  CircleHelp,
  GitFork,
  History,
  Menu,
  Pencil,
  Save,
  Settings,
  Share2,
  Upload,
} from "lucide-react";
import { QueryLabLogo } from "@/components/common/QueryLabLogo";
import { DatabaseSelector } from "@/components/database/DatabaseSelector";
import { Button } from "@/components/ui/Button";
import { useProjectStore } from "@/stores/useProjectStore";
import { useHistoryStore } from "@/stores/useHistoryStore";
import { useEditorStore } from "@/stores/useEditorStore";
import { useUIStore } from "@/stores/useUIStore";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

const NAV_LINKS = [
  { to: "/playground", label: "Playground", match: "/playground" },
  { to: "/interview", label: "SQL Interview", match: "/interview" },
  { to: "/dashboard", label: "Dashboard", match: "/dashboard" },
];

export function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const projects = useProjectStore((state) => state.projects);
  const activeProjectId = useProjectStore((state) => state.activeProjectId);
  const setActiveProject = useProjectStore((state) => state.setActiveProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  const historyCount = useHistoryStore((state) => state.entries.length);
  const markSaved = useEditorStore((state) => state.markSaved);
  const savedAt = useEditorStore((state) => state.savedAt);
  const openModal = useUIStore((state) => state.openModal);
  const setMobileSidebarOpen = useUIStore((state) => state.setMobileSidebarOpen);

  const project = projects.find((item) => item.id === activeProjectId);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 bg-surface-container-lowest shadow-nav">
      <div className="flex h-full items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open sidebar"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/dashboard" className="flex items-center gap-2">
            <QueryLabLogo />
            <span className="text-headline-sm tracking-tight text-on-surface">QueryLab</span>
            <span className="rounded bg-surface-container-high px-1 py-0.5 font-mono text-label-sm text-on-surface-variant">
              v2.4
            </span>
          </Link>
          <div className="mx-1 hidden h-5 w-px bg-outline-variant/40 sm:block" />
          {project ? (
            <div className="hidden items-center gap-1 rounded bg-surface-container-low px-2 py-1 md:flex">
              <select
                aria-label="Current project"
                className="max-w-[160px] truncate bg-transparent text-body-sm font-medium text-on-surface focus:outline-none"
                value={project.id}
                onChange={(event) => {
                  setActiveProject(event.target.value);
                  navigate(`/playground/${event.target.value}`);
                }}
              >
                {projects.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="p-0.5 text-outline hover:text-on-surface"
                aria-label="Rename project"
                onClick={() => {
                  const name = window.prompt("Project name", project.name);
                  if (name) {
                    updateProject(project.id, { name });
                    toast.success("Project renamed");
                  }
                }}
              >
                <Pencil className="h-[15px] w-[15px]" />
              </button>
              <span className="flex items-center gap-1 rounded bg-secondary-container/30 px-1 py-0.5 font-mono text-label-sm text-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                {savedAt ? "Saved" : "Ready"}
              </span>
            </div>
          ) : null}
        </div>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-3 lg:flex">
          {project ? (
            <DatabaseSelector
              value={project.engine}
              onChange={(engine) => updateProject(project.id, { engine })}
            />
          ) : null}
          <div className="flex items-center gap-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                markSaved();
                toast.success("Project saved");
              }}
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button variant="secondary" size="sm" onClick={() => openModal("fork")}>
              <GitFork className="h-4 w-4" />
              Fork
            </Button>
            <Button variant="secondary" size="sm" onClick={() => openModal("import")}>
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button variant="secondary" size="sm" onClick={() => openModal("share")}>
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate("/history")} aria-label="Query history">
            <History className="h-4 w-4 text-outline" />
            <span className="font-mono text-code-sm text-on-surface-variant">{historyCount}</span>
          </Button>
          <nav className="hidden items-center rounded bg-surface-container-low p-0.5 md:flex">
            {NAV_LINKS.map((link) => {
              const active = location.pathname.startsWith(link.match);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded px-3 py-1 text-body-sm transition-colors",
                    active
                      ? "bg-primary-container font-medium text-on-primary-container"
                      : "text-on-surface-variant hover:text-on-surface",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <Button variant="ghost" size="icon" aria-label="Help" onClick={() => openModal("help")}>
            <CircleHelp className="h-5 w-5 text-outline" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Settings" onClick={() => navigate("/settings")}>
            <Settings className="h-5 w-5 text-outline" />
          </Button>
          <button type="button" className="flex items-center gap-1 pl-1" aria-label="User profile">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-label-md text-on-primary-container">
              AM
            </span>
            <ChevronDown className="h-4 w-4 text-outline" />
          </button>
        </div>
      </div>
    </header>
  );
}
