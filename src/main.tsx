import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import LandingPage from './components/LandingPage.tsx'
import ManagerPanel from './components/ManagerPanel.tsx'
import PropertyPage from './components/PropertyPage.tsx'
import Layout from './components/Layout.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/catalogo" element={<App />} />
          <Route path="/managerLogin" element={<ManagerPanel />} />
          <Route path="/propiedad/:id" element={<PropertyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
) 