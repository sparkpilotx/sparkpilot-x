import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

function Titlebar(): React.JSX.Element {
  return (
    <header
      className="flex h-8 items-center justify-between px-2 select-none"
      style={{ WebkitAppRegion: 'drag' }}
    >
      <div className="text-xs font-medium opacity-75">SparkPilot-X</div>
      <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' }}>
        {/* Placeholder for window controls if needed */}
      </div>
    </header>
  )
}

const container = document.getElementById('titlebar-root')!
createRoot(container).render(
  <StrictMode>
    <Titlebar />
  </StrictMode>,
)
