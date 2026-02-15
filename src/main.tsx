import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DemoStore } from './DemoStore.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DemoStore />
  </StrictMode>,
)