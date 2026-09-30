import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DatabaseEngine } from "@/types/database";
import type { Project, ProjectKind } from "@/types/project";
import { seedProjects } from "@/data/seed";
import { uid } from "@/utils/format";
import { DEFAULT_DBML, parseDbml } from "@/utils/dbml";
import { DEFAULT_SQL } from "@/utils/sql";
import { defaultPostsTable, defaultUsersTable } from "@/data/seed";

interface ProjectState {
  projects: Project[];
  activeProjectId: string;
  hydrated: boolean;
  setActiveProject: (id: string) => void;
  upsertProject: (project: Project) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  createProject: (input: { name: string; engine: DatabaseEngine; description: string; kind?: ProjectKind }) => Project;
  forkProject: (id: string) => Project | undefined;
  deleteProject: (id: string) => void;
  toggleFavorite: (id: string) => void;
  shareProject: (id: string, visibility: "private" | "anyone", permission: "view" | "edit") => string;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: seedProjects,
      activeProjectId: seedProjects[0].id,
      hydrated: false,
      setActiveProject: (id) => set({ activeProjectId: id }),
      upsertProject: (project) =>
        set((state) => ({
          projects: state.projects.some((item) => item.id === project.id)
            ? state.projects.map((item) => (item.id === project.id ? project : item))
            : [project, ...state.projects],
        })),
      updateProject: (id, patch) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? {
                  ...project,
                  ...patch,
                  updatedAt: new Date().toISOString(),
                  lastEditedLabel: "just now",
                }
              : project,
          ),
        })),
      createProject: ({ name, engine, description, kind = "playground" }) => {
        const { schema } = parseDbml(DEFAULT_DBML);
        const project: Project = {
          id: uid("proj"),
          name,
          description,
          engine,
          kind,
          owner: "Alex Morgan",
          tags: ["new"],
          favorite: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastEditedLabel: "just now",
          queryCount: 0,
          tableCount: 2,
          dbml: DEFAULT_DBML,
          sql: DEFAULT_SQL,
          schema,
          tables: [
            { ...defaultUsersTable, rows: defaultUsersTable.rows.map((row) => ({ ...row })) },
            { ...defaultPostsTable, rows: defaultPostsTable.rows.map((row) => ({ ...row })) },
          ],
        };
        set((state) => ({ projects: [project, ...state.projects], activeProjectId: project.id }));
        return project;
      },
      forkProject: (id) => {
        const source = get().projects.find((project) => project.id === id);
        if (!source) return undefined;
        const forked: Project = {
          ...structuredClone(source),
          id: uid("proj"),
          name: `${source.name} - Fork`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastEditedLabel: "just now",
          owner: "Alex Morgan",
          share: undefined,
        };
        set((state) => ({ projects: [forked, ...state.projects], activeProjectId: forked.id }));
        return forked;
      },
      deleteProject: (id) =>
        set((state) => {
          const projects = state.projects.filter((project) => project.id !== id);
          return {
            projects,
            activeProjectId:
              state.activeProjectId === id ? (projects[0]?.id ?? "") : state.activeProjectId,
          };
        }),
      toggleFavorite: (id) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, favorite: !project.favorite } : project,
          ),
        })),
      shareProject: (id, visibility, permission) => {
        const url = `${window.location.origin}/playground/${id}?share=${uid("lnk")}`;
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, share: { visibility, permission, url } } : project,
          ),
        }));
        return url;
      },
    }),
    {
      name: "querylab-projects",
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    },
  ),
);

export function getActiveProject(): Project | undefined {
  const { projects, activeProjectId } = useProjectStore.getState();
  return projects.find((project) => project.id === activeProjectId);
}
