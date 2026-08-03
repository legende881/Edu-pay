import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, User, Mail, MapPin, Building, Map, ArrowRight } from 'lucide-react';

const RegisterDirector = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    schoolName: '',
    fullName: '',
    email: '',
    country: '',
    city: '',
    neighborhood: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulation d'une inscription réussie, retour au login
    navigate('/login');
  };

  return (
    <div className="page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)', padding: 'var(--space-6)' }}>
      <div className="app-card animate-scale-in" style={{ width: '100%', maxWidth: '540px', padding: '24px' }}>
        <div className="card-header" style={{ flexDirection: 'column', textAlign: 'center', padding: 'var(--space-8) var(--space-6) var(--space-4)', borderBottom: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', color: 'white', width: '72px', height: '72px', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)', boxShadow: 'var(--shadow-glow-success)' }}>
            <School size={36} />
          </div>
          <h2 style={{ fontSize: '28px', color: 'var(--text-main)', marginBottom: '8px' }}>Créer une école</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            Espace Directeur : Enregistrez votre établissement
          </p>
        </div>

        <div className="card-body" style={{ paddingTop: 0 }}>
          <form onSubmit={handleSubmit} className="form-group" style={{ gap: '20px', display: 'flex', flexDirection: 'column' }}>
            
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Nom de l'école <span style={{color: 'var(--color-danger)'}}>*</span></label>
              <div className="search-input-wrapper">
                <School className="search-icon" size={18} />
                <input type="text" name="schoolName" className="search-input" placeholder="Ex: Groupe Scolaire Excellence" required onChange={handleChange} />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Nom et Prénom <span style={{color: 'var(--color-danger)'}}>*</span></label>
              <div className="search-input-wrapper">
                <User className="search-icon" size={18} />
                <input type="text" name="fullName" className="search-input" placeholder="Votre nom complet" required onChange={handleChange} />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Adresse email <span style={{color: 'var(--color-danger)'}}>*</span></label>
              <div className="search-input-wrapper">
                <Mail className="search-icon" size={18} />
                <input type="email" name="email" className="search-input" placeholder="directeur@ecole.com" required onChange={handleChange} />
              </div>
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Pays <span style={{color: 'var(--color-danger)'}}>*</span></label>
                <div className="search-input-wrapper">
                  <Map className="search-icon" size={18} />
                  <input type="text" name="country" className="search-input" placeholder="Ex: Côte d'Ivoire" required onChange={handleChange} />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Ville <span style={{color: 'var(--color-danger)'}}>*</span></label>
                <div className="search-input-wrapper">
                  <Building className="search-icon" size={18} />
                  <input type="text" name="city" className="search-input" placeholder="Ex: Abidjan" required onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Quartier <span style={{color: 'var(--color-danger)'}}>*</span></label>
              <div className="search-input-wrapper">
                <MapPin className="search-icon" size={18} />
                <input type="text" name="neighborhood" className="search-input" placeholder="Ex: Cocody Angré" required onChange={handleChange} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px', padding: '14px', fontSize: '16px', borderRadius: 'var(--radius-md)' }}>
              S'inscrire <ArrowRight size={18} />
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <a href="/login" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Déjà un compte ? <span style={{color: 'var(--color-primary)', fontWeight: 500}}>Se connecter</span></a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterDirector;
