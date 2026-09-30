import { DATABASE_ENGINES, type DatabaseEngine } from "@/types/database";
import { Database } from "lucide-react";

interface DatabaseSelectorProps {
  value: DatabaseEngine;
  onChange: (engine: DatabaseEngine) => void;
}

export function DatabaseSelector({ value, onChange }: DatabaseSelectorProps) {
  return (
    <div className="flex items-center gap-1 rounded bg-surface-container-lowest px-2 py-1 shadow-card">
      <Database className="h-[18px] w-[18px] text-primary" />
      <select
        aria-label="Database engine"
        className="cursor-pointer bg-transparent font-mono text-code-sm text-on-surface focus:outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value as DatabaseEngine)}
      >
        {DATABASE_ENGINES.map((engine) => (
          <option key={engine.id} value={engine.id}>
            {engine.label}
          </option>
        ))}
      </select>
    </div>
  );
}
