import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, LogIn, ShieldCheck } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        // Verify role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) throw profileError;

        if (profile.role === 'director') {
          // Keep the previous logic to inform other components
          localStorage.setItem('currentUser', JSON.stringify({ role: 'director' }));
          navigate('/dashboard');
        } else {
          throw new Error("Vous n'êtes pas autorisé à accéder à cet espace.");
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
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
          {error && <div style={{ color: 'white', background: 'var(--color-danger)', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
          
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

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 'var(--space-2)' }} disabled={loading}>
              {loading ? 'Connexion...' : <><LogIn size={18} /> Se connecter</>}
            </button>
          </form>

          <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-light)', textAlign: 'center' }}>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-3)', fontWeight: 500 }}>
              Pas encore de compte ? Inscrivez-vous :
            </p>
            <div className="stagger-children" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 'var(--space-2)', justifyContent: 'center' }}>
              <button type="button" className="btn btn-primary" style={{ flex: '1 1 0%', minWidth: '140px', whiteSpace: 'nowrap', padding: '10px' }} onClick={() => navigate('/register/director')}>
                Inscription Directeur
              </button>
              <button type="button" className="btn btn-secondary" style={{ flex: '1 1 0%', minWidth: '140px', whiteSpace: 'nowrap', padding: '10px' }} onClick={() => navigate('/login/parent')}>
                Connexion Parent
              </button>
              <button type="button" className="btn" style={{ flex: '1 1 100%', marginTop: 'var(--space-2)', whiteSpace: 'nowrap', padding: '12px', border: 'none', color: 'white', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', borderRadius: 'var(--radius-md)', fontWeight: 600, boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => navigate('/login/teacher')}>
                <GraduationCap size={18} /> Espace Enseignant
              </button>
              <div style={{ flex: '1 1 100%', display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'var(--space-3)', padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-primary-dark)', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={20} />
                </div>
                <p style={{ color: 'var(--color-primary-dark)', fontSize: '14px', lineHeight: 1.5, margin: 0, textAlign: 'left' }}>
                  <strong>Découvrez Edu-Pay</strong> : une solution vous permettant de gérer les paiements des élèves en toute sécurité.
                </p>
              </div>

              {/* Bouton de téléchargement Windows */}
              <div style={{ flex: '1 1 100%', marginTop: 'var(--space-2)' }}>
                <a 
                  href="/EduPay_Setup.exe"
                  download
                  className="btn" 
                  style={{ width: '100%', padding: '12px', border: '1px solid var(--border-light)', color: 'var(--text-main)', background: 'white', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                  Télécharger pour Windows (.exe)
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
