import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useUIStore } from "@/stores/useUIStore";
import { useDataStore } from "@/stores/useDataStore";
import { useProjectStore } from "@/stores/useProjectStore";
import { toast } from "sonner";
import { parseCsv } from "@/utils/csv";
import { parseDbml } from "@/utils/dbml";
import { cn } from "@/utils/cn";

type Tab = "CSV" | "SQL" | "DBML";

export function ImportModal() {
  const open = useUIStore((state) => state.activeModal === "import");
  const closeModal = useUIStore((state) => state.closeModal);
  const importCsv = useDataStore((state) => state.importCsv);
  const applyDbml = useDataStore((state) => state.applyDbml);
  const activeTable = useDataStore((state) => state.activeTable);
  const updateProject = useProjectStore((state) => state.updateProject);
  const activeProjectId = useProjectStore((state) => state.activeProjectId);
  const [tab, setTab] = useState<Tab>("CSV");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onImport = () => {
    setError(null);
    if (!text.trim()) {
      setError("Paste or drop content before importing.");
      return;
    }
    if (tab === "CSV") {
      const parsed = parseCsv(text);
      if (parsed.columns.length === 0) {
        setError("CSV must include a header row.");
        return;
      }
      importCsv(activeTable, text);
      toast.success("Schema imported");
      closeModal();
      return;
    }
    if (tab === "DBML") {
      const { errors } = parseDbml(text);
      if (errors.length) {
        setError(errors[0]);
        return;
      }
      const applied = applyDbml(text);
      if (applied.length) {
        setError(applied[0]);
        return;
      }
      toast.success("Schema imported");
      closeModal();
      return;
    }
    updateProject(activeProjectId, { sql: text });
    toast.success("SQL imported");
    closeModal();
  };

  return (
    <Dialog
      open={open}
      title="Import"
      description="Bring CSV, SQL, or DBML into the active project."
      onClose={closeModal}
      footer={
        <>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={onImport}>Import</Button>
        </>
      }
    >
      <div className="mb-2 flex gap-1 rounded bg-surface-container p-0.5">
        {(["CSV", "SQL", "DBML"] as Tab[]).map((item) => (
          <button
            key={item}
            type="button"
            className={cn(
              "flex-1 rounded px-2 py-1 text-body-sm",
              tab === item ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant",
            )}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <label
        className="mb-2 flex h-24 cursor-pointer items-center justify-center rounded-lg border border-dashed border-outline-variant text-body-sm text-on-surface-variant"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer.files[0];
          if (!file) return;
          void file.text().then(setText);
        }}
      >
        Drag and drop a file, or paste below
        <input
          type="file"
          className="hidden"
          accept=".csv,.sql,.dbml,.txt"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void file.text().then(setText);
          }}
        />
      </label>
      <textarea
        className="h-40 w-full rounded border border-outline-variant bg-surface-container-low p-2 font-mono text-code-sm text-on-surface focus:outline-none"
        placeholder={tab === "CSV" ? "id,username,role,age" : tab === "SQL" ? "SELECT ..." : "Table users { ... }"}
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      {error ? <p className="mt-2 text-body-sm text-error">{error}</p> : null}
    </Dialog>
  );
}
