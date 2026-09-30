import { CheckCircle2, RotateCcw } from "lucide-react";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import { Button } from "@/components/ui/Button";
import { useProjectStore } from "@/stores/useProjectStore";
import { useDataStore } from "@/stores/useDataStore";
import { useEditorStore } from "@/stores/useEditorStore";
import { useUIStore } from "@/stores/useUIStore";
import { DEFAULT_DBML, formatDbml, parseDbml } from "@/utils/dbml";
import { toast } from "sonner";

export function DatabaseStructure() {
  const projects = useProjectStore((state) => state.projects);
  const activeProjectId = useProjectStore((state) => state.activeProjectId);
  const updateProject = useProjectStore((state) => state.updateProject);
  const applyDbml = useDataStore((state) => state.applyDbml);
  const setDbmlDirty = useEditorStore((state) => state.setDbmlDirty);
  const openModal = useUIStore((state) => state.openModal);
  const project = projects.find((item) => item.id === activeProjectId);
  if (!project) return null;

  const parsed = parseDbml(project.dbml);

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg bg-surface-container-lowest shadow-sm">
      <div className="flex h-10 shrink-0 items-center justify-between bg-surface-container-low px-3">
        <div className="flex items-center gap-2">
          <span className="rounded bg-primary-fixed px-1 py-0.5 font-mono text-label-sm font-bold text-on-primary-fixed">
            [1]
          </span>
          <span className="text-headline-sm tracking-tight">Define Database Structure</span>
          <span className="hidden font-mono text-code-sm text-outline-variant sm:inline">schema.dbml</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={() => openModal("er")}>
            View ER Diagram
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const formatted = formatDbml(project.dbml);
              updateProject(project.id, { dbml: formatted });
            }}
          >
            Format
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              updateProject(project.id, { dbml: DEFAULT_DBML });
              applyDbml(DEFAULT_DBML);
              toast.success("Schema imported");
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <MonacoEditor
          language="plaintext"
          value={project.dbml}
          onChange={(value) => {
            updateProject(project.id, { dbml: value });
            setDbmlDirty(true);
            applyDbml(value);
          }}
        />
      </div>
      <div className="flex h-7 shrink-0 items-center justify-between bg-surface-container-low px-3 font-mono text-label-sm text-on-surface-variant">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-medium text-secondary">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {parsed.errors.length ? "DBML errors" : "DBML Validated"}
          </span>
          <span>{parsed.schema.tables.length} tables</span>
          <span>{parsed.schema.relationships.length} relationship</span>
        </div>
        <span>UTF-8</span>
      </div>
    </section>
  );
}
