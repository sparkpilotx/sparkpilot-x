import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Titlebar from '../../src/components/titlebar'

const container = document.getElementById('titlebar-root')!
createRoot(container).render(
  <StrictMode>
    <Titlebar />
  </StrictMode>,
)
