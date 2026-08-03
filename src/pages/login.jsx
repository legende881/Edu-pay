import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simuler une connexion réussie pour le moment
    navigate('/dashboard');
  };

  return (
    <div className="page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-sidebar)' }}>
      <div className="app-card animate-scale-in" style={{ width: '100%', maxWidth: '420px', margin: 'var(--space-4)', padding: '24px' }}>
        <div className="card-header" style={{ flexDirection: 'column', textAlign: 'center', padding: 'var(--space-8) var(--space-6) var(--space-4)' }}>
          <div style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)', width: '64px', height: '64px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
            <GraduationCap size={32} />
          </div>
          <h2>EduPay</h2>
          <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-2)' }}>
            Gestion des paiements scolaires
          </p>
        </div>

        <div className="card-body">
          <form onSubmit={handleLogin} className="form-group" style={{ gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">
                Adresse email <span className="required">*</span>
              </label>
              <div className="search-input-wrapper" style={{ maxWidth: '100%' }}>
                <Mail className="search-icon" size={18} />
                <input
                  type="email"
                  className="search-input"
                  placeholder="directeur@ecole-demo.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Mot de passe <span className="required">*</span>
              </label>
              <div className="search-input-wrapper" style={{ maxWidth: '100%' }}>
                <Lock className="search-icon" size={18} />
                <input
                  type="password"
                  className="search-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 'var(--space-2)' }}>
              Se connecter <LogIn size={18} />
            </button>
          </form>

          <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-light)', textAlign: 'center' }}>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-3)', fontWeight: 500 }}>
              Pas encore de compte ? Inscrivez-vous :
            </p>
            <div className="stagger-children" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 'var(--space-2)', justifyContent: 'center' }}>
              <button type="button" className="btn btn-primary" style={{ flex: '1 1 0%', whiteSpace: 'nowrap', padding: '10px' }} onClick={() => navigate('/register/director')}>
                Inscription Directeur
              </button>
              <button type="button" className="btn btn-secondary" style={{ flex: '1 1 0%', whiteSpace: 'nowrap', padding: '10px' }} onClick={() => navigate('/register/parent')}>
                Inscription Parent
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
