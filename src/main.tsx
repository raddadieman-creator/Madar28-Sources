import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// الخط مستضاف ذاتيًا ضمن المشروع: أسرع، ولا يعتمد على خدمات خارجية
import '@fontsource/almarai/400.css'
import '@fontsource/almarai/700.css'
import '@fontsource/almarai/800.css'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
