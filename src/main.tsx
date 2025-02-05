import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FullChatApp from './FullChatApp.tsx'

createRoot(document.getElementById('ChatRoot')!).render(
  <StrictMode>
    <FullChatApp />
  </StrictMode>,
)
