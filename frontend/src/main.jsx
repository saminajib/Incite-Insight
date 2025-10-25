import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import GraphTest from './pages/GraphTest'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <GraphTest /> */}
    < Dashboard />
  </StrictMode>,
)
