import { useNavigate } from "react-router-dom";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import { PlaygroundToolbar } from "@/components/playground/PlaygroundToolbar";
import { useProjectStore } from "@/stores/useProjectStore";
import { useQueryStore } from "@/stores/useQueryStore";
import { useEditorStore } from "@/stores/useEditorStore";
import { useHistoryStore } from "@/stores/useHistoryStore";
import { DATABASE_ENGINES } from "@/types/database";
import { toast } from "sonner";

const CTRL_ENTER = 2048 | 3;

export function SqlEditor() {
  const navigate = useNavigate();
  const projects = useProjectStore((state) => state.projects);
  const activeProjectId = useProjectStore((state) => state.activeProjectId);
  const updateProject = useProjectStore((state) => state.updateProject);
  const runQuery = useQueryStore((state) => state.runQuery);
  const explainQuery = useQueryStore((state) => state.explainQuery);
  const formatCurrent = useQueryStore((state) => state.formatCurrent);
  const clearResult = useQueryStore((state) => state.clearResult);
  const isRunning = useQueryStore((state) => state.isRunning);
  const result = useQueryStore((state) => state.result);
  const setSqlDirty = useEditorStore((state) => state.setSqlDirty);
  const historyCount = useHistoryStore((state) => state.entries.length);
  const project = projects.find((item) => item.id === activeProjectId);
  if (!project) return null;

  const engineLabel = DATABASE_ENGINES.find((item) => item.id === project.engine)?.label ?? project.engine;

  const runAndToast = async () => {
    const next = await runQuery();
    if (next.status === "success") toast.success("Query executed successfully");
    else toast.error("Query execution failed");
  };

  const onMount = (instance: { addCommand: (keybinding: number, handler: () => void) => void }) => {
    instance.addCommand(CTRL_ENTER, () => {
      void runAndToast();
    });
  };

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg bg-surface-container-lowest shadow-sm">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 bg-surface-container-low px-3">
        <div className="flex items-center gap-2">
          <span className="rounded bg-primary-fixed px-1 py-0.5 font-mono text-label-sm font-bold text-on-primary-fixed">
            [3]
          </span>
          <span className="text-headline-sm tracking-tight">Write SQL Query</span>
          <span className="hidden font-mono text-code-sm text-outline-variant sm:inline">query.sql</span>
        </div>
        <PlaygroundToolbar
          running={isRunning}
          historyCount={historyCount}
          onFormat={() => formatCurrent()}
          onExplain={() => void explainQuery()}
          onClear={() => {
            updateProject(project.id, { sql: "" });
            clearResult();
          }}
          onHistory={() => navigate("/history")}
          onRun={() => void runAndToast()}
        />
      </div>
      <div className="min-h-0 flex-1">
        <MonacoEditor
          language="sql"
          value={project.sql}
          onChange={(value) => {
            updateProject(project.id, { sql: value });
            setSqlDirty(true);
          }}
          onMount={onMount}
        />
      </div>
      <div className="flex h-8 shrink-0 items-center justify-between bg-surface-container px-3 font-mono text-label-sm">
        {result?.status === "error" ? (
          <span className="text-error">Query failed — {result.error?.message}</span>
        ) : result?.status === "success" ? (
          <span className="font-medium text-secondary">
            ✓ {result.rowCount} rows returned • Executed in {result.executionTimeMs} ms
          </span>
        ) : (
          <span className="text-on-surface-variant">Ready — Ctrl + Enter to run</span>
        )}
        <span className="flex items-center gap-1 text-outline">
          <span className="h-2 w-2 rounded-full bg-secondary" />
          {engineLabel}
        </span>
      </div>
    </section>
  );
}
