import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex h-full flex-col items-center justify-center gap-2 p-6 text-center", className)}>
      {icon}
      <p className="text-headline-sm text-on-surface">{title}</p>
      {description ? <p className="max-w-sm text-body-sm text-on-surface-variant">{description}</p> : null}
      {action}
    </div>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex h-full items-center justify-center gap-2 text-body-sm text-on-surface-variant">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
      {label}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-surface-container", className)} />;
}

export function ErrorState({
  title,
  message,
  details,
}: {
  title: string;
  message: string;
  details?: string;
}) {
  return (
    <div className="m-3 rounded-lg border border-error/30 bg-error-container/40 p-3 text-body-sm">
      <p className="font-semibold text-on-error-container">{title}</p>
      <p className="text-on-error-container">{message}</p>
      {details ? (
        <details className="mt-2">
          <summary className="cursor-pointer text-label-md text-on-error-container">View Details</summary>
          <pre className="mt-1 overflow-auto font-mono text-code-sm">{details}</pre>
        </details>
      ) : null}
    </div>
  );
}
