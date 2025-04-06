
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { ThemeWrapper } from './ThemeWrapper'

// Initialize empty adsbygoogle array if it doesn't exist
window.adsbygoogle = window.adsbygoogle || [];

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeWrapper>
        <App />
      </ThemeWrapper>
    </BrowserRouter>
  </React.StrictMode>,
)
