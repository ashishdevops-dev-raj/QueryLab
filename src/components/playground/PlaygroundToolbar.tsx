import { Button } from "@/components/ui/Button";
import { Play } from "lucide-react";

interface PlaygroundToolbarProps {
  onRun: () => void;
  onFormat: () => void;
  onExplain: () => void;
  onClear: () => void;
  onHistory: () => void;
  historyCount: number;
  running: boolean;
}

export function PlaygroundToolbar({
  onRun,
  onFormat,
  onExplain,
  onClear,
  onHistory,
  historyCount,
  running,
}: PlaygroundToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      <Button variant="ghost" size="sm" onClick={onFormat}>
        Format
      </Button>
      <Button variant="ghost" size="sm" onClick={onExplain}>
        Explain
      </Button>
      <Button variant="ghost" size="sm" onClick={onClear}>
        Clear
      </Button>
      <Button variant="outline" size="sm" onClick={onHistory}>
        History ({historyCount})
      </Button>
      <Button size="sm" disabled={running} onClick={onRun}>
        <Play className="h-4 w-4" />
        {running ? "Running…" : "Run"}
        <kbd className="ml-1 rounded bg-white/20 px-1 font-mono text-[10px]">Ctrl+↵</kbd>
      </Button>
    </div>
  );
}
