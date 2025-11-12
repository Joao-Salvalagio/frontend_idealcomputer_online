import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext'
import { RecommendationProvider } from './contexts/RecommendationContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RecommendationProvider>
        <App />
      </RecommendationProvider>
    </ThemeProvider>
  </StrictMode>,
)
