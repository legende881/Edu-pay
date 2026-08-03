import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogIn } from 'lucide-react';

const LoginParent = () => {
  const navigate = useNavigate();
  const [parentId, setParentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotPasswordModal, setForgotPasswordModal] = useState({ isOpen: false, step: 1, email: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    if (!parentId || !password) {
      setError('Veuillez entrer votre ID et mot de passe.');
      return;
    }
    
    // Vérification avec les familles enregistrées
    const savedFamilies = localStorage.getItem('eduPayFamilies');
    if (savedFamilies) {
      const families = JSON.parse(savedFamilies);
      const parent = families.find(f => f.parentId === parentId && f.parentPassword === password);
      
      if (parent) {
        localStorage.setItem('loggedParentId', parent.id);
        navigate('/parent-dashboard'); 
        return;
      }
    }
    
    setError('Identifiants incorrects.');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setForgotPasswordModal({ isOpen: true, step: 1, email: '' });
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
              <label className="form-label">Identifiant (ID) <span style={{color: 'var(--color-danger)'}}>*</span></label>
              <div className="search-input-wrapper">
                <User className="search-icon" size={18} />
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Ex: P1234" 
                  required 
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)} 
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Mot de passe <span style={{color: 'var(--color-danger)'}}>*</span></label>
              <div className="search-input-wrapper">
                <Lock className="search-icon" size={18} />
                <input 
                  type="password" 
                  className="search-input" 
                  placeholder="Votre mot de passe" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
              <div style={{ textAlign: 'right', marginTop: '8px' }}>
                <a href="#" onClick={handleForgotPassword} style={{ fontSize: '13px', color: 'var(--color-secondary)', textDecoration: 'none', fontWeight: 500 }}>
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            {error && <div style={{ color: '#EF4444', fontSize: '14px', textAlign: 'center', background: '#FEF2F2', padding: '8px', borderRadius: '4px' }}>{error}</div>}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px', padding: '14px', fontSize: '16px', borderRadius: 'var(--radius-md)', background: 'var(--color-secondary)' }}>
              Se connecter <LogIn size={18} />
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
            {forgotPasswordModal.step === 1 ? (
              <>
                <div style={{ background: '#EFF6FF', color: '#3B82F6', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <h3 style={{ marginBottom: '12px', fontSize: '20px' }}>Mot de passe oublié ?</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.5 }}>
                  Veuillez renseigner votre adresse e-mail. Nous vous enverrons un lien pour réinitialiser votre accès parent.
                </p>
                <div className="form-group" style={{ textAlign: 'left', marginBottom: '24px' }}>
                  <label className="form-label">Adresse e-mail</label>
                  <div className="search-input-wrapper">
                    <input 
                      type="email" 
                      className="search-input" 
                      placeholder="votre@email.com" 
                      value={forgotPasswordModal.email}
                      onChange={(e) => setForgotPasswordModal({...forgotPasswordModal, email: e.target.value})}
                      autoFocus
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn-outline" style={{ flex: 1, padding: '12px' }} onClick={() => setForgotPasswordModal({ isOpen: false, step: 1, email: '' })}>Annuler</button>
                  <button 
                    className="btn-primary" 
                    style={{ flex: 1, padding: '12px' }} 
                    onClick={() => {
                      if(!forgotPasswordModal.email || !forgotPasswordModal.email.includes('@')) {
                        alert("Veuillez saisir une adresse e-mail valide.");
                        return;
                      }
                      setForgotPasswordModal({...forgotPasswordModal, step: 2});
                    }}
                  >
                    Envoyer
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ background: '#ECFDF5', color: '#10B981', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <h3 style={{ marginBottom: '12px', fontSize: '20px', color: '#10B981' }}>Lien envoyé !</h3>
                <p style={{ color: 'var(--text-main)', fontSize: '15px', marginBottom: '24px', lineHeight: 1.5 }}>
                  Si un compte parent est associé à <strong style={{color: 'var(--color-secondary)'}}>{forgotPasswordModal.email}</strong>, un e-mail contenant les instructions a été envoyé.
                </p>
                <button className="btn-primary" style={{ width: '100%', padding: '12px' }} onClick={() => setForgotPasswordModal({ isOpen: false, step: 1, email: '' })}>
                  Retour à la connexion
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginParent;
