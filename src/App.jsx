import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import RegisterDirector from './pages/register-director';

// Placeholder pour l'Inscription Parent
const RegisterParent = () => (
  <div className="page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-sidebar)' }}>
    <div className="card animate-scale-in" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
      <h2>Inscription Parent</h2>
      <p style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>La page d'inscription Parent est en cours de création...</p>
      <a href="/login" className="btn btn-primary">Retour à la connexion</a>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/director" element={<RegisterDirector />} />
        <Route path="/register/parent" element={<RegisterParent />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Les autres routes seront ajoutées ici au fur et à mesure */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
