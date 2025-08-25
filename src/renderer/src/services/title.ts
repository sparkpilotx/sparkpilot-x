export function setAppTitle(title: string): void {
  window.xAPI.title.set(title)
}

export function onTitleChanged(handler: (title: string) => void): () => void {
  return window.xAPI.title.onChanged(handler)
}

export async function getAppTitle(): Promise<string> {
  return window.xAPI.title.get()
}


