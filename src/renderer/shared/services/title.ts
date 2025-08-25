type TitleApiShape = {
  title: {
    set?: (t: string) => void
    onChanged: (h: (t: string) => void) => () => void
    get: () => Promise<string>
  }
}

function hasTitleApi(value: unknown): value is TitleApiShape {
  return (
    !!value &&
    typeof value === 'object' &&
    'title' in (value as Record<string, unknown>) &&
    typeof (value as { title: unknown }).title === 'object' &&
    value !== null
  )
}

export function setAppTitle(title: string): void {
  const api = window.xAPI as unknown
  if (hasTitleApi(api) && typeof api.title.set === 'function') {
    api.title.set(title)
  }
}

export function onTitleChanged(handler: (title: string) => void): () => void {
  const api = window.xAPI as unknown
  if (hasTitleApi(api)) {
    return api.title.onChanged(handler)
  }
  return () => {}
}

export async function getAppTitle(): Promise<string> {
  const api = window.xAPI as unknown
  if (hasTitleApi(api)) {
    return api.title.get()
  }
  return ''
}
