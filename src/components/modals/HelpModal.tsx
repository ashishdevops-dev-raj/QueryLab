import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useUIStore } from "@/stores/useUIStore";

export function HelpModal() {
  const open = useUIStore((state) => state.activeModal === "help");
  const closeModal = useUIStore((state) => state.closeModal);

  return (
    <Dialog
      open={open}
      title="QueryLab shortcuts"
      onClose={closeModal}
      footer={<Button onClick={closeModal}>Close</Button>}
    >
      <dl className="space-y-2 text-body-sm">
        <div className="flex justify-between">
          <dt>Run query</dt>
          <dd className="font-mono text-code-sm">Ctrl + Enter</dd>
        </div>
        <div className="flex justify-between">
          <dt>Save project</dt>
          <dd className="font-mono text-code-sm">Ctrl + S</dd>
        </div>
        <div className="flex justify-between">
          <dt>Command palette</dt>
          <dd className="font-mono text-code-sm">Ctrl + Shift + P</dd>
        </div>
      </dl>
      <p className="mt-3 text-body-sm text-on-surface-variant">
        QueryLab runs SQL against in-memory mock tables in this browser. Production databases are never queried from the frontend.
      </p>
    </Dialog>
  );
}
