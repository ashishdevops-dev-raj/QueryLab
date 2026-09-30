import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "@/pages/Dashboard";
import { PlaygroundPage } from "@/pages/Playground";
import { InterviewPage } from "@/pages/Interview";
import { ProjectsPage } from "@/pages/Projects";
import { HistoryPage } from "@/pages/History";
import { SettingsPage } from "@/pages/Settings";
import { NotFoundPage } from "@/pages/NotFound";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useUIStore } from "@/stores/useUIStore";
import { useQueryStore } from "@/stores/useQueryStore";
import { useEditorStore } from "@/stores/useEditorStore";
import { toast } from "sonner";

function applyTheme(theme: "light" | "dark" | "system") {
  const dark =
    theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

export default function App() {
  const theme = useSettingsStore((state) => state.theme);
  const openModal = useUIStore((state) => state.openModal);
  const runQuery = useQueryStore((state) => state.runQuery);
  const markSaved = useEditorStore((state) => state.markSaved);

  useEffect(() => {
    applyTheme(theme);
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const meta = event.ctrlKey || event.metaKey;
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);

      if (meta && event.key === "Enter") {
        event.preventDefault();
        void runQuery().then((result) => {
          if (result.status === "success") toast.success("Query executed successfully");
          else toast.error(result.error?.message ?? "Query execution failed");
        });
      }
      if (meta && event.key.toLowerCase() === "s") {
        event.preventDefault();
        markSaved();
        toast.success("Project saved");
      }
      if (meta && event.shiftKey && event.key.toLowerCase() === "p") {
        event.preventDefault();
        openModal("command");
      }
      if (!typing && event.key.toLowerCase() === "n" && !meta) {
        openModal("createProject");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openModal, runQuery, markSaved]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/playground" element={<PlaygroundPage />} />
      <Route path="/playground/:projectId" element={<PlaygroundPage />} />
      <Route path="/interview" element={<InterviewPage />} />
      <Route path="/interview/:questionId" element={<InterviewPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
