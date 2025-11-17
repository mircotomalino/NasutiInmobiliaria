import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import LandingPage from './components/LandingPage.tsx'
import ManagerPanel from './components/ManagerPanel.tsx'
import PropertyPage from './components/PropertyPage.tsx'
import Layout from './components/Layout.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/catalogo" element={<App />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <ManagerPanel />
              </ProtectedRoute>
            } />
            <Route path="/propiedad/:id" element={<PropertyPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
) 