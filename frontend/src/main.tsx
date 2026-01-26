import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SimulationProvider } from './state/simulations.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SimulationProvider>
      <App />
    </SimulationProvider>
  </StrictMode>,
)
