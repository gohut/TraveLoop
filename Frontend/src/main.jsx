import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { TravelAppProvider } from './context/TravelAppContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TravelAppProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TravelAppProvider>
  </StrictMode>,
)
