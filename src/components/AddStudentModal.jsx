import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AddStudentModal = ({ isOpen, onClose, onAdd, initialData }) => {
  const [parentName, setParentName] = useState('');
  const [parentId, setParentId] = useState('');
  const [parentPassword, setParentPassword] = useState('');
  const [parentWhatsapp, setParentWhatsapp] = useState('');
  const [parentDirectCall, setParentDirectCall] = useState('');
  const [numberOfChildren, setNumberOfChildren] = useState(1);
  
  const getDefaultTranches = () => {
    const saved = localStorage.getItem('eduPayGlobalSettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.defaultTranches || '3';
    }
    return '3';
  };
  
  const [childrenData, setChildrenData] = useState([{ name: '', sex: '', grade: '', tranches: getDefaultTranches() }]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setParentName(initialData.parentName || '');
        setParentWhatsapp(initialData.parentWhatsapp || '');
        setParentDirectCall(initialData.parentDirectCall || '');
        // Si ces infos étaient enregistrées, on les récupère (pour la compatibilité)
        setParentId(initialData.parentId || `P${Math.floor(1000 + Math.random() * 9000)}`);
        setParentPassword(initialData.parentPassword || 'mdp123');
        
        const kids = initialData.children || [];
        setNumberOfChildren(kids.length || 1);
        setChildrenData(kids.length > 0 ? kids.map(k => ({
          name: k.name || '',
          sex: k.sex || '',
          grade: k.grade || '',
          tranches: k.payments ? k.payments.length.toString() : '3'
        })) : [{ name: '', sex: '', grade: '', tranches: '3' }]);
      } else {
        setParentName('');
        setParentId('');
        setParentPassword('');
        setParentWhatsapp('');
        setParentDirectCall('');
        setNumberOfChildren(1);
        setChildrenData([{ name: '', sex: '', grade: '', tranches: getDefaultTranches() }]);
      }
    }
  }, [isOpen, initialData]);

  const handleParentNameChange = (e) => {
    const name = e.target.value;
    setParentName(name);
    
    // On ne génère ou ne modifie l'ID et le mot de passe que lors de la CRÉATION d'un parent (initialData est absent)
    if (!initialData) {
      if (name.trim().length > 0) {
        const firstPart = name.split(' ')[0].replace(/[^a-zA-Z]/g, '');
        setParentPassword(`${firstPart.toLowerCase()}123`);
        if (!parentId) {
          setParentId(`P${Math.floor(1000 + Math.random() * 9000)}`);
        }
      } else {
        setParentPassword('');
        setParentId('');
      }
    }
  };

  if (!isOpen) return null;

  const handleChildrenCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setNumberOfChildren(count);
    const newData = [...childrenData];
    if (count > newData.length) {
      for (let i = newData.length; i < count; i++) {
        newData.push({ name: '', sex: '', grade: '', tranches: getDefaultTranches() });
      }
    } else {
      newData.splice(count);
    }
    setChildrenData(newData);
  };

  const updateChild = (index, field, value) => {
    const newData = [...childrenData];
    newData[index][field] = value;
    setChildrenData(newData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      id: initialData ? initialData.id : undefined,
      parent: {
        name: parentName,
        whatsapp: parentWhatsapp,
        directCall: parentDirectCall,
        id: parentId,
        password: parentPassword
      },
      children: childrenData
    });
    // Reset form
    setParentName('');
    setParentId('');
    setParentPassword('');
    setParentWhatsapp('');
    setParentDirectCall('');
    setNumberOfChildren(1);
    setChildrenData([{ name: '', sex: '', grade: '', tranches: getDefaultTranches() }]);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in-up" style={{ maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h3>{initialData ? 'Modifier la Famille' : 'Ajouter un élève / Famille'}</h3>
          <button type="button" className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body" style={{ padding: '24px' }}>
          <form onSubmit={handleSubmit}>
            <h4 style={{ marginBottom: '16px', color: 'var(--color-primary)' }}>Informations du Parent</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Nom complet</label>
                <input type="text" className="search-input" required value={parentName} onChange={handleParentNameChange} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">ID Parent (Auto)</label>
                <input type="text" className="search-input" readOnly value={parentId} placeholder="Généré auto." style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-muted)' }} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Mot de passe (Auto)</label>
                <input type="text" className="search-input" readOnly value={parentPassword} placeholder="Généré auto." style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-muted)' }} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Numéro WhatsApp</label>
                <input type="tel" className="search-input" value={parentWhatsapp} onChange={(e) => setParentWhatsapp(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Numéro d'Appel Direct</label>
                <input type="tel" className="search-input" required value={parentDirectCall} onChange={(e) => setParentDirectCall(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Nombre d'enfants inscrits</label>
                <select className="search-input" value={numberOfChildren} onChange={handleChildrenCountChange}>
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
            </div>

            <h4 style={{ margin: '24px 0 16px', color: 'var(--color-primary)' }}>Informations des Enfants</h4>
            {childrenData.map((child, index) => (
              <div key={index} style={{ padding: '16px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', marginBottom: '16px', background: 'var(--bg-app)' }}>
                <h5 style={{ marginBottom: '12px' }}>Enfant {index + 1}</h5>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Nom et Prénom</label>
                    <input type="text" className="search-input" required value={child.name} onChange={(e) => updateChild(index, 'name', e.target.value)} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Classe</label>
                    <select className="search-input" required value={child.grade} onChange={(e) => updateChild(index, 'grade', e.target.value)}>
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
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Sexe</label>
                    <select className="search-input" required value={child.sex} onChange={(e) => updateChild(index, 'sex', e.target.value)}>
                      <option value="">Sélectionner</option>
                      <option value="M">Garçon</option>
                      <option value="F">Fille</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Paiement (Tranches)</label>
                    <select className="search-input" required value={child.tranches} onChange={(e) => updateChild(index, 'tranches', e.target.value)}>
                      <option value="1">1 Tranche (Intégral)</option>
                      <option value="2">2 Tranches</option>
                      <option value="3">3 Tranches</option>
                      <option value="4">4 Tranches</option>
                      <option value="5">5 Tranches</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <div className="modal-footer" style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
              <button type="button" className="btn-outline" onClick={onClose}>Annuler</button>
              <button type="submit" className="btn-primary">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;
