import React, { useState } from 'react';
import { DollarSign, AlertCircle, Users, Activity, TrendingUp, Bell, Search, Lock, Unlock, ChevronDown, Settings, LogOut, Eye, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StudentsList from './students';

const SettingsPlan = () => {
  const [defaultTranches, setDefaultTranches] = useState(() => {
    const saved = localStorage.getItem('eduPayGlobalSettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.defaultTranches || '3';
    }
    return '3';
  });
  
  const [chatNumber, setChatNumber] = useState(() => {
    const saved = localStorage.getItem('eduPayGlobalSettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.chatNumber || '+22890000000';
    }
    return '+22890000000';
  });

  const [yasNumber, setYasNumber] = useState(() => {
    const saved = localStorage.getItem('eduPayGlobalSettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.yasNumber || '';
    }
    return '';
  });

  const [floozNumber, setFloozNumber] = useState(() => {
    const saved = localStorage.getItem('eduPayGlobalSettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.floozNumber || '';
    }
    return '';
  });

  const [classTuitions, setClassTuitions] = useState(() => {
    const saved = localStorage.getItem('eduPayGlobalSettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.classTuitions && parsed.classTuitions.length > 0) return parsed.classTuitions;
    }
    return [
      { id: 1, name: 'CP1', amount: 120000 },
      { id: 2, name: 'CE1', amount: 120000 },
      { id: 3, name: '6ème', amount: 150000 }
    ];
  });

  const handleTuitionChange = (id, field, value) => {
    setClassTuitions(classTuitions.map(ct => ct.id === id ? { ...ct, [field]: value } : ct));
  };

  const addClassTuition = () => {
    setClassTuitions([...classTuitions, { id: Date.now(), name: '', amount: '' }]);
  };

  const removeClassTuition = (id) => {
    setClassTuitions(classTuitions.filter(ct => ct.id !== id));
  };

  const [message, setMessage] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    const saved = localStorage.getItem('eduPayGlobalSettings');
    const settings = saved ? JSON.parse(saved) : {};
    settings.defaultTranches = defaultTranches;
    settings.chatNumber = chatNumber;
    settings.yasNumber = yasNumber;
    settings.floozNumber = floozNumber;
    settings.classTuitions = classTuitions;
    localStorage.setItem('eduPayGlobalSettings', JSON.stringify(settings));
    setMessage('Les paramètres ont été mis à jour avec succès.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="welcome-section animate-fade-in-up" style={{ background: 'white', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
      <h2 style={{ marginBottom: '8px' }}>Paramètres du Plan de Paiement</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Définissez la configuration globale des paiements pour l'année en cours.</p>
      
      <form onSubmit={handleSave} style={{ maxWidth: '400px' }}>
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>
            Nombre de tranches par défaut
          </label>
          <select 
            className="search-input" 
            value={defaultTranches} 
            onChange={(e) => setDefaultTranches(e.target.value)}
            style={{ width: '100%', padding: '10px' }}
          >
            <option value="1">1 Tranche (Paiement intégral)</option>
            <option value="2">2 Tranches</option>
            <option value="3">3 Tranches</option>
            <option value="4">4 Tranches</option>
            <option value="5">5 Tranches</option>
          </select>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Ce paramètre s'appliquera par défaut lors de l'ajout de nouveaux élèves. Vous pourrez toujours ajuster le plan individuellement pour chaque élève.
          </p>
        </div>
        
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>
            Numéro de Chat Support (ex: WhatsApp)
          </label>
          <input 
            type="text" 
            className="search-input" 
            value={chatNumber} 
            onChange={(e) => setChatNumber(e.target.value)}
            placeholder="+228..."
            style={{ width: '100%', padding: '10px' }}
          />
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Ce numéro sera utilisé par les parents pour vous contacter directement via le bouton de chat dans leur espace.
          </p>
        </div>
        
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>
            Numéro de réception YAS
          </label>
          <input 
            type="text" 
            className="search-input" 
            value={yasNumber} 
            onChange={(e) => setYasNumber(e.target.value)}
            placeholder="Numéro YAS de l'école..."
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>
            Numéro de réception Flooz
          </label>
          <input 
            type="text" 
            className="search-input" 
            value={floozNumber} 
            onChange={(e) => setFloozNumber(e.target.value)}
            placeholder="Numéro Flooz de l'école..."
            style={{ width: '100%', padding: '10px' }}
          />
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Les paiements Mobile Money effectués par les parents seront dirigés vers ces numéros respectifs via l'API.
          </p>
        </div>
        
        <div className="form-group" style={{ marginBottom: '24px', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '16px', fontSize: '16px' }}>
            Écolages par classe
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            {classTuitions.map((ct) => (
              <div key={ct.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  className="search-input" 
                  value={ct.name} 
                  onChange={(e) => handleTuitionChange(ct.id, 'name', e.target.value)}
                  placeholder="Nom de la classe (ex: CP1)"
                  style={{ flex: 1, padding: '10px' }}
                  required
                />
                <input 
                  type="number" 
                  className="search-input" 
                  value={ct.amount} 
                  onChange={(e) => handleTuitionChange(ct.id, 'amount', parseInt(e.target.value) || '')}
                  placeholder="Montant (FCFA)"
                  style={{ flex: 1, padding: '10px' }}
                  required
                />
                <button type="button" onClick={() => removeClassTuition(ct.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '8px', flexShrink: 0 }} title="Supprimer">
                  🗑️
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addClassTuition} className="btn-outline btn-sm" style={{ padding: '8px 16px' }}>
            + Ajouter une classe
          </button>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Ces montants serviront de base lors de l'inscription d'un nouvel élève.
          </p>
        </div>
        
        {message && (
          <div style={{ padding: '12px', background: '#ECFDF5', color: '#059669', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>
            {message}
          </div>
        )}
        
        <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
};

const SettingsBulletin = () => {
  const [bulletinSettings, setBulletinSettings] = useState(() => {
    const saved = localStorage.getItem('eduPayBulletinSettings');
    if (saved) return JSON.parse(saved);
    return {
      schoolName: 'LYCÉE LEGBASSITO',
      motto: 'Travail - Liberté - Patrie',
      academicYear: '2025-2026',
      logoUrl: '',
      leftHeader: "MINISTERE DE L'EDUCATION NATIONALE\n-----------------\nDIRECTION REGIONALE DE L'EDUCATION\n-----------------\nINSPECTION DE L'ENSEIGNEMENT SECONDAIRE\n-----------------\nGENERAL ADJOINTIVE",
      phoneNumber: '',
      scientificSubjects: 'Mathématiques, Physique-Chimie, SVT',
      literarySubjects: 'Philosophie, Anglais, Français, Histoire-Géo, ECM, Allemand, Espagnol',
      optionalSubjects: 'EPS'
    };
  });
  
  const [message, setMessage] = useState('');

  const handleChange = (field, value) => {
    setBulletinSettings({ ...bulletinSettings, [field]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('eduPayBulletinSettings', JSON.stringify(bulletinSettings));
    setMessage('Paramètres du bulletin mis à jour avec succès.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="welcome-section animate-fade-in-up" style={{ background: 'white', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
      <h2 style={{ marginBottom: '8px' }}>Paramétrage du Bulletin</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Configurez l'en-tête et les catégories de matières pour les bulletins de notes.</p>
      
      <form onSubmit={handleSave} style={{ maxWidth: '600px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Nom de l'établissement</label>
            <input type="text" className="search-input" value={bulletinSettings.schoolName} onChange={(e) => handleChange('schoolName', e.target.value)} style={{ width: '100%', padding: '10px' }} required />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Devise</label>
            <input type="text" className="search-input" value={bulletinSettings.motto} onChange={(e) => handleChange('motto', e.target.value)} style={{ width: '100%', padding: '10px' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Année Académique</label>
            <input type="text" className="search-input" value={bulletinSettings.academicYear} onChange={(e) => handleChange('academicYear', e.target.value)} style={{ width: '100%', padding: '10px' }} required />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Numéro de téléphone officiel</label>
            <input type="text" className="search-input" value={bulletinSettings.phoneNumber || ''} onChange={(e) => handleChange('phoneNumber', e.target.value)} placeholder="Ex: +228 90 00 00 00" style={{ width: '100%', padding: '10px' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Logo de l'établissement (Format Image, ex: JPEG, PNG)</label>
            <input 
              type="file" 
              accept="image/*"
              className="search-input" 
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    handleChange('logoUrl', reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }} 
              style={{ width: '100%', padding: '10px', background: '#F8FAFC' }} 
            />
            {bulletinSettings.logoUrl && (
              <div style={{ marginTop: '10px' }}>
                <img src={bulletinSettings.logoUrl} alt="Aperçu logo" style={{ maxHeight: '80px', objectFit: 'contain' }} />
              </div>
            )}
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>En-tête gauche (Ministère, Direction, etc.)</label>
          <textarea 
            className="search-input" 
            value={bulletinSettings.leftHeader || ''} 
            onChange={(e) => handleChange('leftHeader', e.target.value)} 
            style={{ width: '100%', padding: '10px', minHeight: '120px', fontFamily: 'monospace' }} 
          />
        </div>

        <h3 style={{ fontSize: '16px', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>Classification des Matières (Séparées par des virgules)</h3>
        
        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Matières Scientifiques</label>
          <input type="text" className="search-input" value={bulletinSettings.scientificSubjects} onChange={(e) => handleChange('scientificSubjects', e.target.value)} style={{ width: '100%', padding: '10px' }} />
        </div>
        
        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Matières Littéraires</label>
          <input type="text" className="search-input" value={bulletinSettings.literarySubjects} onChange={(e) => handleChange('literarySubjects', e.target.value)} style={{ width: '100%', padding: '10px' }} />
        </div>
        
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Matières Facultatives</label>
          <input type="text" className="search-input" value={bulletinSettings.optionalSubjects} onChange={(e) => handleChange('optionalSubjects', e.target.value)} style={{ width: '100%', padding: '10px' }} />
        </div>
        
        {message && (
          <div style={{ padding: '12px', background: '#ECFDF5', color: '#059669', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>
            {message}
          </div>
        )}
        
        <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>
          Enregistrer la configuration
        </button>
      </form>
    </div>
  );
};

const SettingsPersonal = () => {
  const savedUser = localStorage.getItem('currentUser');
  const currentUser = savedUser ? JSON.parse(savedUser) : { role: 'director' };
  const isDirector = currentUser.role === 'director';

  const [adminsList, setAdminsList] = useState(() => {
    const saved = localStorage.getItem('eduPayAdmins');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [adminMessage, setAdminMessage] = useState('');
  
  const [adminToEdit, setAdminToEdit] = useState(null); // { originalEmail, email, password }
  const [adminToDelete, setAdminToDelete] = useState(null); // email string

  const handleAddAdmin = (e) => {
    e.preventDefault();
    let updatedAdmins = [...adminsList];
    
    if (updatedAdmins.find(a => a.email === newAdminEmail)) {
      setAdminMessage('Cet administrateur existe déjà.');
      setTimeout(() => setAdminMessage(''), 3000);
      return;
    }
    updatedAdmins.push({ email: newAdminEmail, password: newAdminPassword, role: 'admin' });
    setAdminMessage('Administrateur ajouté avec succès.');
    
    localStorage.setItem('eduPayAdmins', JSON.stringify(updatedAdmins));
    setAdminsList(updatedAdmins);
    
    setNewAdminEmail('');
    setNewAdminPassword('');
    setTimeout(() => setAdminMessage(''), 3000);
  };

  const saveEditedAdmin = (e) => {
    e.preventDefault();
    let updatedAdmins = [...adminsList];
    const index = updatedAdmins.findIndex(a => a.email === adminToEdit.originalEmail);
    if (index !== -1) {
      if (adminToEdit.email !== adminToEdit.originalEmail && updatedAdmins.find(a => a.email === adminToEdit.email)) {
        alert('Cet email est déjà utilisé.');
        return;
      }
      updatedAdmins[index] = { ...updatedAdmins[index], email: adminToEdit.email, password: adminToEdit.password };
      localStorage.setItem('eduPayAdmins', JSON.stringify(updatedAdmins));
      setAdminsList(updatedAdmins);
      setAdminToEdit(null);
    }
  };

  const confirmDeleteAdmin = () => {
    const updatedAdmins = adminsList.filter(a => a.email !== adminToDelete);
    localStorage.setItem('eduPayAdmins', JSON.stringify(updatedAdmins));
    setAdminsList(updatedAdmins);
    setAdminToDelete(null);
  };

  return (
    <div className="welcome-section animate-fade-in-up" style={{ background: 'white', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', opacity: isDirector ? 1 : 0.6, pointerEvents: isDirector ? 'auto' : 'none' }}>
      {!isDirector && (
        <div style={{ background: '#F1F5F9', color: '#64748B', padding: '12px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
          <Lock size={16} /> Accès en lecture seule - Réservé au directeur
        </div>
      )}
      
      <h2 style={{ marginBottom: '8px' }}>Informations Personnelles</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Gérez les informations de votre profil directeur.</p>
      
      <div style={{ maxWidth: '400px', marginBottom: '40px' }}>
        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Nom complet</label>
          <input type="text" className="search-input" defaultValue="M. le Directeur" style={{ width: '100%', padding: '10px' }} disabled={!isDirector} />
        </div>
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Adresse Email</label>
          <input type="email" className="search-input" defaultValue="directeur@ecole.com" style={{ width: '100%', padding: '10px' }} disabled={!isDirector} />
        </div>
        {isDirector && (
          <button className="btn-primary" style={{ padding: '10px 24px' }} onClick={() => alert('Mise à jour effectuée (Simulation)')}>
            Mettre à jour mes informations
          </button>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '32px' }}>
        <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>Ajouter un administrateur</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px' }}>
          L'administrateur ajouté pourra se connecter sans inscription pour gérer les informations en votre absence (mais n'aura pas accès à cette page).
        </p>

        <form onSubmit={handleAddAdmin} style={{ maxWidth: '400px' }}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Email de l'administrateur</label>
            <input type="email" required className="search-input" style={{ width: '100%', padding: '10px' }} value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} placeholder="admin@ecole.com" />
          </div>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Mot de passe provisoire</label>
            <input type="password" required className="search-input" style={{ width: '100%', padding: '10px' }} value={newAdminPassword} onChange={(e) => setNewAdminPassword(e.target.value)} placeholder="••••••••" />
          </div>
          
          {adminMessage && (
            <div style={{ padding: '12px', background: adminMessage.includes('succès') ? '#ECFDF5' : '#FEF2F2', color: adminMessage.includes('succès') ? '#059669' : '#EF4444', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>
              {adminMessage}
            </div>
          )}
          
          <button type="submit" className="btn-outline" style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Users size={18} /> Créer l'accès administrateur
          </button>
        </form>

        {adminsList.length > 0 && (
          <div style={{ marginTop: '32px' }}>
            <h4 style={{ marginBottom: '16px', fontSize: '15px' }}>Administrateurs existants</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {adminsList.map((admin, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', border: '1px solid var(--border-light)', borderRadius: '8px', background: '#F8FAFC' }}>
                  <div>
                    <div style={{ fontWeight: 500, color: 'var(--text-main)', marginBottom: '4px' }}>{admin.email}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Mot de passe : {admin.password}</div>
                  </div>
                  {isDirector && (
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }} onClick={() => setAdminToEdit({ originalEmail: admin.email, email: admin.email, password: admin.password })} title="Modifier">
                        ✏️
                      </button>
                      <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }} onClick={() => setAdminToDelete(admin.email)} title="Supprimer">
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Edit Admin Modal */}
      {adminToEdit && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="card animate-scale-in" style={{ width: '400px', padding: '32px' }}>
            <h3 style={{ marginBottom: '24px' }}>Modifier l'administrateur</h3>
            <form onSubmit={saveEditedAdmin}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Adresse Email</label>
                <input type="email" required className="search-input" style={{ width: '100%', padding: '10px' }} value={adminToEdit.email} onChange={(e) => setAdminToEdit({...adminToEdit, email: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Nouveau mot de passe</label>
                <input type="text" required className="search-input" style={{ width: '100%', padding: '10px' }} value={adminToEdit.password} onChange={(e) => setAdminToEdit({...adminToEdit, password: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-outline" onClick={() => setAdminToEdit(null)}>Annuler</button>
                <button type="submit" className="btn-primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {adminToDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="card animate-scale-in" style={{ width: '400px', padding: '32px', textAlign: 'center' }}>
            <div style={{ background: '#FEF2F2', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#EF4444' }}>
              <AlertCircle size={32} />
            </div>
            <h3 style={{ marginBottom: '16px' }}>Confirmer la suppression</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
              Voulez-vous vraiment supprimer l'accès de <strong>{adminToDelete}</strong> ? Cette action est irréversible.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button type="button" className="btn-outline" onClick={() => setAdminToDelete(null)}>Annuler</button>
              <button type="button" className="btn-primary" style={{ background: '#EF4444', borderColor: '#EF4444' }} onClick={confirmDeleteAdmin}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SettingsTeachers = () => {
  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('eduPayTeachers');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newName, setNewName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [currentClass, setCurrentClass] = useState('');
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentHour, setCurrentHour] = useState('');
  const [message, setMessage] = useState('');
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const generateWhatsappLink = (teacher) => {
    if (!teacher.whatsapp) return '#';
    
    let phone = teacher.whatsapp.replace(/\s+/g, '');
    if (phone.startsWith('+')) phone = phone.substring(1);
    
    let text = `Bonjour ${teacher.name}, voici vos affectations :\n\n`;
    if (teacher.assignments && teacher.assignments.length > 0) {
      teacher.assignments.forEach(a => {
        text += `- Classe: ${a.class} | Cours: ${a.subject === '-' ? 'Tous' : a.subject} | Heure: ${a.hour}\n`;
      });
    } else {
      text += "(Aucune affectation précise)\n";
    }
    text += `\n(Les identifiants ne sont pas inclus pour des raisons de confidentialité)\n\nCordialement, La Direction.`;
    
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  const PREDEFINED_HOURS = [
    '1ère heure', '2ème heure', '3ème heure', '4ème heure', '5ème heure',
    '6ème heure', '7ème heure', '8ème heure', '9ème heure', '10ème heure'
  ];

  const PREDEFINED_SUBJECTS = [
    'Cours Primaire', 'Mathématiques', 'Physique-Chimie', 'SVT', 'Philosophie', 'Anglais',
    'Français', 'Histoire-Géo', 'ECM', 'Allemand', 'Espagnol', 'EPS'
  ];

  const PREDEFINED_CLASSES = [
    'CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2',
    '6ème', '5ème', '4ème', '3ème',
    'Seconde A', 'Seconde C', 'Seconde D',
    'Première A', 'Première C', 'Première D',
    'Terminale A', 'Terminale C', 'Terminale D'
  ];

  const handleAddAssignment = () => {
    if (!currentClass) {
      alert("Veuillez sélectionner au moins une classe.");
      return;
    }
    setAssignments([...assignments, {
      class: currentClass,
      subject: currentSubject || '-',
      hour: currentHour || '-'
    }]);
    setCurrentClass('');
    setCurrentSubject('');
    setCurrentHour('');
  };

  const handleRemoveAssignment = (index) => {
    setAssignments(assignments.filter((_, i) => i !== index));
  };

  const handleAddTeacher = (e) => {
    e.preventDefault();
    if (!newName) return;
    
    let finalAssignments = [...assignments];
    
    // Auto-add if user filled the fields but forgot to click "+ Ajouter"
    if (currentClass) {
      finalAssignments.push({
        class: currentClass,
        subject: currentSubject || '-',
        hour: currentHour || '-'
      });
    }

    if (finalAssignments.length === 0) {
      alert('Veuillez ajouter au moins une affectation (classe/cours) au tableau.');
      return;
    }
    
    const uniqueClasses = [...new Set(finalAssignments.map(a => a.class))];
    const uniqueSubjects = [...new Set(finalAssignments.map(a => a.subject).filter(s => s !== '-'))];
    const uniqueHours = [...new Set(finalAssignments.map(a => a.hour).filter(h => h !== '-'))];

    let updatedTeachers;

    if (editingTeacherId) {
      updatedTeachers = teachers.map(t => {
        if (t.id === editingTeacherId) {
          return {
            ...t,
            name: newName,
            whatsapp: whatsapp,
            assignments: finalAssignments,
            classes: uniqueClasses,
            subjects: uniqueSubjects,
            hours: uniqueHours
          };
        }
        return t;
      });
      setMessage(`Enseignant ${newName} mis à jour avec succès.`);
    } else {
      const newId = `ENS-${String(teachers.length + 1).padStart(3, '0')}`;
      const newPassword = Math.floor(1000 + Math.random() * 9000).toString();
      
      const newTeacher = {
        id: newId,
        name: newName,
        whatsapp: whatsapp,
        password: newPassword,
        assignments: finalAssignments,
        classes: uniqueClasses,
        subjects: uniqueSubjects,
        hours: uniqueHours,
        createdAt: new Date().toISOString()
      };
      updatedTeachers = [...teachers, newTeacher];
      setMessage(`Enseignant ajouté ! ID: ${newId} | Mdp: ${newPassword}`);
    }
    
    setTeachers(updatedTeachers);
    localStorage.setItem('eduPayTeachers', JSON.stringify(updatedTeachers));
    
    setNewName('');
    setWhatsapp('');
    setAssignments([]);
    setCurrentClass('');
    setCurrentSubject('');
    setCurrentHour('');
    setEditingTeacherId(null);
    setTimeout(() => setMessage(''), 10000); // 10 seconds to read
  };

  const handleEditTeacher = (teacher) => {
    setNewName(teacher.name || '');
    setWhatsapp(teacher.whatsapp || '');
    setAssignments(teacher.assignments || []);
    setEditingTeacherId(teacher.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTeacher = (teacher) => {
    setTeacherToDelete(teacher);
  };

  const confirmDeleteTeacher = () => {
    if (teacherToDelete) {
      const updatedTeachers = teachers.filter(t => t.id !== teacherToDelete.id);
      setTeachers(updatedTeachers);
      localStorage.setItem('eduPayTeachers', JSON.stringify(updatedTeachers));
      setTeacherToDelete(null);
    }
  };

  return (
    <div className="welcome-section animate-fade-in-up" style={{ background: 'white', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
      <h2 style={{ marginBottom: '8px' }}>Gestion des enseignants</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Ajoutez des enseignants, leurs cours et attribuez-leur des classes.</p>
      
      <form onSubmit={handleAddTeacher} style={{ maxWidth: '600px', marginBottom: '40px' }}>
        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Nom complet de l'enseignant</label>
          <input type="text" className="search-input" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ex: Jean Dupont" style={{ width: '100%', padding: '10px' }} required />
        </div>

        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Numéro WhatsApp <span style={{color: 'var(--text-muted)', fontSize: '12px'}}>(Optionnel)</span></label>
          <input type="tel" className="search-input" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="Ex: +33 6 12 34 56 78" style={{ width: '100%', padding: '10px' }} />
        </div>
        
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '12px' }}>Affectations (Classe, Cours, Heure) <span style={{color: 'red'}}>*</span></label>
          
          <div style={{ padding: '16px', border: '1px solid var(--border-light)', borderRadius: '8px', background: '#F8FAFC', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: '1 1 120px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--text-muted)' }}>Classe</label>
                <select className="search-input" value={currentClass} onChange={e => setCurrentClass(e.target.value)} style={{ width: '100%', padding: '8px' }}>
                  <option value="">Sélectionner</option>
                  {PREDEFINED_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ flex: '1 1 150px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--text-muted)' }}>Cours (Opt.)</label>
                <select className="search-input" value={currentSubject} onChange={e => setCurrentSubject(e.target.value)} style={{ width: '100%', padding: '8px' }}>
                  <option value="">Aucun</option>
                  {PREDEFINED_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ flex: '1 1 120px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--text-muted)' }}>Heure (Opt.)</label>
                <select className="search-input" value={currentHour} onChange={e => setCurrentHour(e.target.value)} style={{ width: '100%', padding: '8px' }}>
                  <option value="">Aucune</option>
                  {PREDEFINED_HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div>
                <button type="button" className="btn-outline" onClick={handleAddAssignment} style={{ padding: '8px 16px', height: '37px', borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                  + Ajouter
                </button>
              </div>
            </div>
          </div>

          {assignments.length > 0 && (
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', border: '1px solid var(--border-light)' }}>
              <thead>
                <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '8px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Classe</th>
                  <th style={{ padding: '8px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Cours</th>
                  <th style={{ padding: '8px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Heure</th>
                  <th style={{ padding: '8px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #E2E8F0', background: 'white' }}>
                    <td style={{ padding: '8px' }}>{a.class}</td>
                    <td style={{ padding: '8px' }}>{a.subject}</td>
                    <td style={{ padding: '8px', color: a.hour === '-' ? '#94A3B8' : 'inherit' }}>{a.hour}</td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>
                      <button type="button" onClick={() => handleRemoveAssignment(i)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {message && (
          <div style={{ padding: '16px', background: '#ECFDF5', color: '#059669', borderRadius: '8px', marginBottom: '24px', fontSize: '15px', fontWeight: 500, border: '1px solid #10B981' }}>
            ✅ {message}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" className="btn-primary" style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {editingTeacherId ? 'Mettre à jour l\'enseignant' : '+ Ajouter l\'enseignant'}
          </button>
          {editingTeacherId && (
            <button type="button" className="btn-outline" onClick={() => {
              setEditingTeacherId(null);
              setNewName('');
              setWhatsapp('');
              setAssignments([]);
            }} style={{ padding: '10px 24px' }}>
              Annuler
            </button>
          )}
        </div>
      </form>

      {teachers.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '18px', margin: 0 }}>Enseignants enregistrés ({teachers.length})</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" className="btn-outline" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                Imprimer
              </button>
              <button type="button" className="btn-primary" onClick={() => setShowWhatsappModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#25D366', borderColor: '#25D366' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                WhatsApp
              </button>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {teachers.map((teacher) => (
              <div key={teacher.id} style={{ padding: '16px', border: '1px solid var(--border-light)', borderRadius: '8px', background: '#F8FAFC' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '16px' }}>{teacher.name}</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" onClick={() => handleEditTeacher(teacher)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', padding: '4px' }} title="Modifier">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button type="button" onClick={() => handleDeleteTeacher(teacher)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '4px' }} title="Supprimer">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 500, marginBottom: '4px' }}>ID: {teacher.id}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>Mdp: {teacher.password}</div>
                
                {teacher.whatsapp && (
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    {teacher.whatsapp}
                  </div>
                )}
                
                {teacher.assignments && teacher.assignments.length > 0 ? (
                  <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', border: '1px solid var(--border-light)', marginTop: '8px' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                        <th style={{ padding: '6px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Classe</th>
                        <th style={{ padding: '6px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Cours</th>
                        <th style={{ padding: '6px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Heure</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teacher.assignments.map((a, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #E2E8F0', background: 'white' }}>
                          <td style={{ padding: '6px' }}>{a.class}</td>
                          <td style={{ padding: '6px', color: a.subject === '-' ? '#94A3B8' : 'inherit' }}>{a.subject === '-' ? 'Aucun' : a.subject}</td>
                          <td style={{ padding: '6px', color: a.hour === '-' ? '#94A3B8' : 'inherit' }}>{a.hour}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <>
                    {/* Fallback for older data */}
                    {teacher.subjects && teacher.subjects.length > 0 && (
                      <div style={{ marginBottom: '8px', fontSize: '13px', color: 'var(--text-main)', background: '#F1F5F9', padding: '6px 10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                        <strong style={{color: '#475569'}}>Cours :</strong> {teacher.subjects.join(', ')}
                      </div>
                    )}
                    {teacher.hours && teacher.hours.length > 0 && (
                      <div style={{ marginBottom: '12px', fontSize: '13px', color: 'var(--text-main)', background: '#FFFBEB', padding: '6px 10px', borderRadius: '6px', border: '1px solid #FEF3C7' }}>
                        <strong style={{color: '#B45309'}}>Heures :</strong> {teacher.hours.join(', ')}
                      </div>
                    )}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {teacher.classes && teacher.classes.map((c, i) => (
                        <span key={i} style={{ background: 'white', border: '1px solid #CBD5E1', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', color: '#334155', fontWeight: 500 }}>{c}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {teacherToDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            <div style={{ width: '64px', height: '64px', background: '#FEE2E2', color: '#EF4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <AlertCircle size={32} />
            </div>
            <h3 style={{ marginBottom: '16px' }}>Confirmer la suppression</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
              Voulez-vous vraiment supprimer l'enseignant <strong>{teacherToDelete.name}</strong> ? Cette action est irréversible.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button type="button" className="btn-outline" onClick={() => setTeacherToDelete(null)}>Annuler</button>
              <button type="button" className="btn-primary" style={{ background: '#EF4444', borderColor: '#EF4444' }} onClick={confirmDeleteTeacher}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {showWhatsappModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', maxWidth: '500px', width: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Envoyer par WhatsApp</h3>
              <button onClick={() => setShowWhatsappModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '14px' }}>
              Cliquez sur "Envoyer" pour ouvrir WhatsApp pré-rempli pour chaque enseignant. (L'ID et mot de passe ne sont pas inclus).
            </p>
            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '8px' }}>
              {teachers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Aucun enseignant</div>
              ) : (
                teachers.map(t => (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid var(--border-light)' }}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{t.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.whatsapp || 'Pas de numéro'}</div>
                    </div>
                    {t.whatsapp ? (
                      <a href={generateWhatsappLink(t)} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#25D366', color: 'white', borderRadius: '20px', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"></path><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        Envoyer
                      </a>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#EF4444' }}>Numéro manquant</span>
                    )}
                  </div>
                ))
              )}
            </div>
            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <button className="btn-outline" onClick={() => setShowWhatsappModal(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Print Section */}
      <div id="print-section" style={{ display: 'none' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>Fiche des Enseignants - Affectations</h1>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12pt' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>Nom</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>WhatsApp</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Affectations (Classe - Cours - Heure)</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map(t => (
              <tr key={t.id}>
                <td style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>{t.name}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{t.whatsapp || 'N/A'}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {t.assignments && t.assignments.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {t.assignments.map((a, i) => (
                        <li key={i}>{a.class} | {a.subject === '-' ? 'Tous' : a.subject} | {a.hour}</li>
                      ))}
                    </ul>
                  ) : (
                    "Aucune"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DashboardOverview = ({ stats, formatCurrency, onViewStudent, currentFamilies = [] }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');

  const handleUnlock = (e) => {
    e.preventDefault();
    if (email === 'directeur@ecole.com' && password === '1234') {
      setIsUnlocked(true);
      setShowLogin(false);
      setError('');
      setResetMessage('');
    } else {
      setError('Identifiants incorrects. Essayez directeur@ecole.com / 1234');
      setResetMessage('');
    }
  };

  const openForgotModal = () => {
    setShowForgotModal(true);
    setForgotEmail(email); // prepopulate with entered email if any
    setForgotMessage('');
  };

  const submitForgotPassword = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotMessage(`Un lien de renouvellement a été envoyé à ${forgotEmail}. Vous pourrez y modifier votre mot de passe avant de revenir vous connecter.`);
  };

  return (
    <div className="welcome-section animate-fade-in-up">
      <h1>Bonjour, Directeur 👋</h1>
      <p>Voici un aperçu financier élégant et en temps réel de votre établissement.</p>
      
      <div style={{ position: 'relative', marginTop: '32px' }}>
        {!isUnlocked && (
          <div 
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(8px)',
              zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              borderRadius: 'var(--radius-lg)', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.5)'
            }}
            onClick={() => setShowLogin(true)}
          >
             <div style={{ background: 'var(--color-primary)', padding: '16px', borderRadius: '50%', color: 'white', marginBottom: '16px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
               <Lock size={32} />
             </div>
             <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Section Financière Verrouillée</h3>
             <p style={{ color: 'var(--text-main)', marginTop: '8px', fontWeight: 500 }}>Cliquez pour déverrouiller</p>
          </div>
        )}

        <div className="premium-financial-grid stagger-children" style={{ filter: !isUnlocked ? 'blur(6px)' : 'none', transition: 'filter 0.3s ease', opacity: !isUnlocked ? 0.7 : 1, userSelect: !isUnlocked ? 'none' : 'auto' }}>
          <div className="premium-card success-gradient">
            <div className="card-glass">
              <div className="card-top">
                 <div className="icon-wrapper"><DollarSign size={24} color="#059669" /></div>
                 <span className="trend-badge positive">↗ +15.3%</span>
              </div>
              <h3>Versement total perçu</h3>
              <div className="amount">{formatCurrency(stats.totalPaid)}</div>
              <div className="progress-section">
                <div className="progress-bar-bg">
                   <div className="progress-bar-fill success" style={{ width: '77%' }}></div>
                </div>
                <p className="subtitle">77% de l'objectif annuel atteint</p>
              </div>
            </div>
          </div>

          <div className="premium-card warning-gradient">
            <div className="card-glass">
              <div className="card-top">
                 <div className="icon-wrapper"><AlertCircle size={24} color="#B45309" /></div>
                 <span className="trend-badge negative">↘ à surveiller</span>
              </div>
              <h3>Argent restant à payer</h3>
              <div className="amount">{formatCurrency(stats.totalRemaining)}</div>
              <div className="progress-section">
                <div className="progress-bar-bg">
                   <div className="progress-bar-fill warning" style={{ width: '23%' }}></div>
                </div>
                <p className="subtitle">Impayés à recouvrer urgemment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showLogin && !isUnlocked && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content animate-fade-in-up" style={{ background: 'white', padding: '32px', borderRadius: '20px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ background: '#ECFDF5', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--color-primary)' }}>
                <Lock size={32} />
              </div>
              <h3 style={{ fontSize: '20px', margin: '0 0 8px 0' }}>Déverrouiller les finances</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Veuillez vous authentifier</p>
            </div>
            
            <form onSubmit={handleUnlock}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Adresse email</label>
                <input 
                  type="email" 
                  className="search-input" 
                  autoFocus
                  required
                  placeholder="directeur@ecole.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--border-light)', borderRadius: '8px' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '8px' }}>
                <label className="form-label" style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Mot de passe</label>
                <input 
                  type="password" 
                  className="search-input" 
                  required
                  placeholder="1234"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--border-light)', borderRadius: '8px' }}
                />
              </div>
              <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                <button type="button" onClick={openForgotModal} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '13px', cursor: 'pointer', padding: 0, fontWeight: 500 }}>
                  Mot de passe oublié ?
                </button>
              </div>
              
              {error && <div style={{ color: '#EF4444', fontSize: '14px', marginBottom: '16px', textAlign: 'center', background: '#FEF2F2', padding: '8px', borderRadius: '4px' }}>{error}</div>}
              {resetMessage && <div style={{ color: '#059669', fontSize: '14px', marginBottom: '16px', textAlign: 'center', background: '#ECFDF5', padding: '8px', borderRadius: '4px' }}>{resetMessage}</div>}
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <button type="button" className="btn-outline" style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border-light)', borderRadius: '8px', cursor: 'pointer' }} onClick={() => {setShowLogin(false); setError(''); setResetMessage('');}}>Annuler</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Déverrouiller</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showForgotModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content animate-fade-in-up" style={{ background: 'white', padding: '32px', borderRadius: '20px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ background: '#EFF6FF', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#3B82F6' }}>
                <Lock size={32} />
              </div>
              <h3 style={{ fontSize: '20px', margin: '0 0 8px 0' }}>Mot de passe oublié</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Entrez votre email pour recevoir le lien</p>
            </div>
            
            {forgotMessage ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#059669', fontSize: '14px', marginBottom: '24px', background: '#ECFDF5', padding: '12px', borderRadius: '8px', lineHeight: 1.5 }}>
                  {forgotMessage}
                </div>
                <button type="button" className="btn-primary" style={{ width: '100%', padding: '10px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }} onClick={() => setShowForgotModal(false)}>Fermer</button>
              </div>
            ) : (
              <form onSubmit={submitForgotPassword}>
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label" style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Adresse email</label>
                  <input 
                    type="email" 
                    className="search-input" 
                    autoFocus
                    required
                    placeholder="directeur@ecole.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid var(--border-light)', borderRadius: '8px' }}
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button type="button" className="btn-outline" style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border-light)', borderRadius: '8px', cursor: 'pointer' }} onClick={() => setShowForgotModal(false)}>Annuler</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Envoyer le lien</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="secondary-grid stagger-children" style={{ animationDelay: '200ms', marginTop: '32px' }}>
         <div className="glass-stat-card">
            <div className="stat-icon-soft blue"><Users size={24} /></div>
            <div className="stat-details">
              <h4>Total Élèves</h4>
              <span className="stat-num">{stats.totalStudents}</span>
            </div>
         </div>
         
         <div className="glass-stat-card">
            <div className="stat-icon-soft purple"><Activity size={24} /></div>
            <div className="stat-details">
              <h4>Recouvrement</h4>
              <span className="stat-num">{stats.collectionRate}%</span>
            </div>
         </div>
         
         <div className="glass-stat-card">
            <div className="stat-icon-soft green"><TrendingUp size={24} /></div>
            <div className="stat-details">
              <h4>Paiements (Aujourd'hui)</h4>
              <span className="stat-num">12</span>
            </div>
         </div>
      </div>
      
      {(() => {
        const recentPayments = [];
        if (currentFamilies) {
          currentFamilies.forEach(family => {
            if (family.children) {
              family.children.forEach(child => {
                if (child.payments) {
                  child.payments.forEach(payment => {
                    if (payment.amountPaid > 0) {
                      recentPayments.push({
                        familyId: family.id,
                        studentName: child.name,
                        className: child.grade,
                        amount: payment.amountPaid,
                        status: payment.isFullyPaid ? 'Validé' : 'Partiel',
                        date: new Date().toLocaleDateString('fr-FR'),
                        timestamp: new Date().getTime()
                      });
                    }
                  });
                }
              });
            }
          });
        }
        // Prendre les 5 derniers et simuler des dates récentes s'il y en a beaucoup
        const displayPayments = recentPayments.slice(-5).reverse();
        
        return (
          <div className="recent-transactions animate-fade-in-up" style={{ animationDelay: '400ms', marginTop: '32px' }}>
         <div className="section-header">
           <h3>Derniers paiements enregistrés</h3>
           <button className="btn btn-outline btn-sm">Voir l'historique</button>
         </div>
         <div className="table-wrapper">
           <table className="modern-table">
             <thead>
               <tr>
                 <th>Élève</th>
                 <th>Classe</th>
                 <th>Date & Heure</th>
                 <th>Montant</th>
                 <th>Statut</th>
                 <th style={{ width: '40px' }}></th>
               </tr>
             </thead>
             <tbody>
               {displayPayments.length > 0 ? displayPayments.map((payment, idx) => (
                 <tr key={idx}>
                   <td>
                     <div className="student-cell">
                       <div className="avatar-sm" style={{background: 'var(--color-primary)'}}>{payment.studentName.charAt(0).toUpperCase()}</div>
                       <span>{payment.studentName}</span>
                     </div>
                   </td>
                   <td>{payment.className}</td>
                   <td>{payment.date}</td>
                   <td className="amount-cell">{payment.amount.toLocaleString()} FCFA</td>
                   <td><span className={`badge ${payment.status === 'Validé' ? 'badge-success' : 'badge-warning'}`}>{payment.status}</span></td>
                   <td style={{ textAlign: 'right' }}>
                     <button 
                       onClick={() => onViewStudent && onViewStudent(payment.familyId)} 
                       className="btn-outline btn-sm"
                       title="Accéder au dossier"
                       style={{ padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                     >
                       <Eye size={16} />
                     </button>
                   </td>
                 </tr>
               )) : (
                 <tr>
                   <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>Aucun paiement enregistré pour le moment.</td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>
       </div>
        );
      })()}
    </div>
  );
};

const Dashboard = () => {
  const savedUser = localStorage.getItem('currentUser');
  const currentUser = savedUser ? JSON.parse(savedUser) : { role: 'director' };
  const isDirector = currentUser.role === 'director';

  const [activeTab, setActiveTab] = useState('overview');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (!value.trim()) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    const savedFamilies = localStorage.getItem('eduPayFamilies');
    const families = savedFamilies ? JSON.parse(savedFamilies) : [];
    const queryStr = value.toLowerCase();
    
    const results = [];
    families.forEach(family => {
      if (family.parentName && family.parentName.toLowerCase().includes(queryStr)) {
        if (!results.find(r => r.name === family.parentName && r.type === 'parent')) {
          results.push({ type: 'parent', name: family.parentName, familyId: family.id });
        }
      }
      if (family.children) {
        family.children.forEach(child => {
          if (child.name && child.name.toLowerCase().includes(queryStr)) {
            results.push({ type: 'student', name: child.name, familyId: family.id, parentName: family.parentName });
          }
        });
      }
    });
    
    setSearchResults(results);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (result) => {
    setSearchQuery(result.name);
    setShowSuggestions(false);
    setActiveTab('students');
  };

  // Récupération et calcul des statistiques réelles depuis la base de données (localStorage)
  const savedFamiliesStr = localStorage.getItem('eduPayFamilies');
  const currentFamilies = savedFamiliesStr ? JSON.parse(savedFamiliesStr) : [];
  
  let actualTotalStudents = 0;
  let actualTotalPaid = 0;
  let actualTotalRemaining = 0;
  
  currentFamilies.forEach(family => {
    if (family.children) {
      actualTotalStudents += family.children.length;
      family.children.forEach(child => {
        if (child.payments) {
          child.payments.forEach(payment => {
             actualTotalPaid += (payment.amountPaid || 0);
             const remaining = (payment.amountExpected || 0) - (payment.amountPaid || 0);
             if (remaining > 0) {
               actualTotalRemaining += remaining;
             }
          });
        }
      });
    }
  });

  const actualCollectionRate = actualTotalPaid + actualTotalRemaining > 0 
    ? Math.round((actualTotalPaid / (actualTotalPaid + actualTotalRemaining)) * 100)
    : 0;

  const stats = {
    totalPaid: actualTotalPaid,
    totalRemaining: actualTotalRemaining,
    totalStudents: actualTotalStudents,
    collectionRate: actualCollectionRate
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
  };

  return (
    <div className="dashboard-container">
      
      {/* Overlay pour le menu mobile */}
      <div 
        className={`sidebar-overlay ${isMobileMenuOpen ? 'open' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      <aside className={`premium-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">E</div>
          <h2>EduPay</h2>
          <button 
            className="hamburger-btn" 
            style={{ marginLeft: 'auto', display: isMobileMenuOpen ? 'flex' : 'none', color: 'white' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <nav className="sidebar-nav">
          <a href="#" className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('overview'); setIsMobileMenuOpen(false); }}>
            <span className="nav-icon">📊</span> Tableau de bord
          </a>
          <a href="#" className={`nav-item ${activeTab === 'students' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('students'); setIsMobileMenuOpen(false); }}>
            <span className="nav-icon">👥</span> Liste des élèves
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">💳</span> Paiements
          </a>
          <div className="nav-group">
            <a href="#" className={`nav-item ${activeTab.startsWith('settings') ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setIsSettingsOpen(!isSettingsOpen); }}>
              <span className="nav-icon">⚙️</span> Paramètres
              <ChevronDown size={16} style={{ marginLeft: 'auto', transform: isSettingsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </a>
            {isSettingsOpen && (
              <div className="sub-nav animate-fade-in-up" style={{ paddingLeft: '40px', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                <a 
                  href="#" 
                  className={`nav-item ${activeTab === 'settings-personal' ? 'active' : ''}`} 
                  style={{ 
                    fontSize: '14px', 
                    padding: '8px 12px', 
                    minHeight: 'auto',
                    opacity: isDirector ? 1 : 0.5,
                    cursor: isDirector ? 'pointer' : 'not-allowed'
                  }} 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    if (isDirector) {
                      setActiveTab('settings-personal'); 
                      setIsMobileMenuOpen(false);
                    }
                  }}
                >
                  Informations personnelles
                </a>
                <a 
                  href="#" 
                  className={`nav-item ${activeTab === 'settings-plan' ? 'active' : ''}`} 
                  style={{ fontSize: '14px', padding: '8px 12px', minHeight: 'auto' }} 
                  onClick={(e) => { e.preventDefault(); setActiveTab('settings-plan'); setIsMobileMenuOpen(false); }}
                >
                  Plan
                </a>
                <a 
                  href="#" 
                  className={`nav-item ${activeTab === 'settings-teachers' ? 'active' : ''}`} 
                  style={{ 
                    fontSize: '14px', 
                    padding: '8px 12px', 
                    minHeight: 'auto',
                    opacity: isDirector ? 1 : 0.5,
                    cursor: isDirector ? 'pointer' : 'not-allowed'
                  }} 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    if (isDirector) {
                      setActiveTab('settings-teachers'); 
                      setIsMobileMenuOpen(false);
                    }
                  }}
                >
                  Gestion des enseignants
                </a>
                <a 
                  href="#" 
                  className={`nav-item ${activeTab === 'settings-bulletin' ? 'active' : ''}`} 
                  style={{ 
                    fontSize: '14px', 
                    padding: '8px 12px', 
                    minHeight: 'auto',
                    opacity: isDirector ? 1 : 0.5,
                    cursor: isDirector ? 'pointer' : 'not-allowed'
                  }} 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    if (isDirector) {
                      setActiveTab('settings-bulletin'); 
                      setIsMobileMenuOpen(false);
                    }
                  }}
                >
                  Paramétrage bulletin
                </a>
              </div>
            )}
          </div>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
           <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(true)}>
             <Menu size={24} />
           </button>
           <div className="search-bar-container" style={{ position: 'relative' }}>
             <div className="search-bar">
               <Search size={18} color="#94A3B8" />
               <input 
                 type="text" 
                 placeholder="Rechercher un élève, un parent..." 
                 value={searchQuery}
                 onChange={handleSearch}
                 onFocus={() => { if(searchQuery) setShowSuggestions(true); }}
                 onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
               />
             </div>
             
             {showSuggestions && searchQuery && (
               <div className="search-suggestions animate-fade-in-up" style={{
                 position: 'absolute',
                 top: '100%',
                 left: 0,
                 right: 0,
                 marginTop: '8px',
                 background: 'white',
                 border: '1px solid var(--border-light)',
                 borderRadius: '8px',
                 boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                 zIndex: 1000,
                 maxHeight: '300px',
                 overflowY: 'auto'
               }}>
                 {searchResults.length > 0 ? (
                   searchResults.map((result, idx) => (
                     <div 
                       key={idx} 
                       style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }} 
                       onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-app)'} 
                       onMouseLeave={(e) => e.currentTarget.style.background = 'white'} 
                       onClick={() => handleSuggestionClick(result)}
                     >
                        <div className="avatar-sm" style={{ background: result.type === 'parent' ? '#3B82F6' : 'var(--color-primary)', width: '32px', height: '32px', flexShrink: 0, fontSize: '14px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                           {result.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: '14px', color: 'var(--text-main)' }}>{result.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{result.type === 'parent' ? 'Parent' : `Élève (Parent: ${result.parentName})`}</div>
                        </div>
                     </div>
                   ))
                 ) : (
                   <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>Aucun résultat trouvé</div>
                 )}
               </div>
             )}
           </div>
           <div className="header-actions">
             <button className="icon-btn">
               <Bell size={20} />
               <span className="notification-dot"></span>
             </button>
             <div 
               className="user-profile" 
               style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
             >
               <img src="https://i.pravatar.cc/150?u=director" alt="Profil Directeur" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
               <div className="user-info" style={{ display: 'flex', flexDirection: 'column' }}>
                 <span className="name" style={{ fontWeight: 600, fontSize: '14px' }}>M. le Directeur</span>
                 <span className="role" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Administrateur</span>
               </div>
               <ChevronDown size={16} color="var(--text-muted)" style={{ marginLeft: '4px', transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
               
               {isDropdownOpen && (
                 <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'white', border: '1px solid var(--border-light)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', minWidth: '200px', zIndex: 100, overflow: 'hidden' }}>
                   <div 
                     style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.2s' }}
                     onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-app)'}
                     onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                     onClick={(e) => { e.stopPropagation(); alert('Paramètres de connexion à venir'); setIsDropdownOpen(false); }}
                   >
                     <Settings size={16} color="var(--text-muted)" />
                     <span style={{ fontSize: '14px', color: 'var(--text-main)' }}>Paramètres</span>
                   </div>
                   <div 
                     style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.2s', borderTop: '1px solid var(--border-light)' }}
                     onMouseEnter={(e) => e.currentTarget.style.background = '#FEF2F2'}
                     onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                     onClick={(e) => { e.stopPropagation(); navigate('/login'); }}
                   >
                     <LogOut size={16} color="#EF4444" />
                     <span style={{ fontSize: '14px', color: '#EF4444' }}>Déconnexion</span>
                   </div>
                 </div>
               )}
             </div>
           </div>
        </header>

        <div className="dashboard-content">
          {activeTab === 'overview' && <DashboardOverview stats={stats} formatCurrency={formatCurrency} currentFamilies={currentFamilies} onViewStudent={(id) => { setActiveTab('students'); localStorage.setItem('eduPaySelectedFamily', id); }} />}
          {activeTab === 'students' && <StudentsList initialActiveFamilyId={localStorage.getItem('eduPaySelectedFamily')} />}
          {activeTab === 'settings-plan' && <SettingsPlan />}
          {activeTab === 'settings-personal' && <SettingsPersonal />}
          {activeTab === 'settings-teachers' && <SettingsTeachers />}
          {activeTab === 'settings-bulletin' && <SettingsBulletin />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
