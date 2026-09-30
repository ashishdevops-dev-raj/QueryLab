import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { useProjectStore } from "@/stores/useProjectStore";
import { useUIStore } from "@/stores/useUIStore";
import { DATABASE_ENGINES } from "@/types/database";
import { relativeTime } from "@/utils/format";
import { useNavigate } from "react-router-dom";

export function ProjectsPage() {
  const projects = useProjectStore((state) => state.projects);
  const setActiveProject = useProjectStore((state) => state.setActiveProject);
  const forkProject = useProjectStore((state) => state.forkProject);
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  const openModal = useUIStore((state) => state.openModal);
  const askConfirm = useUIStore((state) => state.askConfirm);
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-headline-md">Projects</h1>
          <Button onClick={() => openModal("createProject")}>Create New Project</Button>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {projects.map((project) => (
            <article key={project.id} className="rounded-lg bg-surface-container-lowest p-4 shadow-sm">
              <h2 className="text-headline-sm">{project.name}</h2>
              <p className="text-body-sm text-on-surface-variant">{project.description}</p>
              <p className="mt-2 font-mono text-code-sm text-outline">
                {DATABASE_ENGINES.find((item) => item.id === project.engine)?.label} • Created {relativeTime(project.createdAt)} •
                Modified {relativeTime(project.updatedAt)} • {project.queryCount} queries • {project.owner}
              </p>
              <div className="mt-3 flex flex-wrap gap-1">
                <Button
                  size="sm"
                  onClick={() => {
                    setActiveProject(project.id);
                    navigate(`/playground/${project.id}`);
                  }}
                >
                  Open
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const forked = forkProject(project.id);
                    if (forked) navigate(`/playground/${forked.id}`);
                  }}
                >
                  Fork
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const name = window.prompt("Rename project", project.name);
                    if (name) updateProject(project.id, { name });
                  }}
                >
                  Rename
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveProject(project.id);
                    openModal("share");
                  }}
                >
                  Share
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => askConfirm(`Delete ${project.name}?`, () => deleteProject(project.id))}
                >
                  Delete
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
