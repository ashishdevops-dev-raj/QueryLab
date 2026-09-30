import { useCallback, useMemo, lazy, Suspense } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { toPng } from "html-to-image";
import type { DatabaseSchema } from "@/types/database";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/common/EmptyState";

interface ERDiagramProps {
  schema: DatabaseSchema;
}

function ERDiagramInner({ schema }: ERDiagramProps) {
  const nodes: Node[] = useMemo(
    () =>
      schema.tables.map((table, index) => ({
        id: table.name,
        position: { x: 80 + (index % 2) * 280, y: 60 + Math.floor(index / 2) * 240 },
        data: {
          label: (
            <div className="min-w-[180px] overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest text-left shadow-card">
              <div className="bg-primary-container px-3 py-1.5 font-mono text-code-sm font-semibold uppercase text-on-primary-container">
                {table.name}
              </div>
              <ul className="px-3 py-2 font-mono text-code-sm text-on-surface">
                {table.columns.map((column) => (
                  <li key={column.name} className="flex justify-between gap-3">
                    <span>
                      {column.name}
                      {column.primaryKey ? " PK" : ""}
                      {column.foreignKey ? " FK" : ""}
                    </span>
                    <span className="text-outline">{column.type}</span>
                  </li>
                ))}
              </ul>
            </div>
          ),
        },
        style: { background: "transparent", border: "none", width: "auto" },
      })),
    [schema.tables],
  );

  const edges: Edge[] = useMemo(
    () =>
      schema.relationships.map((rel, index) => ({
        id: `${rel.fromTable}-${rel.toTable}-${index}`,
        source: rel.toTable,
        target: rel.fromTable,
        label: `${rel.toTable}.${rel.toColumn} → ${rel.fromTable}.${rel.fromColumn}`,
        animated: false,
        style: { stroke: "#004ac6" },
      })),
    [schema.relationships],
  );

  const exportPng = useCallback(async () => {
    const node = document.querySelector(".react-flow") as HTMLElement | null;
    if (!node) return;
    const dataUrl = await toPng(node, { backgroundColor: "#ffffff" });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "querylab-er.png";
    link.click();
  }, []);

  return (
    <div className="flex h-[480px] flex-col">
      <div className="mb-2 flex justify-end">
        <Button variant="secondary" size="sm" onClick={() => void exportPng()}>
          Export PNG
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-outline-variant">
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background />
          <Controls showInteractive={false} />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}

const LazyFlow = lazy(async () => ({ default: ERDiagramInner }));

export function ERDiagram({ schema }: ERDiagramProps) {
  return (
    <Suspense fallback={<LoadingState label="Loading ER diagram…" />}>
      <LazyFlow schema={schema} />
    </Suspense>
  );
}
