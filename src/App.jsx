import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import RegisterDirector from './pages/register-director';
import LoginParent from './pages/login-parent';
import ParentDashboard from './pages/parent-dashboard';
import LoginTeacher from './pages/login-teacher';
import TeacherDashboard from './pages/teacher-dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/director" element={<RegisterDirector />} />
        <Route path="/login/parent" element={<LoginParent />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login/teacher" element={<LoginTeacher />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        {/* Les autres routes seront ajoutées ici au fur et à mesure */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
