import { systemService } from './services/system'
import { version as reactVersion } from 'react'

export const App = (): React.JSX.Element => {
  const versions = systemService.versions()

  return (
    <main className="h-dvh w-dvw">
      <div className="flex h-full w-full">
        {/* Activity bar */}
        <aside className="w-[36px] border-r" style={{ borderColor: 'var(--titlebar-border)' }}>
          <div className="flex h-full flex-col items-center gap-2 py-1">
            <div className="h-[28px] w-[28px] grid place-items-center rounded-[6px] hover:bg-[rgba(0,0,0,0.04)]">
              E
            </div>
            <div className="h-[28px] w-[28px] grid place-items-center rounded-[6px] hover:bg-[rgba(0,0,0,0.04)]">
              S
            </div>
            <div className="h-[28px] w-[28px] grid place-items-center rounded-[6px] hover:bg-[rgba(0,0,0,0.04)]">
              V
            </div>
          </div>
        </aside>

        {/* Sidebar */}
        <nav className="w-[220px] border-r" style={{ borderColor: 'var(--titlebar-border)' }}>
          <div className="px-2 py-1 text-[var(--xs-font-size)] font-medium">Explorer</div>
          <ul className="px-1 text-[var(--xs-font-size)]">
            <li className="rounded-[4px] px-2 py-1 hover:bg-[rgba(0,0,0,0.04)]">workspace/</li>
            <li className="rounded-[4px] px-2 py-1 hover:bg-[rgba(0,0,0,0.04)]">src/</li>
            <li className="rounded-[4px] px-2 py-1 hover:bg-[rgba(0,0,0,0.04)]">README.md</li>
          </ul>
        </nav>

        {/* Editor area */}
        <section className="flex min-w-0 flex-1 flex-col">
          {/* Tab bar */}
          <div
            className="flex h-[28px] items-center gap-1 border-b px-2"
            style={{ borderColor: 'var(--titlebar-border)' }}
          >
            <div className="rounded-[4px] px-2 py-1 text-[var(--xs-font-size)] hover:bg-[rgba(0,0,0,0.04)]">
              Welcome.tsx
            </div>
            <div className="rounded-[4px] px-2 py-1 text-[var(--xs-font-size)] hover:bg-[rgba(0,0,0,0.04)]">
              App.tsx
            </div>
          </div>
          {/* Editor content */}
          <div className="flex-1 overflow-auto p-3 text-[var(--xs-font-size)]">
            <div
              className="rounded-[6px] border p-3"
              style={{ borderColor: 'var(--titlebar-border)' }}
            >
              <div className="mb-2 font-medium">Welcome</div>
              <div className="text-[color:rgba(0,0,0,0.7)]">
                Renderer ready. Preload says: <code>{systemService.ping()}</code>
              </div>
            </div>
          </div>

          {/* Panel: Terminal */}
          <div className="border-t" style={{ borderColor: 'var(--titlebar-border)' }}>
            <div className="flex h-[24px] items-center gap-2 px-2">
              <div className="rounded-[4px] px-2 py-0.5 text-[var(--xs-font-size)] hover:bg-[rgba(0,0,0,0.04)]">
                TERMINAL
              </div>
              <div className="ml-auto rounded-[4px] px-2 py-0.5 text-[var(--xs-font-size)] hover:bg-[rgba(0,0,0,0.04)]">
                +
              </div>
            </div>
            <div className="h-[140px] overflow-auto text-[var(--xs-font-size)]">
              <div className="px-2 py-1 font-mono">
                <div>
                  <span className="opacity-70">➜</span> echo Hello, SparkPilot-X
                </div>
                <div>Hello, SparkPilot-X</div>
                <div>
                  <span className="opacity-70">➜</span> node -v
                </div>
                <div>v{versions.node}</div>
                <div>
                  <span className="opacity-70">➜</span> electron -v
                </div>
                <div>v{versions.electron}</div>
              </div>
            </div>
          </div>
          {/* Status bar */}
          <footer
            className="flex h-[22px] items-center justify-between border-t px-2 text-[var(--xs-font-size)]"
            style={{ borderColor: 'var(--titlebar-border)' }}
          >
            <div>Ready</div>
            <div className="opacity-70">
              Node {versions.node} · Electron {versions.electron} · React {reactVersion}
            </div>
          </footer>
        </section>
      </div>
    </main>
  )
}
