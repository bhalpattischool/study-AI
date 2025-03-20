
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { ThemeWrapper } from './ThemeWrapper'
import { Toaster } from './components/ui/toaster'
import { Toaster as SonnerToaster } from 'sonner'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeWrapper>
      <Toaster />
      <SonnerToaster position="top-right" />
    </ThemeWrapper>
  </React.StrictMode>,
)
