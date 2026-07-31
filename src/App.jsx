import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import RegisterDirector from './pages/register-director';

import RegisterParent from './pages/register-parent';

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
