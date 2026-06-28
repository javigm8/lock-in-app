// Punto de entrada de la app React con contextos globales
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './styles/index.css'
import App from './App.jsx'
import { ThemeProvider } from './theme.jsx'
import { TimerProvider } from './TimerContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <TimerProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </TimerProvider>
    </ThemeProvider>
  </StrictMode>,
)
