import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import './src/globals.css'

const Title = (): React.JSX.Element => {
  return (
    <div className="titlebar">
      <div className="titlebar__content">
        <span className="titlebar__title">SparkPilot-X</span>
      </div>
    </div>
  )
}

const container = document.getElementById('root')
if (!container) throw new Error('Titlebar root not found')
createRoot(container).render(
  <StrictMode>
    <Title />
  </StrictMode>,
)
