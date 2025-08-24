import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import './src/globals.css'
import { App } from './src/App'

const container = document.getElementById('root')
if (!container) throw new Error('Root container not found')

const root = createRoot(container)
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
