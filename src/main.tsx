import {StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import ChatWeb from "./ChatWeb.tsx";



createRoot(document.getElementById('ChatRoot')!).render(
  <StrictMode>
    <ChatWeb />
  </StrictMode>,
)
