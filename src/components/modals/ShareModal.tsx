import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useUIStore } from "@/stores/useUIStore";
import { useProjectStore } from "@/stores/useProjectStore";
import { toast } from "sonner";

export function ShareModal() {
  const open = useUIStore((state) => state.activeModal === "share");
  const closeModal = useUIStore((state) => state.closeModal);
  const shareProject = useProjectStore((state) => state.shareProject);
  const activeProjectId = useProjectStore((state) => state.activeProjectId);
  const [visibility, setVisibility] = useState<"private" | "anyone">("anyone");
  const [permission, setPermission] = useState<"view" | "edit">("view");
  const [url, setUrl] = useState("");

  return (
    <Dialog
      open={open}
      title="Share project"
      description="Generate a mock share URL. No data leaves this browser."
      onClose={closeModal}
      footer={
        <>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button
            onClick={async () => {
              const next = shareProject(activeProjectId, visibility, permission);
              setUrl(next);
              await navigator.clipboard.writeText(next);
              toast.success("Query copied".replace("Query copied", "Link copied"));
            }}
          >
            Copy link
          </Button>
        </>
      }
    >
      <label className="mb-3 block text-body-sm">
        Access
        <select
          className="mt-1 w-full rounded border border-outline-variant bg-surface-container-low px-2 py-1.5"
          value={visibility}
          onChange={(event) => setVisibility(event.target.value as "private" | "anyone")}
        >
          <option value="anyone">Anyone with link</option>
          <option value="private">Private</option>
        </select>
      </label>
      <label className="mb-3 block text-body-sm">
        Permission
        <select
          className="mt-1 w-full rounded border border-outline-variant bg-surface-container-low px-2 py-1.5"
          value={permission}
          onChange={(event) => setPermission(event.target.value as "view" | "edit")}
        >
          <option value="view">View only</option>
          <option value="edit">Can edit</option>
        </select>
      </label>
      {url ? <p className="break-all rounded bg-surface-container-low p-2 font-mono text-code-sm">{url}</p> : null}
    </Dialog>
  );
}
