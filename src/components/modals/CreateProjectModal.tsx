import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useUIStore } from "@/stores/useUIStore";
import { useProjectStore } from "@/stores/useProjectStore";
import { DATABASE_ENGINES } from "@/types/database";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2, "Enter a project name"),
  engine: z.enum(["sqlserver", "postgres", "mysql", "sqlite", "duckdb"]),
  description: z.string().min(4, "Add a short description"),
});

type FormValues = z.infer<typeof schema>;

export function CreateProjectModal() {
  const open = useUIStore((state) => state.activeModal === "createProject");
  const closeModal = useUIStore((state) => state.closeModal);
  const createProject = useProjectStore((state) => state.createProject);
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "New Playground", engine: "sqlserver", description: "Untitled SQL workspace" },
  });

  return (
    <Dialog
      open={open}
      title="Create project"
      onClose={closeModal}
      footer={
        <>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit((values) => {
              const project = createProject(values);
              toast.success("Project saved");
              closeModal();
              navigate(`/playground/${project.id}`);
            })}
          >
            Create
          </Button>
        </>
      }
    >
      <form className="space-y-3" onSubmit={(event) => event.preventDefault()}>
        <label className="block text-body-sm">
          Project name
          <input
            className="mt-1 w-full rounded border border-outline-variant bg-surface-container-low px-2 py-1.5"
            {...form.register("name")}
          />
          {form.formState.errors.name ? (
            <span className="text-error">{form.formState.errors.name.message}</span>
          ) : null}
        </label>
        <label className="block text-body-sm">
          Database engine
          <select
            className="mt-1 w-full rounded border border-outline-variant bg-surface-container-low px-2 py-1.5"
            {...form.register("engine")}
          >
            {DATABASE_ENGINES.map((engine) => (
              <option key={engine.id} value={engine.id}>
                {engine.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-body-sm">
          Description
          <textarea
            className="mt-1 h-20 w-full rounded border border-outline-variant bg-surface-container-low px-2 py-1.5"
            {...form.register("description")}
          />
        </label>
      </form>
    </Dialog>
  );
}
