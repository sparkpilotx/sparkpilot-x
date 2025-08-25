import { useEffect } from 'react'
import { getRuntimeVersions } from '@rshared/services/system'
import { setAppTitle } from '@rshared/services/title'

export default function App(): React.JSX.Element {
  const versions = getRuntimeVersions()

  useEffect(() => {
    const id = setInterval(() => {
      const random = Math.random().toString(36).slice(2, 8)
      setAppTitle(`SparkPilot-X · ${random}`)
    }, 2000)
    return () => clearInterval(id)
  }, [])

  return (
    <main className="p-6 text-sm text-neutral-800 dark:text-neutral-200">
      <h1 className="text-xl font-semibold">Electron v37 + BaseWindow Starter</h1>
      <p className="mt-2 opacity-80">Minimal, modular renderer (React 19 + Tailwind v4).</p>
      <ul className="mt-4 grid grid-cols-2 gap-2 max-w-xs">
        <li className="flex justify-between">
          <span>Electron</span>
          <span>{versions.electron}</span>
        </li>
        <li className="flex justify-between">
          <span>Node</span>
          <span>{versions.node}</span>
        </li>
      </ul>
    </main>
  )
}
