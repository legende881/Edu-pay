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
      // 1. D'abord, vérifier si c'est un administrateur ajouté par le directeur (table 'admins')
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('username', email)
        .eq('password', password)
        .single();

      if (adminData) {
        // C'est un administrateur !
        localStorage.setItem('currentUser', JSON.stringify({ role: 'admin', name: adminData.username }));
        navigate('/dashboard');
        return;
      }

      // 2. Sinon, essayer l'authentification principale Supabase (Directeur)
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
      let errorMessage = err.message || 'Erreur lors de la connexion';
      if (errorMessage.toLowerCase().includes('fetch')) {
        const urlUsed = import.meta.env.VITE_SUPABASE_URL || 'Non définie (fallback utilisé)';
        errorMessage = `Erreur réseau : Impossible de joindre Supabase. Vérifiez votre connexion. URL tentée: ${urlUsed}`;
      }
      setError(errorMessage);
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

              {/* Boutons de téléchargement (Windows, Android & iOS) */}
              <div style={{ flex: '1 1 100%', marginTop: 'var(--space-2)', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a 
                  href="https://drive.google.com/file/d/1-2w1Nqh8BsjObwGR2tGKkV83NWyHQCcd/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn" 
                  style={{ flex: '1 1 calc(33.333% - 10px)', minWidth: '120px', padding: '12px', border: '1px solid var(--border-light)', color: 'var(--text-main)', background: 'white', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#00a4ef">
                    <path d="M0,3.449L9.75,2.1v9.451H0V3.449z M10.25,2.026L24,0v11.551H10.25V2.026z M0,12.45h9.75v9.451L0,20.551V12.45z M10.25,12.45H24V24l-13.75-2.026V12.45z"/>
                  </svg>
                  Windows
                </a>
                
                <a 
                  href="/EduPay_Android.apk"
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn" 
                  style={{ flex: '1 1 calc(33.333% - 10px)', minWidth: '120px', padding: '12px', border: '1px solid var(--border-light)', color: 'var(--text-main)', background: 'white', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#3DDC84">
                    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4483-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997zm-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997zm11.4045-6.02l1.9973-3.4592c.1148-.1988.0465-.4522-.152-.5669-.1992-.1149-.4527-.0466-.5668.152l-2.021 3.5002C15.7196 8.3075 13.9317 7.95 12 7.95c-1.9312 0-3.719.3575-5.1384.9975L4.8402 5.4473c-.1149-.1986-.368-.2669-.5672-.152-.1988.1148-.2668.368-.152.5669l1.9977 3.4592C2.69 11.2344.5772 14.5422.0911 18.5583h23.8178c-.4857-4.0161-2.5985-7.3239-6.0274-9.2369z"/>
                  </svg>
                  Android
                </a>

                <a 
                  href="/EduPay_iOS.zip"
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn" 
                  style={{ flex: '1 1 calc(33.333% - 10px)', minWidth: '120px', padding: '12px', border: '1px solid var(--border-light)', color: 'var(--text-main)', background: 'white', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#000000">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.19 2.31-.88 3.5-.8 1.48.06 2.76.7 3.48 1.8-3.13 1.83-2.6 6.02.43 7.23-.74 1.76-1.58 3.06-2.49 3.94zm-3.64-13.4c.05-2.18 1.74-4.04 3.8-4.14.36 2.34-1.55 4.31-3.8 4.14z"/>
                  </svg>
                  iOS
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
