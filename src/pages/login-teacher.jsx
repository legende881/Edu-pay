import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Key, Lock, LogIn, User } from 'lucide-react';

const LoginTeacher = () => {
  const navigate = useNavigate();
  const [teacherId, setTeacherId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    const savedTeachers = localStorage.getItem('eduPayTeachers');
    const teachers = savedTeachers ? JSON.parse(savedTeachers) : [];
    
    const teacher = teachers.find(t => t.id === teacherId && t.password === password);
    
    if (teacher) {
      localStorage.setItem('currentUser', JSON.stringify({ role: 'teacher', id: teacher.id, name: teacher.name }));
      navigate('/teacher-dashboard');
      return;
    }
    
    // Démo fallback
    if (teacherId === 'ENS-DEMO' && password === '1234') {
      localStorage.setItem('currentUser', JSON.stringify({ role: 'teacher', id: 'ENS-DEMO', name: 'Enseignant Démo' }));
      navigate('/teacher-dashboard');
      return;
    }
    
    setError('Identifiant ou mot de passe incorrect.');
  };

  return (
    <div className="page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)' }}>
      <div className="app-card animate-scale-in" style={{ width: '100%', maxWidth: '420px', margin: 'var(--space-4)', padding: 0, overflow: 'hidden' }}>
        <div className="card-header" style={{ flexDirection: 'column', textAlign: 'center', padding: 'var(--space-8) var(--space-6) var(--space-4)', background: '#F8FAFC' }}>
          <div style={{ background: '#EFF6FF', color: '#3B82F6', width: '64px', height: '64px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
            <User size={32} />
          </div>
          <h2>Espace Enseignant</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-2)' }}>
            Connectez-vous pour consulter vos classes
          </p>
        </div>

        <div className="card-body" style={{ padding: '32px' }}>
          <form onSubmit={handleLogin} className="form-group" style={{ gap: 'var(--space-4)' }}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                ID Enseignant <span className="required" style={{color: 'var(--color-danger)'}}>*</span>
              </label>
              <div className="search-input-wrapper" style={{ position: 'relative' }}>
                <Key className="search-icon" size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Ex: ENS-001"
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value.toUpperCase())}
                  required
                  style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1px solid var(--border-light)', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                Mot de passe <span className="required" style={{color: 'var(--color-danger)'}}>*</span>
              </label>
              <div className="search-input-wrapper" style={{ position: 'relative' }}>
                <Lock className="search-icon" size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  className="search-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1px solid var(--border-light)', borderRadius: '8px' }}
                />
              </div>
            </div>

            {error && (
              <div style={{ padding: '12px', background: '#FEF2F2', color: '#EF4444', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', background: '#3B82F6', padding: '12px', borderRadius: '8px', color: 'white', border: 'none', fontWeight: 600, fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              Se connecter <LogIn size={18} />
            </button>
          </form>
          
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button type="button" onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }}>
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginTeacher;
