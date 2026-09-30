import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useUIStore } from "@/stores/useUIStore";
import { useProjectStore } from "@/stores/useProjectStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function ForkModal() {
  const open = useUIStore((state) => state.activeModal === "fork");
  const closeModal = useUIStore((state) => state.closeModal);
  const projects = useProjectStore((state) => state.projects);
  const activeProjectId = useProjectStore((state) => state.activeProjectId);
  const forkProject = useProjectStore((state) => state.forkProject);
  const navigate = useNavigate();
  const project = projects.find((item) => item.id === activeProjectId);

  return (
    <Dialog
      open={open}
      title="Fork project"
      description={project ? `Creates “${project.name} - Fork” with schema, sample data, and SQL.` : "No project selected."}
      onClose={closeModal}
      footer={
        <>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const forked = forkProject(activeProjectId);
              if (forked) {
                toast.success("Project forked");
                closeModal();
                navigate(`/playground/${forked.id}`);
              }
            }}
          >
            Fork
          </Button>
        </>
      }
    >
      <ul className="list-disc space-y-1 pl-5 text-body-sm text-on-surface-variant">
        <li>Schema (DBML)</li>
        <li>Sample data</li>
        <li>SQL queries</li>
        <li>Project configuration</li>
      </ul>
    </Dialog>
  );
}
