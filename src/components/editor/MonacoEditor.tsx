import { lazy, Suspense } from "react";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { LoadingState } from "@/components/common/EmptyState";

const Editor = lazy(() => import("@monaco-editor/react"));

interface MonacoEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
  onMount?: (instance: { addCommand: (keybinding: number, handler: () => void) => void }) => void;
  className?: string;
}

export function MonacoEditor({ value, language, onChange, onMount, className }: MonacoEditorProps) {
  const fontSize = useSettingsStore((state) => state.fontSize);
  const tabSize = useSettingsStore((state) => state.tabSize);
  const wordWrap = useSettingsStore((state) => state.wordWrap);
  const minimap = useSettingsStore((state) => state.minimap);
  const themePref = useSettingsStore((state) => state.theme);
  const isDark =
    themePref === "dark" ||
    (themePref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div className={className ?? "h-full min-h-[140px]"}>
      <Suspense fallback={<LoadingState label="Loading editor…" />}>
        <Editor
          value={value}
          language={language}
          theme={isDark ? "vs-dark" : "vs"}
          onChange={(next) => onChange(next ?? "")}
          onMount={onMount}
          options={{
            fontSize,
            tabSize,
            wordWrap: wordWrap ? "on" : "off",
            minimap: { enabled: minimap },
            fontFamily: "JetBrains Mono, ui-monospace, monospace",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            renderLineHighlight: "line",
            folding: true,
            lineNumbers: "on",
            padding: { top: 8 },
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            formatOnPaste: true,
          }}
        />
      </Suspense>
    </div>
  );
}
