export function QueryLabLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#2563eb" />
      <path
        d="M8 11.5c0-1.2 3.6-2.2 8-2.2s8 1 8 2.2-3.6 2.2-8 2.2-8-1-8-2.2Z"
        stroke="#fff"
        strokeWidth="1.6"
        fill="none"
      />
      <path d="M8 11.5v9c0 1.2 3.6 2.2 8 2.2s8-1 8-2.2v-9" stroke="#fff" strokeWidth="1.6" fill="none" />
      <path d="M8 16c0 1.2 3.6 2.2 8 2.2s8-1 8-2.2" stroke="#fff" strokeWidth="1.6" fill="none" />
    </svg>
  );
}
