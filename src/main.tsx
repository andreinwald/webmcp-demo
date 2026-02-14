import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DemoStore } from './DemoStore.tsx'
import { registerWebMCPTools } from './WebMCP.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DemoStore />
  </StrictMode>,
)

registerWebMCPTools();