import React, { useState, useEffect } from 'react';
import { DollarSign, AlertCircle, Users, Activity, TrendingUp, Bell, Search, Lock, Unlock, ChevronDown, Settings, LogOut, Eye, Menu, X, Calendar, Crown, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StudentsList from './students';
import PaymentsView from './payments';
import ImageCropper from '../components/ImageCropper';
import { supabase } from '../supabaseClient';
import { getFamiliesNested, getTransactions } from '../supabaseService';

const SettingsPlan = () => {
  const [defaultTranches, setDefaultTranches] = useState('3');
  const [chatNumber, setChatNumber] = useState('+22890000000');
  const [yasNumber, setYasNumber] = useState('');
  const [floozNumber, setFloozNumber] = useState('');
  const [directorPin, setDirectorPin] = useState('1234');
  const [classTuitions, setClassTuitions] = useState([
    { id: 1, name: 'CP1', amount: 120000 },
    { id: 2, name: 'CE1', amount: 120000 },
    { id: 3, name: '6ème', amount: 150000 }
  ]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase.from('global_settings').select('data').eq('id', 1).single();
      if (data && data.data) {
        const parsed = data.data;
        if (parsed.defaultTranches) setDefaultTranches(parsed.defaultTranches);
        if (parsed.chatNumber) setChatNumber(parsed.chatNumber);
        if (parsed.yasNumber) setYasNumber(parsed.yasNumber);
        if (parsed.floozNumber) setFloozNumber(parsed.floozNumber);
        if (parsed.directorPin) setDirectorPin(parsed.directorPin);
        if (parsed.classTuitions && parsed.classTuitions.length > 0) setClassTuitions(parsed.classTuitions);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleTuitionChange = (id, field, value) => {
    setClassTuitions(classTuitions.map(ct => ct.id === id ? { ...ct, [field]: value } : ct));
  };

  const addClassTuition = () => {
    setClassTuitions([...classTuitions, { id: Date.now(), name: '', amount: '' }]);
  };

  const removeClassTuition = (id) => {
    setClassTuitions(classTuitions.filter(ct => ct.id !== id));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    const { data: currentData } = await supabase.from('global_settings').select('data').eq('id', 1).single();
    const settings = currentData?.data || {};
    
    settings.defaultTranches = defaultTranches;
    settings.chatNumber = chatNumber;
    settings.yasNumber = yasNumber;
    settings.floozNumber = floozNumber;
    settings.directorPin = directorPin;
    settings.classTuitions = classTuitions;
    
    await supabase.from('global_settings').upsert([{ id: 1, data: settings }]);
    
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
        
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>
            Code PIN Directeur (Sécurité)
          </label>
          <input 
            type="password" 
            className="search-input" 
            value={directorPin} 
            onChange={(e) => setDirectorPin(e.target.value)}
            placeholder="Ex: 1234"
            maxLength={6}
            style={{ width: '100%', padding: '10px', letterSpacing: '2px' }}
          />
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Ce code est requis pour annuler ou modifier à la baisse un paiement déjà effectué.
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
  const defaultSettings = {
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

  const [bulletinSettings, setBulletinSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase.from('global_settings').select('data').eq('id', 2).single();
      if (data && data.data) {
        setBulletinSettings({ ...defaultSettings, ...data.data });
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);
  
  const [message, setMessage] = useState('');

  const handleChange = (field, value) => {
    setBulletinSettings({ ...bulletinSettings, [field]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await supabase.from('global_settings').upsert([{ id: 2, data: bulletinSettings }]);
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

  const [directorProfile, setDirectorProfile] = useState({
    name: 'M. le Directeur',
    email: 'directeur@ecole.com',
    photo: 'https://i.pravatar.cc/150?u=director'
  });

  const [adminsList, setAdminsList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProfileAndAdmins = async () => {
      // Profile
      const { data: settingsData } = await supabase.from('global_settings').select('data').eq('id', 1).single();
      if (settingsData && settingsData.data && settingsData.data.directorProfile) {
        setDirectorProfile(settingsData.data.directorProfile);
      }
      
      // Admins
      const { data, error } = await supabase.from('admins').select('*');
      if (data) setAdminsList(data);
      setLoading(false);
    };
    fetchProfileAndAdmins();
  }, []);
  
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [adminMessage, setAdminMessage] = useState('');
  
  const [adminToEdit, setAdminToEdit] = useState(null); // { originalEmail, email, password, id }
  const [adminToDelete, setAdminToDelete] = useState(null); // id string
  const [imageToCrop, setImageToCrop] = useState(null); // For avatar crop

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (adminsList.find(a => a.username === newAdminEmail)) {
      setAdminMessage('Cet administrateur existe déjà.');
      setTimeout(() => setAdminMessage(''), 3000);
      return;
    }

    const { data, error } = await supabase.from('admins').insert([
      { username: newAdminEmail, password: newAdminPassword }
    ]).select();

    if (!error && data) {
      setAdminsList([...adminsList, data[0]]);
      setAdminMessage('Administrateur ajouté avec succès.');
      setNewAdminEmail('');
      setNewAdminPassword('');
    } else {
      setAdminMessage('Erreur lors de l\'ajout.');
    }
    setTimeout(() => setAdminMessage(''), 3000);
  };

  const saveEditedAdmin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('admins').update({ username: adminToEdit.email, password: adminToEdit.password }).eq('id', adminToEdit.id);
    if (!error) {
      setAdminsList(adminsList.map(a => a.id === adminToEdit.id ? { ...a, username: adminToEdit.email, password: adminToEdit.password } : a));
      setAdminToEdit(null);
    }
  };

  const confirmDeleteAdmin = async () => {
    const { error } = await supabase.from('admins').delete().eq('id', adminToDelete);
    if (!error) {
      setAdminsList(adminsList.filter(a => a.id !== adminToDelete));
      setAdminToDelete(null);
    }
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
        <div className="form-group" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <img src={directorProfile.photo} alt="Profil" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid white', boxShadow: 'var(--shadow-sm)' }} />
            {isDirector && (
              <label htmlFor="photo-upload" style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--color-primary)', color: 'white', border: '2px solid white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }} title="Modifier l'avatar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </label>
            )}
            <input 
              id="photo-upload" 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImageToCrop(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
                e.target.value = ''; // Reset to allow selecting the same file again
              }} 
            />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px' }}>{directorProfile.name}</h3>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{isDirector ? 'Directeur' : 'Administrateur'}</span>
          </div>
        </div>
        
        {imageToCrop && (
          <ImageCropper
            imageSrc={imageToCrop}
            onCropComplete={(croppedImage) => {
              setDirectorProfile(prev => ({ ...prev, photo: croppedImage }));
              setImageToCrop(null);
            }}
            onCancel={() => setImageToCrop(null)}
          />
        )}
        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Nom complet</label>
          <input type="text" className="search-input" value={directorProfile.name} onChange={e => setDirectorProfile({...directorProfile, name: e.target.value})} style={{ width: '100%', padding: '10px' }} disabled={!isDirector} />
        </div>
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Adresse Email</label>
          <input type="email" className="search-input" value={directorProfile.email} onChange={e => setDirectorProfile({...directorProfile, email: e.target.value})} style={{ width: '100%', padding: '10px' }} disabled={!isDirector} />
        </div>
        {isDirector && (
          <button className="btn-primary" style={{ padding: '10px 24px' }} onClick={async () => {
             const { data: currentData } = await supabase.from('global_settings').select('data').eq('id', 1).single();
             const settings = currentData?.data || {};
             settings.directorProfile = directorProfile;
             await supabase.from('global_settings').upsert([{ id: 1, data: settings }]);
             alert('Profil mis à jour ! Le changement apparaîtra dans le menu en haut à droite.');
             // Optional: window.location.reload() or propagate state.
          }}>
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
                    <div style={{ fontWeight: 500, color: 'var(--text-main)', marginBottom: '4px' }}>{admin.username}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Mot de passe : {admin.password}</div>
                  </div>
                  {isDirector && (
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }} onClick={() => setAdminToEdit({ id: admin.id, email: admin.username, password: admin.password })} title="Modifier">
                        ✏️
                      </button>
                      <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }} onClick={() => setAdminToDelete(admin.id)} title="Supprimer">
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
          <div className="app-card animate-scale-in" style={{ width: '400px', padding: '32px' }}>
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
          <div className="app-card animate-scale-in" style={{ width: '400px', padding: '32px', textAlign: 'center' }}>
            <div style={{ background: '#FEF2F2', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#EF4444' }}>
              <AlertCircle size={32} />
            </div>
            <h3 style={{ marginBottom: '16px' }}>Confirmer la suppression</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
              Voulez-vous vraiment supprimer cet accès ? Cette action est irréversible.
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
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      const { data, error } = await supabase.from('teachers').select('*');
      if (data) {
        data.sort((a,b) => a.name.localeCompare(b.name));
        setTeachers(data);
      }
      setLoading(false);
    };
    fetchTeachers();
  }, []);
  
  const [newName, setNewName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [currentClass, setCurrentClass] = useState('');
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [currentHour, setCurrentHour] = useState('');
  const [message, setMessage] = useState('');
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
        text += `- Classe: ${a.class} | Cours: ${a.subject === '-' ? 'Tous' : a.subject} | Jour: ${a.day === '-' ? 'Tous' : a.day} | Heure: ${a.hour}\n`;
      });
    } else {
      text += "(Aucune affectation précise)\n";
    }
    text += `\n(Les identifiants ne sont pas inclus pour des raisons de confidentialité)\n\nCordialement, La Direction.`;
    
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  const PREDEFINED_DAYS = [
    'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'
  ];

  const PREDEFINED_HOURS = [
    '1ère heure', '2ème heure', '3ème heure', '4ème heure', '5ème heure',
    '6ème heure', '7ème heure', '8ème heure', '9ème heure', '10ème heure'
  ];

  const PREDEFINED_SUBJECTS = [
    'Cours Primaire', 'Mathématiques', 'Physique-Chimie', 'SVT', 'Philosophie', 'Anglais',
    'Français', 'Histoire-Géo', 'ECM', 'Allemand', 'Espagnol', 'EPS'
  ];

  const PREDEFINED_CLASSES = [
    'CEI1', 'CEI2', 'CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2',
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
      day: currentDay || '-',
      hour: currentHour || '-'
    }]);
    setCurrentClass('');
    setCurrentSubject('');
    setCurrentDay('');
    setCurrentHour('');
  };

  const handleRemoveAssignment = (index) => {
    setAssignments(assignments.filter((_, i) => i !== index));
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    if (!newName) return;
    
    let finalAssignments = [...assignments];
    if (currentClass) {
      finalAssignments.push({ class: currentClass, subject: currentSubject || '-', day: currentDay || '-', hour: currentHour || '-' });
    }

    if (finalAssignments.length === 0) {
      alert('Veuillez ajouter au moins une affectation (classe/cours) au tableau.');
      return;
    }
    
    const uniqueClasses = [...new Set(finalAssignments.map(a => a.class))];
    const uniqueSubjects = [...new Set(finalAssignments.map(a => a.subject).filter(s => s !== '-'))];
    const uniqueDays = [...new Set(finalAssignments.map(a => a.day).filter(d => d !== '-'))];
    const uniqueHours = [...new Set(finalAssignments.map(a => a.hour).filter(h => h !== '-'))];

    if (editingTeacherId) {
      const { data, error } = await supabase.from('teachers').update({
        name: newName,
        whatsapp: whatsapp,
        assignments: finalAssignments,
        classes: uniqueClasses,
        subjects: uniqueSubjects,
        days: uniqueDays,
        hours: uniqueHours
      }).eq('id', editingTeacherId).select();

      if (!error && data) {
        let updated = teachers.map(t => t.id === editingTeacherId ? data[0] : t);
        updated.sort((a,b) => a.name.localeCompare(b.name));
        setTeachers(updated);
        setMessage(`Enseignant ${newName} mis à jour avec succès.`);
      }
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
        days: uniqueDays,
        hours: uniqueHours
      };
      
      const { data, error } = await supabase.from('teachers').insert([newTeacher]).select();
      if (!error && data) {
        let updated = [...teachers, data[0]];
        updated.sort((a,b) => a.name.localeCompare(b.name));
        setTeachers(updated);
        setMessage(`Enseignant ajouté ! ID: ${newId} | Mdp: ${newPassword}`);
      }
    }
    
    setNewName('');
    setWhatsapp('');
    setAssignments([]);
    setCurrentClass('');
    setCurrentSubject('');
    setCurrentDay('');
    setCurrentHour('');
    setEditingTeacherId(null);
    setTimeout(() => setMessage(''), 10000);
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

  const confirmDeleteTeacher = async () => {
    if (teacherToDelete) {
      const { error } = await supabase.from('teachers').delete().eq('id', teacherToDelete.id);
      if (!error) {
        setTeachers(teachers.filter(t => t.id !== teacherToDelete.id));
        setTeacherToDelete(null);
      }
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
              <div style={{ flex: '1 1 120px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--text-muted)' }}>Cours (Opt.)</label>
                <select className="search-input" value={currentSubject} onChange={e => setCurrentSubject(e.target.value)} style={{ width: '100%', padding: '8px' }}>
                  <option value="">Aucun</option>
                  {PREDEFINED_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ flex: '1 1 120px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--text-muted)' }}>Jour (Opt.)</label>
                <select className="search-input" value={currentDay} onChange={e => setCurrentDay(e.target.value)} style={{ width: '100%', padding: '8px' }}>
                  <option value="">Aucun</option>
                  {PREDEFINED_DAYS.map(d => <option key={d} value={d}>{d}</option>)}
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
                <tr style={{ background: 'var(--bg-app)', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Classe</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Cours</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Jour</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Heure</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid var(--border-light)', background: 'white' }}>
                    <td style={{ padding: '12px', color: 'var(--text-main)' }}>{assignment.class}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{assignment.subject}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{assignment.day}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{assignment.hour}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button type="button" onClick={() => handleRemoveAssignment(index)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '18px' }}>&times;</button>
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
          
          <div className="search-input-wrapper" style={{ marginBottom: '24px', maxWidth: '400px' }}>
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Rechercher un enseignant..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {[...teachers]
              .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .sort((a,b) => a.name.localeCompare(b.name))
              .map((teacher) => (
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
                        <th style={{ padding: '6px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Jour</th>
                        <th style={{ padding: '6px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Heure</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teacher.assignments.map((a, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #E2E8F0', background: 'white' }}>
                          <td style={{ padding: '6px' }}>{a.class}</td>
                          <td style={{ padding: '6px', color: a.subject === '-' ? '#94A3B8' : 'inherit' }}>{a.subject === '-' ? 'Aucun' : a.subject}</td>
                          <td style={{ padding: '6px', color: a.day === '-' ? '#94A3B8' : 'inherit' }}>{a.day === '-' ? 'Aucun' : a.day}</td>
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
                [...teachers].sort((a,b) => a.name.localeCompare(b.name)).map(t => (
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
            {[...teachers].sort((a,b) => a.name.localeCompare(b.name)).map(t => (
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
  const [loading, setLoading] = useState(false);
  
  const [transactions, setTransactions] = useState([]);
  const [historyDate, setHistoryDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getTransactions();
      setTransactions(data);
    };
    fetchHistory();
  }, []);

  const handleUnlock = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;

      if (data.user) {
        setIsUnlocked(true);
        setShowLogin(false);
        setError('');
        setResetMessage('');
      }
    } catch (err) {
      setError('Identifiants incorrects.');
      setResetMessage('');
    } finally {
      setLoading(false);
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

        <div className="students-grid stagger-children" style={{ filter: !isUnlocked ? 'blur(6px)' : 'none', transition: 'filter 0.3s ease', opacity: !isUnlocked ? 0.7 : 1, userSelect: !isUnlocked ? 'none' : 'auto', marginBottom: '32px' }}>
          <div className="app-card">
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

          <div className="app-card">
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
                <button type="button" className="btn-outline" style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border-light)', borderRadius: '8px', cursor: 'pointer' }} onClick={() => {setShowLogin(false); setError(''); setResetMessage('');}} disabled={loading}>Annuler</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }} disabled={loading}>{loading ? 'Vérification...' : 'Déverrouiller'}</button>
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

      <div className="students-grid stagger-children" style={{ animationDelay: '200ms', marginTop: '32px' }}>
         <div className="app-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="stat-icon-soft blue"><Users size={24} /></div>
            <div className="stat-details">
              <h4>Total Élèves</h4>
              <span className="stat-num">{stats.totalStudents}</span>
            </div>
         </div>
         
         <div className="app-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="stat-icon-soft purple"><Activity size={24} /></div>
            <div className="stat-details">
              <h4>Recouvrement</h4>
              <span className="stat-num">{stats.collectionRate}%</span>
            </div>
         </div>
         
         <div className="app-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="stat-icon-soft green"><TrendingUp size={24} /></div>
            <div className="stat-details">
              <h4>Paiements (Aujourd'hui)</h4>
              <span className="stat-num">12</span>
            </div>
         </div>
      </div>
      
      {(() => {
        // Filter by selected date
        const displayPayments = transactions.filter(t => {
          if (!t.date) return false;
          const tDate = t.date.split('T')[0];
          return tDate === historyDate;
        });
        
        return (
          <div className="recent-transactions animate-fade-in-up" style={{ animationDelay: '400ms', marginTop: '32px' }}>
         <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <h3>Derniers paiements enregistrés</h3>
           <div style={{ position: 'relative', display: 'inline-block' }}>
             <div className="btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'white' }}>
               <Calendar size={16} />
               <span style={{ fontWeight: 500 }}>Historique :</span>
               <input 
                 type="date" 
                 value={historyDate}
                 onChange={(e) => setHistoryDate(e.target.value)}
                 style={{ 
                   border: 'none', 
                   outline: 'none', 
                   background: 'transparent',
                   color: 'var(--text-color)',
                   fontFamily: 'inherit',
                   fontSize: '14px',
                   cursor: 'pointer'
                 }}
               />
             </div>
           </div>
         </div>
         <div className="table-wrapper">
           <table className="modern-table">
             <thead>
               <tr>
                 <th>Élève</th>
                 <th>Classe</th>
                 <th>Heure</th>
                 <th>Montant</th>
                 <th>Enregistré par</th>
                 <th>Statut</th>
                 <th style={{ width: '40px' }}></th>
               </tr>
             </thead>
             <tbody>
               {displayPayments.length > 0 ? displayPayments.map((payment, idx) => {
                 const timeString = new Date(payment.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                 return (
                 <tr key={idx}>
                   <td>
                     <div className="student-cell">
                       <div className="avatar-sm" style={{background: 'var(--color-primary)'}}>{payment.students?.name?.charAt(0).toUpperCase()}</div>
                       <span>{payment.students?.name}</span>
                     </div>
                   </td>
                   <td>{payment.students?.grade}</td>
                   <td>{timeString}</td>
                   <td className="amount-cell">{payment.amount.toLocaleString()} FCFA</td>
                   <td>
                     <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                       <User size={12} />
                       {payment.recorded_by || 'Directeur'}
                     </span>
                   </td>
                   <td><span className="badge badge-success">Validé</span></td>
                   <td style={{ textAlign: 'right' }}>
                     {/* onViewStudent n'est plus directement applicable sans familyId. On pourrait chercher familyId ou juste l'ignorer ici */}
                   </td>
                 </tr>
               )}) : (
                 <tr>
                   <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>Aucun paiement enregistré pour cette date.</td>
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

  // Premium Subscription state
  const [premiumState, setPremiumState] = useState(null);
  const [showPremiumBlocker, setShowPremiumBlocker] = useState(false);
  const [showPaymentSimulation, setShowPaymentSimulation] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly'); // 'monthly' or 'yearly'
  const [simPhoneNumber, setSimPhoneNumber] = useState('');
  const [simProcessing, setSimProcessing] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null); // For avatar crop from header

  // Profile State
  const [directorProfile, setDirectorProfile] = useState({
    name: 'M. le Directeur',
    email: 'directeur@ecole.com',
    photo: 'https://i.pravatar.cc/150?u=director'
  });

  useEffect(() => {
    const fetchPremiumStatusAndProfile = async () => {
      // 1. Fetch Profile (ID: 1)
      const { data: profileData } = await supabase.from('global_settings').select('data').eq('id', 1).single();
      if (profileData && profileData.data && profileData.data.directorProfile) {
        setDirectorProfile(profileData.data.directorProfile);
      }

      // 2. Fetch Premium Status (ID: 3)
      const { data, error } = await supabase.from('global_settings').select('data').eq('id', 3).single();
      
      let currentPremiumSettings = null;
      if (!data || error) {
        currentPremiumSettings = {
          firstConnectionDate: new Date().toISOString(),
          isPremium: false
        };
        await supabase.from('global_settings').upsert([{ id: 3, data: currentPremiumSettings }]);
      } else {
        currentPremiumSettings = data.data;
      }
      
      const firstConn = new Date(currentPremiumSettings.firstConnectionDate);
      const today = new Date();
      const diffTime = today.getTime() - firstConn.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const daysLeft = 30 - diffDays;
      
      currentPremiumSettings.daysLeft = daysLeft;
      setPremiumState(currentPremiumSettings);
      
      if (!currentPremiumSettings.isPremium && daysLeft <= 0) {
        setTimeout(() => {
          setShowPremiumBlocker(true);
        }, 5000);
      }
    };
    fetchPremiumStatusAndProfile();
  }, [activeTab]);

  const [stats, setStats] = useState({
    totalPaid: 0,
    totalRemaining: 0,
    totalStudents: 0,
    collectionRate: 0
  });

  const [currentFamilies, setCurrentFamilies] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Pour une migration rapide, on peut soit interroger les tables relationnelles,
      // soit reconstruire la structure requise par les sous-composants.
      
      const { data: studentsData } = await supabase.from('students').select('*');
      const { data: paymentsData } = await supabase.from('payments').select('*');
      
      let actualTotalStudents = studentsData ? studentsData.length : 0;
      let actualTotalPaid = 0;
      let actualTotalRemaining = 0;
      
      if (paymentsData) {
        paymentsData.forEach(payment => {
          actualTotalPaid += (payment.amount_paid || 0);
          const remaining = (payment.amount || 0) - (payment.amount_paid || 0);
          if (remaining > 0) {
            actualTotalRemaining += remaining;
          }
        });
      }

      const actualCollectionRate = actualTotalPaid + actualTotalRemaining > 0 
        ? Math.round((actualTotalPaid / (actualTotalPaid + actualTotalRemaining)) * 100)
        : 0;

      setStats({
        totalPaid: actualTotalPaid,
        totalRemaining: actualTotalRemaining,
        totalStudents: actualTotalStudents,
        collectionRate: actualCollectionRate
      });

      // Populate currentFamilies for downstream components (PaymentsView, DashboardOverview)
      const nested = await getFamiliesNested();
      setCurrentFamilies(nested);
    };
    fetchDashboardData();
  }, [activeTab]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (!value.trim()) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    const { data: families } = await supabase.from('families').select('*').ilike('parent_name', `%${value}%`);
    const { data: students } = await supabase.from('students').select('*, families(parent_name)').ilike('name', `%${value}%`);
    
    const results = [];
    if (families) {
      families.forEach(family => {
        results.push({ type: 'parent', name: family.parent_name, familyId: family.id });
      });
    }
    if (students) {
      students.forEach(student => {
        results.push({ type: 'student', name: student.name, familyId: student.family_id, parentName: student.families?.parent_name });
      });
    }
    
    setSearchResults(results);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (result) => {
    setSearchQuery(result.name);
    setShowSuggestions(false);
    setActiveTab('students');
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
          <a href="#" className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('payments'); setIsMobileMenuOpen(false); }}>
            <span className="nav-icon">💳</span> Paiements
          </a>
          <div className="nav-group">
            <a 
              href="#" 
              className={`nav-item ${activeTab.startsWith('settings') ? 'active' : ''}`} 
              onClick={(e) => { 
                e.preventDefault(); 
                if (isDirector) {
                  setIsSettingsOpen(!isSettingsOpen); 
                }
              }}
              style={!isDirector ? { opacity: 0.5, cursor: 'not-allowed', background: 'transparent' } : {}}
            >
              <span className="nav-icon">⚙️</span> Paramètres
              <ChevronDown size={16} style={{ marginLeft: 'auto', transform: isSettingsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </a>
            {isSettingsOpen && isDirector && (
              <div className="sub-nav animate-fade-in-up" style={{ paddingLeft: '40px', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                <a 
                  href="#" 
                  className={`nav-item ${activeTab === 'settings-plan' ? 'active' : ''}`} 
                  style={{ fontSize: '14px', padding: '8px 12px', minHeight: 'auto', whiteSpace: 'nowrap' }} 
                  onClick={(e) => { e.preventDefault(); setActiveTab('settings-plan'); setIsMobileMenuOpen(false); }}
                >
                  Plan
                </a>
                <a 
                  href="#" 
                  className={`nav-item ${activeTab === 'settings-bulletin' ? 'active' : ''}`} 
                  style={{ fontSize: '14px', padding: '8px 12px', minHeight: 'auto', whiteSpace: 'nowrap' }} 
                  onClick={(e) => { e.preventDefault(); setActiveTab('settings-bulletin'); setIsMobileMenuOpen(false); }}
                >
                  Paramétrage bulletin
                </a>
                <a 
                  href="#" 
                  className={`nav-item ${activeTab === 'settings-teachers' ? 'active' : ''}`} 
                  style={{ fontSize: '14px', padding: '8px 12px', minHeight: 'auto', whiteSpace: 'nowrap' }} 
                  onClick={(e) => { e.preventDefault(); setActiveTab('settings-teachers'); setIsMobileMenuOpen(false); }}
                >
                  Gestion des enseignants
                </a>
                <a 
                  href="#" 
                  className={`nav-item ${activeTab === 'settings-personal' ? 'active' : ''}`} 
                  style={{ fontSize: '14px', padding: '8px 12px', minHeight: 'auto', whiteSpace: 'nowrap' }} 
                  onClick={(e) => { e.preventDefault(); setActiveTab('settings-personal'); setIsMobileMenuOpen(false); }}
                >
                  Informations personnelles
                </a>
              </div>
            )}
          </div>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header" style={{ position: 'relative' }}>
           <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(true)}>
             <Menu size={24} />
           </button>
           <div className="search-bar-container" style={{ position: 'relative' }}>
             {/* L'ancienne barre de recherche globale a été supprimée */}
           </div>

            {/* Premium Badge (Centered & Clickable) */}
            {premiumState && !premiumState.isPremium && (
              <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', zIndex: 20 }}>
                <button 
                  onClick={() => setShowPaymentSimulation(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: premiumState.daysLeft > 5 ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' : 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
                    color: premiumState.daysLeft > 5 ? '#92400E' : '#B91C1C',
                    border: `1px solid ${premiumState.daysLeft > 5 ? '#FCD34D' : '#FCA5A5'}`,
                    padding: '6px 16px',
                    borderRadius: '24px',
                    fontSize: '13px',
                    fontWeight: 700,
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'; }}
                >
                  <Crown size={16} color={premiumState.daysLeft > 5 ? '#D97706' : '#DC2626'} />
                  Essai Gratuit - Reste {premiumState.daysLeft > 0 ? premiumState.daysLeft : 0} jour(s)
                </button>
              </div>
            )}
            
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
                <div style={{ position: 'relative' }}>
                  <img 
                    src={currentUser.role === 'admin' ? 'https://i.pravatar.cc/150?u=admin' : directorProfile.photo} 
                    alt="Profil" 
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-light)' }} 
                  />
                  {currentUser.role === 'director' && (
                    <div 
                      style={{ position: 'absolute', bottom: -2, right: -2, background: 'var(--color-primary)', color: 'white', borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid white' }}
                      onClick={(e) => { e.stopPropagation(); document.getElementById('header-photo-upload').click(); }}
                      title="Modifier l'avatar"
                    >
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </div>
                  )}
                </div>
                {currentUser.role === 'director' && (
                  <input 
                    id="header-photo-upload" 
                    type="file" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setImageToCrop(reader.result);
                        reader.readAsDataURL(file);
                      }
                      e.target.value = '';
                    }} 
                  />
                )}
                <div className="user-info" style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="name" style={{ fontWeight: 600, fontSize: '14px' }}>
                    {currentUser.role === 'admin' ? currentUser.name : directorProfile.name}
                  </span>
                  <span className="role" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {currentUser.role === 'admin' ? 'Administrateur' : 'Directeur'}
                  </span>
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
          {activeTab === 'payments' && <PaymentsView currentFamilies={currentFamilies} />}
          {activeTab === 'settings-plan' && <SettingsPlan />}
          {activeTab === 'settings-personal' && <SettingsPersonal />}
          {activeTab === 'settings-teachers' && <SettingsTeachers />}
          {activeTab === 'settings-bulletin' && <SettingsBulletin />}
        </div>
      </main>

      {/* Premium Blocker Modal */}
      {showPremiumBlocker && !showPaymentSimulation && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="animate-fade-in-up" style={{ background: 'white', padding: '40px', borderRadius: '16px', maxWidth: '480px', width: '90%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ background: '#FEE2E2', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#EF4444' }}>
              <Lock size={40} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', color: '#0F172A' }}>Période d'essai terminée</h2>
            <p style={{ color: '#475569', marginBottom: '32px', lineHeight: 1.6 }}>
              Votre période d'essai gratuit de 30 jours est arrivée à expiration. Pour continuer à profiter de toutes les fonctionnalités d'Edu-Pay (gestion des élèves, recouvrements, impressions...), veuillez activer votre abonnement Premium.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button onClick={() => setShowPaymentSimulation(true)} className="btn-primary" style={{ background: '#F59E0B', borderColor: '#F59E0B', fontSize: '16px', padding: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>📱</span> Payer par TMoney / Flooz
              </button>
              <button onClick={() => alert("Veuillez contacter le support Edu-Pay à l'adresse support@edupay.com.")} className="btn-outline" style={{ padding: '14px' }}>
                Contacter l'administrateur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Simulation Modal */}
      {showPaymentSimulation && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(12px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="animate-fade-in-up" style={{ background: 'white', padding: '32px', borderRadius: '16px', maxWidth: '400px', width: '90%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
               <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>Paiement Sécurisé</h3>
               <button onClick={() => setShowPaymentSimulation(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: '#94A3B8' }}>✕</button>
            </div>
            
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #E2E8F0' }}>
               <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#475569' }}>Choisissez votre plan</h4>
               
               <div 
                 onClick={() => setSelectedPlan('monthly')}
                 style={{ 
                   display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                   padding: '12px', marginBottom: '8px', borderRadius: '8px', cursor: 'pointer',
                   border: selectedPlan === 'monthly' ? '2px solid #10B981' : '1px solid #CBD5E1',
                   background: selectedPlan === 'monthly' ? '#ECFDF5' : 'white'
                 }}
               >
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: selectedPlan === 'monthly' ? '4px solid #10B981' : '1px solid #94A3B8' }}></div>
                   <span style={{ fontWeight: 600, color: '#0F172A' }}>Mensuel</span>
                 </div>
                 <span style={{ fontWeight: 700, color: '#0F172A' }}>5 000 FCFA</span>
               </div>

               <div 
                 onClick={() => setSelectedPlan('yearly')}
                 style={{ 
                   display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                   padding: '12px', borderRadius: '8px', cursor: 'pointer',
                   border: selectedPlan === 'yearly' ? '2px solid #10B981' : '1px solid #CBD5E1',
                   background: selectedPlan === 'yearly' ? '#ECFDF5' : 'white'
                 }}
               >
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: selectedPlan === 'yearly' ? '4px solid #10B981' : '1px solid #94A3B8' }}></div>
                   <div style={{ display: 'flex', flexDirection: 'column' }}>
                     <span style={{ fontWeight: 600, color: '#0F172A' }}>Annuel</span>
                     <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>Économisez 20 000 FCFA</span>
                   </div>
                 </div>
                 <span style={{ fontWeight: 700, color: '#0F172A' }}>40 000 FCFA</span>
               </div>
            </div>

            <div>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  if (!window.FedaPay) {
                    alert("L'outil de paiement n'est pas encore prêt. Veuillez patienter ou recharger la page.");
                    return;
                  }
                  setSimProcessing(true);
                  let widget = window.FedaPay.init({
                    public_key: 'pk_live_C2KkZEsYgriOFu-4NrbTM-t2',
                    transaction: {
                      amount: selectedPlan === 'monthly' ? 5000 : 40000,
                      description: 'Abonnement Premium Edu-Pay (' + (selectedPlan === 'monthly' ? 'Mensuel' : 'Annuel') + ')'
                    },
                    customer: {
                      email: 'directeur@edupay.com',
                      lastname: 'Directeur'
                    },
                    onComplete: async function(resp) {
                      if(resp.reason === 'CHECKOUT COMPLETE') {
                        const newSettings = { ...premiumState, isPremium: true, plan: selectedPlan };
                        await supabase.from('global_settings').upsert([{ id: 3, data: newSettings }]);
                        setPremiumState(newSettings);
                        setShowPremiumBlocker(false);
                        setShowPaymentSimulation(false);
                      } else {
                        console.log("Paiement non finalisé:", resp);
                      }
                      setSimProcessing(false);
                    }
                  });
                  widget.open();
                }}
                disabled={simProcessing} 
                className="btn-primary" 
                style={{ width: '100%', padding: '14px', fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: simProcessing ? '#94A3B8' : '#10B981', borderColor: simProcessing ? '#94A3B8' : '#10B981' }}
              >
                {simProcessing ? 'Ouverture...' : `Payer ${selectedPlan === 'monthly' ? '5 000' : '40 000'} FCFA`}
              </button>
            </div>
            <p style={{ textAlign: 'center', fontSize: '12px', color: '#94A3B8', marginTop: '16px' }}>
              Paiement sécurisé par FedaPay.
            </p>
          </div>
        </div>
      )}

      {imageToCrop && (
        <ImageCropper
          imageSrc={imageToCrop}
          onCropComplete={async (croppedImage) => {
            const updatedProfile = { ...directorProfile, photo: croppedImage };
            setDirectorProfile(updatedProfile);
            setImageToCrop(null);
            // Save to global settings
            const { data: currentData } = await supabase.from('global_settings').select('data').eq('id', 1).single();
            const settings = currentData?.data || {};
            settings.directorProfile = updatedProfile;
            await supabase.from('global_settings').upsert([{ id: 1, data: settings }]);
          }}
          onCancel={() => setImageToCrop(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
