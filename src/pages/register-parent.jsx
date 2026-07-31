import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RegisterParent = () => {
  const navigate = useNavigate();
  const [numberOfChildren, setNumberOfChildren] = useState(1);

  const handleNumberChange = (e) => {
    const num = parseInt(e.target.value, 10);
    setNumberOfChildren(num);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Redirection vers le dashboard après inscription
    navigate('/dashboard');
  };

  return (
    <div className="page" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 'var(--space-4)', backgroundColor: 'var(--bg-app)' }}>
      <div className="card" style={{ maxWidth: '800px', width: '100%' }}>
        <div className="card-header" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '64px', height: '64px', background: 'var(--color-primary-light)', borderRadius: '50%', marginBottom: '16px' }}>
            <Users size={32} color="white" />
          </div>
          <h2 style={{ fontSize: '24px', margin: 0 }}>Les informations vous concernant vous et vos enfants</h2>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            
            {/* Informations du parent */}
            <h3 style={{ marginBottom: '16px', color: 'var(--color-primary)', fontSize: '18px' }}>Vos Informations</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Nom</label>
                <input type="text" className="search-input" placeholder="Votre nom" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Prénom</label>
                <input type="text" className="search-input" placeholder="Votre prénom" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Numéro WhatsApp</label>
                <input type="tel" className="search-input" placeholder="Ex: +225 0102030405" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Numéro d'Appel Direct</label>
                <input type="tel" className="search-input" placeholder="Ex: +225 0102030405" required />
              </div>
            </div>

            {/* Nombre d'enfants */}
            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label className="form-label">Combien d'enfants avez-vous dans l'établissement ?</label>
              <select className="search-input" value={numberOfChildren} onChange={handleNumberChange} style={{ maxWidth: '200px' }}>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>

            {/* Informations des enfants */}
            <h3 style={{ marginBottom: '16px', color: 'var(--color-primary)', fontSize: '18px' }}>Informations de vos Enfants</h3>
            
            {[...Array(numberOfChildren)].map((_, index) => (
              <div key={index} style={{ padding: '20px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', marginBottom: '16px', background: 'white' }}>
                <h4 style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--text-main)' }}>Enfant {index + 1}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Nom et Prénom</label>
                    <input type="text" className="search-input" placeholder={`Nom complet de l'enfant ${index + 1}`} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Sexe</label>
                    <select className="search-input" required>
                      <option value="">Sélectionner</option>
                      <option value="Garçon">Garçon</option>
                      <option value="Fille">Fille</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Classe</label>
                    <select className="search-input" required>
                      <option value="">Sélectionner</option>
                      <option value="CP1">CP1</option>
                      <option value="CP2">CP2</option>
                      <option value="CE1">CE1</option>
                      <option value="CE2">CE2</option>
                      <option value="CM1">CM1</option>
                      <option value="CM2">CM2</option>
                      <option value="6ème">6ème</option>
                      <option value="5ème">5ème</option>
                      <option value="4ème">4ème</option>
                      <option value="3ème">3ème</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {/* Bouton de soumission */}
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <button type="submit" className="btn-primary" style={{ padding: '12px 32px', fontSize: '16px', borderRadius: 'var(--radius-md)' }}>
                Inscrire
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterParent;
