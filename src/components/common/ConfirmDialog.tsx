import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useUIStore } from "@/stores/useUIStore";

export function ConfirmDialog() {
  const activeModal = useUIStore((state) => state.activeModal);
  const message = useUIStore((state) => state.confirmMessage);
  const action = useUIStore((state) => state.confirmAction);
  const closeModal = useUIStore((state) => state.closeModal);

  return (
    <Dialog
      open={activeModal === "confirm"}
      title="Confirm"
      onClose={closeModal}
      footer={
        <>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              action?.();
              closeModal();
            }}
          >
            Confirm
          </Button>
        </>
      }
    >
      <p className="text-body-md text-on-surface">{message}</p>
    </Dialog>
  );
}
