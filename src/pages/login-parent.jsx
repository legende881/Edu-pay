import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../supabaseClient';

const LoginParent = () => {
  const navigate = useNavigate();
  const [parentIdInput, setParentIdInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState({ isOpen: false });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!parentIdInput || !password) {
      setError('Veuillez entrer votre ID Parent et mot de passe.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase
        .from('families')
        .select('*')
        .eq('parent_id', parentIdInput)
        .eq('password', password)
        .single();

      if (signInError || !data) {
        throw new Error('Identifiants incorrects.');
      }

      // Login success
      localStorage.setItem('loggedParentId', data.id);
      navigate('/parent-dashboard'); 
    } catch (err) {
      console.error(err);
      setError('Identifiants incorrects.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setForgotPasswordModal({ isOpen: true });
  };

  return (
    <div className="page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)', padding: 'var(--space-6)' }}>
      <div className="app-card animate-scale-in" style={{ width: '100%', maxWidth: '420px', padding: '24px' }}>
        <div className="card-header" style={{ flexDirection: 'column', textAlign: 'center', padding: 'var(--space-8) var(--space-6) var(--space-4)', borderBottom: 'none' }}>
          <div style={{ background: 'var(--color-secondary)', color: 'white', width: '72px', height: '72px', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)', boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)' }}>
            <User size={36} />
          </div>
          <h2 style={{ fontSize: '28px', color: 'var(--text-main)', marginBottom: '8px' }}>Espace Parent</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            Connectez-vous pour suivre les paiements de vos enfants.
          </p>
        </div>

        <div className="card-body" style={{ paddingTop: 0 }}>
          <form onSubmit={handleLogin} className="form-group" style={{ gap: '20px', display: 'flex', flexDirection: 'column' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">ID Parent <span style={{color: 'var(--color-danger)'}}>*</span></label>
              <div className="search-input-wrapper">
                <User className="search-icon" size={18} />
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Ex: P1234" 
                  required 
                  value={parentIdInput}
                  onChange={(e) => setParentIdInput(e.target.value)} 
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Mot de passe <span style={{color: 'var(--color-danger)'}}>*</span></label>
              <div className="search-input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock className="search-icon" size={18} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="search-input" 
                  placeholder="Votre mot de passe" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  style={{ paddingRight: '40px' }}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex' }}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              <div style={{ textAlign: 'right', marginTop: '8px' }}>
                <a href="#" onClick={handleForgotPassword} style={{ fontSize: '13px', color: 'var(--color-secondary)', textDecoration: 'none', fontWeight: 500 }}>
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            {error && <div style={{ color: '#EF4444', fontSize: '14px', textAlign: 'center', background: '#FEF2F2', padding: '8px', borderRadius: '4px' }}>{error}</div>}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px', padding: '14px', fontSize: '16px', borderRadius: 'var(--radius-md)', background: 'var(--color-secondary)' }} disabled={loading}>
              {loading ? 'Connexion...' : <><LogIn size={18} /> Se connecter</>}
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <a href="/login" style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'none' }}>
                <span style={{color: 'var(--color-primary)', fontWeight: 500}}>Retour à l'accueil</span>
              </a>
            </div>
          </form>
        </div>
      </div>
      {/* Modal Mot de passe oublié */}
      {forgotPasswordModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(6px)' }}>
          <div className="app-card animate-scale-in" style={{ width: '100%', maxWidth: '400px', padding: '32px', textAlign: 'center', margin: '16px' }}>
            <div style={{ background: '#EFF6FF', color: '#3B82F6', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Lock size={32} />
            </div>
            <h3 style={{ marginBottom: '12px', fontSize: '20px' }}>Identifiants oubliés ?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.5 }}>
              Veuillez contacter la direction de l'école pour récupérer votre ID Parent ou réinitialiser votre mot de passe.
            </p>
            <button className="btn-primary" style={{ width: '100%', padding: '12px' }} onClick={() => setForgotPasswordModal({ isOpen: false })}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginParent;
