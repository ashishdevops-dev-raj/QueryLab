import { AppShell } from "@/components/layout/AppShell";
import { DATABASE_ENGINES } from "@/types/database";
import { useSettingsStore, type ThemePreference } from "@/stores/useSettingsStore";

export function SettingsPage() {
  const settings = useSettingsStore();

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6 p-4">
        <h1 className="text-headline-md">Settings</h1>

        <section className="rounded-lg bg-surface-container-lowest p-4 shadow-sm">
          <h2 className="mb-3 text-headline-sm">Editor</h2>
          <label className="mb-2 flex items-center justify-between text-body-sm">
            Font size
            <input
              type="number"
              min={11}
              max={20}
              className="w-24 rounded border border-outline-variant px-2 py-1"
              value={settings.fontSize}
              onChange={(event) => settings.setFontSize(Number(event.target.value))}
            />
          </label>
          <label className="mb-2 flex items-center justify-between text-body-sm">
            Tab size
            <input
              type="number"
              min={2}
              max={8}
              className="w-24 rounded border border-outline-variant px-2 py-1"
              value={settings.tabSize}
              onChange={(event) => settings.setTabSize(Number(event.target.value))}
            />
          </label>
          <label className="mb-2 flex items-center justify-between text-body-sm">
            Word wrap
            <input type="checkbox" checked={settings.wordWrap} onChange={(event) => settings.setWordWrap(event.target.checked)} />
          </label>
          <label className="flex items-center justify-between text-body-sm">
            Minimap
            <input type="checkbox" checked={settings.minimap} onChange={(event) => settings.setMinimap(event.target.checked)} />
          </label>
        </section>

        <section className="rounded-lg bg-surface-container-lowest p-4 shadow-sm">
          <h2 className="mb-3 text-headline-sm">Database</h2>
          <label className="block text-body-sm">
            Default database
            <select
              className="mt-1 w-full rounded border border-outline-variant px-2 py-1.5"
              value={settings.defaultDatabase}
              onChange={(event) => settings.setDefaultDatabase(event.target.value as typeof settings.defaultDatabase)}
            >
              {DATABASE_ENGINES.map((engine) => (
                <option key={engine.id} value={engine.id}>
                  {engine.label}
                </option>
              ))}
            </select>
          </label>
          <p className="mt-2 text-body-sm text-on-surface-variant">
            Connection preferences are stored locally. Production credentials must never be placed in VITE_* variables.
          </p>
        </section>

        <section className="rounded-lg bg-surface-container-lowest p-4 shadow-sm">
          <h2 className="mb-3 text-headline-sm">Appearance</h2>
          <div className="flex gap-2">
            {(["light", "dark", "system"] as ThemePreference[]).map((theme) => (
              <button
                key={theme}
                type="button"
                className={`rounded px-3 py-1.5 text-body-sm capitalize ${
                  settings.theme === theme ? "bg-primary-container text-on-primary-container" : "bg-surface-container"
                }`}
                onClick={() => settings.setTheme(theme)}
              >
                {theme}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-lg bg-surface-container-lowest p-4 shadow-sm">
          <h2 className="mb-3 text-headline-sm">Account</h2>
          <label className="mb-2 block text-body-sm">
            Profile
            <input
              className="mt-1 w-full rounded border border-outline-variant px-2 py-1.5"
              value={settings.displayName}
              onChange={(event) => settings.setProfile({ displayName: event.target.value })}
            />
          </label>
          <label className="block text-body-sm">
            Email
            <input
              className="mt-1 w-full rounded border border-outline-variant px-2 py-1.5"
              value={settings.email}
              onChange={(event) => settings.setProfile({ email: event.target.value })}
            />
          </label>
        </section>
      </div>
    </AppShell>
  );
}
