import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { ERDiagram } from "@/components/database/ERDiagram";
import { useUIStore } from "@/stores/useUIStore";
import { useProjectStore } from "@/stores/useProjectStore";

export function ERDiagramModal() {
  const open = useUIStore((state) => state.activeModal === "er");
  const closeModal = useUIStore((state) => state.closeModal);
  const projects = useProjectStore((state) => state.projects);
  const activeProjectId = useProjectStore((state) => state.activeProjectId);
  const project = projects.find((item) => item.id === activeProjectId);

  return (
    <Dialog
      open={open}
      title="ER Diagram"
      description="Users.id → posts.user_id"
      className="max-w-4xl"
      onClose={closeModal}
      footer={<Button onClick={closeModal}>Close</Button>}
    >
      {project ? <ERDiagram schema={project.schema} /> : <p>No active project.</p>}
    </Dialog>
  );
}
