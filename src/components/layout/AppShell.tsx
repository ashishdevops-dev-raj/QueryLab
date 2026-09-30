import type { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { Sidebar } from "./Sidebar";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ImportModal } from "@/components/modals/ImportModal";
import { ShareModal } from "@/components/modals/ShareModal";
import { ForkModal } from "@/components/modals/ForkModal";
import { CreateProjectModal } from "@/components/modals/CreateProjectModal";
import { HelpModal } from "@/components/modals/HelpModal";
import { CommandPalette } from "@/components/modals/CommandPalette";
import { ERDiagramModal } from "@/components/modals/ERDiagramModal";
import { useUIStore } from "@/stores/useUIStore";
import { cn } from "@/utils/cn";

export function AppShell({ children, flush = false }: { children: ReactNode; flush?: boolean }) {
  const collapsed = useUIStore((state) => state.sidebarCollapsed);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <TopNav />
      <Sidebar />
      <div className={cn("pt-16 transition-[padding] duration-200", collapsed ? "lg:pl-16" : "lg:pl-64")}>
        <main className={cn(flush ? "h-[calc(100vh-4rem)] overflow-hidden" : "min-h-[calc(100vh-4rem)]")}>{children}</main>
      </div>
      <ConfirmDialog />
      <ImportModal />
      <ShareModal />
      <ForkModal />
      <CreateProjectModal />
      <HelpModal />
      <CommandPalette />
      <ERDiagramModal />
    </div>
  );
}
