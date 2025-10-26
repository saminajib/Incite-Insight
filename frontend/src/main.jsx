import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import GraphTest from './pages/GraphTest'
import Home from './pages/Home';
import UploadCSV from './pages/Upload';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { Upload } from 'lucide-react'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadCSV />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
