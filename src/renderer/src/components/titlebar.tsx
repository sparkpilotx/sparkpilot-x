import { useEffect } from 'react'
import { useAppStore } from '@/stores/use-app-store'
import { onTitleChanged, getAppTitle } from '@/services/title'

export default function Titlebar(): React.JSX.Element {
  const title = useAppStore((s) => s.title)
  const setTitle = useAppStore((s) => s.setTitle)

  useEffect(() => {
    void (async () => {
      try {
        setTitle(await getAppTitle())
      } catch {}
    })()
    return onTitleChanged(setTitle)
  }, [setTitle])
  return (
    <header className="flex h-8 items-center justify-between px-2 select-none" data-drag>
      <div className="text-xs font-medium opacity-75">{title}</div>
      <div className="flex items-center gap-2" data-no-drag>
        {/* Placeholder for window controls if needed */}
      </div>
    </header>
  )
}
