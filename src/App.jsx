import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Students from './pages/students';
import Payments from './pages/payments';
import ParentDashboard from './pages/parent-dashboard';
import TeacherDashboard from './pages/teacher-dashboard';
import ParentLogin from './pages/login-parent';
import TeacherLogin from './pages/login-teacher';
import RegisterDirector from './pages/register-director';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/login/parent" element={<ParentLogin />} />
        <Route path="/login/teacher" element={<TeacherLogin />} />
        <Route path="/register/director" element={<RegisterDirector />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
