import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "@/stores/useUIStore";
import { useQueryStore } from "@/stores/useQueryStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useEditorStore } from "@/stores/useEditorStore";
import { toast } from "sonner";

export function CommandPalette() {
  const open = useUIStore((state) => state.activeModal === "command");
  const closeModal = useUIStore((state) => state.closeModal);
  const openModal = useUIStore((state) => state.openModal);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const runQuery = useQueryStore((state) => state.runQuery);
  const formatCurrent = useQueryStore((state) => state.formatCurrent);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const theme = useSettingsStore((state) => state.theme);
  const markSaved = useEditorStore((state) => state.markSaved);
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) setValue("");
  }, [open]);

  if (!open) return null;

  const run = (fn: () => void) => {
    fn();
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center pt-[15vh]">
      <button type="button" className="absolute inset-0 bg-inverse-surface/40" aria-label="Close palette" onClick={closeModal} />
      <Command
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-modal"
        value={value}
        onValueChange={setValue}
      >
        <Command.Input
          autoFocus
          placeholder="Run a command…"
          className="w-full border-b border-outline-variant/40 px-4 py-3 text-body-md outline-none"
        />
        <Command.List className="max-h-72 overflow-auto p-1">
          <Command.Empty className="px-3 py-6 text-center text-body-sm text-on-surface-variant">
            No matching commands
          </Command.Empty>
          <Command.Item className="cursor-pointer rounded px-3 py-2 text-body-sm aria-selected:bg-primary-fixed" onSelect={() => run(() => void runQuery())}>
            Run Query
          </Command.Item>
          <Command.Item className="cursor-pointer rounded px-3 py-2 text-body-sm aria-selected:bg-primary-fixed" onSelect={() => run(() => { markSaved(); toast.success("Project saved"); })}>
            Save Project
          </Command.Item>
          <Command.Item className="cursor-pointer rounded px-3 py-2 text-body-sm aria-selected:bg-primary-fixed" onSelect={() => run(() => formatCurrent())}>
            Format SQL
          </Command.Item>
          <Command.Item className="cursor-pointer rounded px-3 py-2 text-body-sm aria-selected:bg-primary-fixed" onSelect={() => run(() => openModal("createProject"))}>
            New Project
          </Command.Item>
          <Command.Item className="cursor-pointer rounded px-3 py-2 text-body-sm aria-selected:bg-primary-fixed" onSelect={() => run(() => navigate("/dashboard"))}>
            Open Dashboard
          </Command.Item>
          <Command.Item className="cursor-pointer rounded px-3 py-2 text-body-sm aria-selected:bg-primary-fixed" onSelect={() => run(() => navigate("/playground"))}>
            Open Playground
          </Command.Item>
          <Command.Item className="cursor-pointer rounded px-3 py-2 text-body-sm aria-selected:bg-primary-fixed" onSelect={() => run(() => navigate("/interview"))}>
            Open Interview
          </Command.Item>
          <Command.Item className="cursor-pointer rounded px-3 py-2 text-body-sm aria-selected:bg-primary-fixed" onSelect={() => run(() => navigate("/history"))}>
            Open History
          </Command.Item>
          <Command.Item className="cursor-pointer rounded px-3 py-2 text-body-sm aria-selected:bg-primary-fixed" onSelect={() => run(toggleSidebar)}>
            Toggle Sidebar
          </Command.Item>
          <Command.Item
            className="cursor-pointer rounded px-3 py-2 text-body-sm aria-selected:bg-primary-fixed"
            onSelect={() =>
              run(() => setTheme(theme === "dark" ? "light" : "dark"))
            }
          >
            Toggle Theme
          </Command.Item>
        </Command.List>
      </Command>
    </div>
  );
}
