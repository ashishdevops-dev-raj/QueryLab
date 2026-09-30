import { NavLink, useNavigate } from "react-router-dom";
import {
  Folder,
  FolderOpen,
  GitFork,
  History,
  LayoutDashboard,
  Settings,
  Table2,
  Terminal,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useUIStore } from "@/stores/useUIStore";
import { useProjectStore } from "@/stores/useProjectStore";
import { Button } from "@/components/ui/Button";

const workspace = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/playground", label: "SQL Playground", icon: Terminal },
  { to: "/interview", label: "SQL Interview", icon: GitFork },
  { to: "/projects", label: "All Projects", icon: FolderOpen },
];

export function Sidebar() {
  const collapsed = useUIStore((state) => state.sidebarCollapsed);
  const mobileOpen = useUIStore((state) => state.mobileSidebarOpen);
  const setMobileSidebarOpen = useUIStore((state) => state.setMobileSidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const openModal = useUIStore((state) => state.openModal);
  const projects = useProjectStore((state) => state.projects);
  const activeProjectId = useProjectStore((state) => state.activeProjectId);
  const setActiveProject = useProjectStore((state) => state.setActiveProject);
  const navigate = useNavigate();

  const body = (
    <div className="flex h-full flex-col justify-between p-2">
      <div className="space-y-4 overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between px-2 pt-1">
          {!collapsed ? <span className="text-label-md uppercase tracking-wider text-outline">Workspace</span> : null}
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Close sidebar" onClick={() => setMobileSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <nav className="flex flex-col gap-0.5">
          {workspace.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded px-3 py-2 text-body-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
                  isActive && "bg-primary-container font-medium text-on-primary-container",
                  collapsed && "justify-center px-2",
                )
              }
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed ? item.label : null}
            </NavLink>
          ))}
        </nav>

        <div>
          {!collapsed ? (
            <div className="mb-1 flex items-center justify-between px-2">
              <span className="text-label-md uppercase tracking-wider text-outline">Projects</span>
              <button
                type="button"
                className="text-outline hover:text-on-surface"
                aria-label="Create project"
                onClick={() => openModal("createProject")}
              >
                +
              </button>
            </div>
          ) : null}
          <div className="flex flex-col gap-0.5">
            {projects.map((project) => {
              const active = project.id === activeProjectId;
              return (
                <button
                  key={project.id}
                  type="button"
                  title={project.name}
                  onClick={() => {
                    setActiveProject(project.id);
                    navigate(`/playground/${project.id}`);
                    setMobileSidebarOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded px-3 py-1.5 text-left text-body-sm",
                    active
                      ? "bg-primary-container font-medium text-on-primary-container"
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
                    collapsed && "justify-center px-2",
                  )}
                >
                  {active ? <FolderOpen className="h-4 w-4 shrink-0" /> : <Folder className="h-4 w-4 shrink-0 text-outline" />}
                  {!collapsed ? <span className="truncate">{project.name}</span> : null}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          {!collapsed ? (
            <p className="mb-1 px-2 text-label-md uppercase tracking-wider text-outline">Tools</p>
          ) : null}
          <NavLink
            to="/history"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded px-3 py-2 text-body-sm text-on-surface-variant hover:bg-surface-container-low",
                isActive && "bg-primary-container font-medium text-on-primary-container",
                collapsed && "justify-center px-2",
              )
            }
          >
            <History className="h-[18px] w-[18px]" />
            {!collapsed ? "Query History" : null}
          </NavLink>
          <button
            type="button"
            className={cn(
              "flex w-full items-center gap-2 rounded px-3 py-2 text-body-sm text-on-surface-variant hover:bg-surface-container-low",
              collapsed && "justify-center px-2",
            )}
            onClick={() => openModal("er")}
          >
            <Table2 className="h-[18px] w-[18px]" />
            {!collapsed ? "ER Diagram" : null}
          </button>
          <button
            type="button"
            className={cn(
              "flex w-full items-center gap-2 rounded px-3 py-2 text-body-sm text-on-surface-variant hover:bg-surface-container-low",
              collapsed && "justify-center px-2",
            )}
            onClick={() => openModal("import")}
          >
            <Upload className="h-[18px] w-[18px]" />
            {!collapsed ? "Import Data" : null}
          </button>
        </div>

        <div>
          {!collapsed ? (
            <p className="mb-1 px-2 text-label-md uppercase tracking-wider text-outline">Account</p>
          ) : null}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded px-3 py-2 text-body-sm text-on-surface-variant hover:bg-surface-container-low",
                isActive && "bg-primary-container font-medium text-on-primary-container",
                collapsed && "justify-center px-2",
              )
            }
          >
            <Settings className="h-[18px] w-[18px]" />
            {!collapsed ? "Settings" : null}
          </NavLink>
        </div>
      </div>

      <div className="mt-2 rounded bg-surface-container-low p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
            {!collapsed ? <span className="font-mono text-code-sm text-on-surface-variant">Active Port 1433</span> : null}
          </div>
          {!collapsed ? <span className="font-mono text-label-sm text-outline">12ms</span> : null}
        </div>
        <button
          type="button"
          className="mt-2 w-full text-left font-mono text-label-sm text-outline hover:text-on-surface"
          onClick={toggleSidebar}
        >
          {collapsed ? "»" : "Collapse sidebar"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "fixed bottom-0 left-0 top-16 z-40 hidden flex-col bg-surface-container-lowest shadow-nav transition-[width] lg:flex",
          collapsed ? "w-16" : "w-64",
        )}
      >
        {body}
      </aside>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-inverse-surface/40"
            aria-label="Close sidebar overlay"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative h-full w-72 bg-surface-container-lowest pt-16 shadow-modal">{body}</aside>
        </div>
      ) : null}
    </>
  );
}
