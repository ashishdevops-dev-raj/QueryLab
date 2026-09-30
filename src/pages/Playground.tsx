import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { DatabaseStructure } from "@/components/playground/DatabaseStructure";
import { DataEditor } from "@/components/playground/DataEditor";
import { SqlEditor } from "@/components/playground/SqlEditor";
import { QueryResults } from "@/components/playground/QueryResults";
import { useProjectStore } from "@/stores/useProjectStore";

export function PlaygroundPage() {
  const { projectId } = useParams();
  const setActiveProject = useProjectStore((state) => state.setActiveProject);
  const projects = useProjectStore((state) => state.projects);

  useEffect(() => {
    if (projectId && projects.some((project) => project.id === projectId)) {
      setActiveProject(projectId);
    }
  }, [projectId, projects, setActiveProject]);

  return (
    <AppShell flush>
      <div className="h-full bg-surface-container-high/40 p-1">
        <PanelGroup direction="vertical" className="h-full">
          <Panel defaultSize={52} minSize={28}>
            <PanelGroup direction="horizontal" className="h-full">
              <Panel defaultSize={50} minSize={28}>
                <div className="h-full pr-0.5">
                  <DatabaseStructure />
                </div>
              </Panel>
              <PanelResizeHandle className="w-1 bg-outline-variant/40 hover:bg-primary" />
              <Panel defaultSize={50} minSize={28}>
                <div className="h-full pl-0.5">
                  <SqlEditor />
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
          <PanelResizeHandle className="h-1 bg-outline-variant/40 hover:bg-primary" />
          <Panel defaultSize={48} minSize={24}>
            <PanelGroup direction="horizontal" className="h-full">
              <Panel defaultSize={50} minSize={28}>
                <div className="h-full pr-0.5 pt-1">
                  <DataEditor />
                </div>
              </Panel>
              <PanelResizeHandle className="w-1 bg-outline-variant/40 hover:bg-primary" />
              <Panel defaultSize={50} minSize={28}>
                <div className="h-full pl-0.5 pt-1">
                  <QueryResults />
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </AppShell>
  );
}
