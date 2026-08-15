import React, { useState, useEffect } from 'react';
import { Plus, Check, Clock, AlertCircle, ArrowLeft, Phone, MessageCircle, Trash2, Edit, Printer, Share2, Banknote, FileText, Users } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import AddStudentModal from '../components/AddStudentModal';
import BulletinModal from '../components/BulletinModal';
import { getFamiliesNested, saveFamiliesToSupabase, deleteFamilyFromSupabase, addTransaction } from '../supabaseService';
import { supabase } from '../supabaseClient';


const StudentsList = ({ initialActiveFamilyId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Initialisation du state avec Supabase
  const [families, setFamilies] = useState([]);
  const [loadingFamilies, setLoadingFamilies] = useState(true);
  const [globalSettings, setGlobalSettings] = useState({});
  
  useEffect(() => {
    const fetchFam = async () => {
      const data = await getFamiliesNested();
      setFamilies(data);
      setLoadingFamilies(false);
      
      const { data: settingsData } = await supabase.from('global_settings').select('data').eq('id', 1).single();
      if (settingsData && settingsData.data) {
        setGlobalSettings(settingsData.data);
      }
    };
    fetchFam();
  }, []);
  
  const [activeFamilyId, setActiveFamilyId] = useState(initialActiveFamilyId || null);

  // Modal pour paiement manuel
  const [manualPaymentModal, setManualPaymentModal] = useState({ 
    isOpen: false, 
    familyId: null, 
    studentId: null, 
    trancheId: null,
    studentName: '',
    trancheTitle: '',
    amount: ''
  });

  // Nouveaux states pour les Bulletins
  const [activeMainTab, setActiveMainTab] = useState('familles'); // 'familles' | 'bulletins'
  const [selectedBulletinClass, setSelectedBulletinClass] = useState(null);
  const [selectedBulletinStudent, setSelectedBulletinStudent] = useState(null);
  const [isBulletinModalOpen, setIsBulletinModalOpen] = useState(false);
  const [allGrades, setAllGrades] = useState({});
  const [bulletinSettings, setBulletinSettings] = useState({});

  useEffect(() => {
    const fetchBulletinData = async () => {
      const { data: gradesData } = await supabase.from('grades').select('*');
      if (gradesData) {
        const gradesObj = {};
        gradesData.forEach(g => {
          if (!gradesObj[g.student_id]) gradesObj[g.student_id] = {};
          if (g.appreciation) {
            try {
              const parsed = JSON.parse(g.appreciation);
              gradesObj[g.student_id][g.subject] = { int: parsed.int || '', dev: parsed.dev || '', comp: parsed.comp || '', coef: parsed.coef || '1', dev1: parsed.dev1 || '', dev2: parsed.dev2 || '', dev3: parsed.dev3 || '' };
            } catch(e) {
              gradesObj[g.student_id][g.subject] = { int: '', dev: '', comp: '', coef: '1', dev1: '', dev2: '', dev3: '' };
            }
          } else {
            gradesObj[g.student_id][g.subject] = { int: '', dev: '', comp: '', coef: '1', dev1: '', dev2: '', dev3: '' };
          }
        });
        setAllGrades(gradesObj);
      }
      
      const { data: settingsData } = await supabase.from('global_settings').select('data').eq('id', 2).single();
      if (settingsData && settingsData.data) {
        setBulletinSettings(settingsData.data);
      }
    };
    fetchBulletinData();
  }, [isBulletinModalOpen, activeMainTab]);

  // Reset le local storage pour ne pas rester bloqué sur le même élève après rafraîchissement
  useEffect(() => {
    if (initialActiveFamilyId) {
      localStorage.removeItem('eduPaySelectedFamily');
    }
  }, [initialActiveFamilyId]);
  const [familyToDelete, setFamilyToDelete] = useState(null);
  const [editingFamily, setEditingFamily] = useState(null);

  // Sauvegarde automatique dans Supabase à chaque modification
  useEffect(() => {
    if (!loadingFamilies) {
      saveFamiliesToSupabase(families);
    }
  }, [families, loadingFamilies]);

  const handleAddFamilies = (data) => {
    const classTuitions = globalSettings.classTuitions || [
      { name: 'CP1', amount: 120000 },
      { name: 'CP2', amount: 120000 },
      { name: 'CE1', amount: 120000 },
      { name: 'CE2', amount: 120000 },
      { name: 'CM1', amount: 120000 },
      { name: 'CM2', amount: 120000 },
      { name: '6ème', amount: 150000 },
      { name: '5ème', amount: 150000 },
      { name: '4ème', amount: 150000 },
      { name: '3ème', amount: 150000 }
    ];

    const getTuitionForGrade = (grade) => {
      const found = classTuitions.find(ct => ct.name.toLowerCase().trim() === grade.toLowerCase().trim());
      return found ? found.amount : 120000; // Par défaut si classe non trouvée
    };

    if (data.id) {
      // Modification d'une famille existante
      setFamilies(families.map(f => {
        if (f.id === data.id) {
           const updatedChildren = data.children.map((newData, index) => {
             const existingChild = f.children[index];
             
             if (existingChild) {
                // L'enfant existait déjà, on met à jour ses infos
                return {
                  ...existingChild,
                  name: newData.name,
                  grade: newData.grade,
                  sex: newData.sex
                };
             } else {
                // C'est un nouvel enfant ajouté pendant la modification de la famille !
                const numTranches = parseInt(newData.tranches, 10) || 3;
                const baseTuition = getTuitionForGrade(newData.grade);
                const amountPerTranche = baseTuition / numTranches;
                
                const payments = Array.from({ length: numTranches }).map((_, i) => {
                  const today = new Date();
                  const deadline = new Date();
                  deadline.setMonth(today.getMonth() + (i * 2) - 1); 
          
                  return {
                    id: `pay-${Date.now()}-${index}-${i}`,
                    title: `Tranche ${i+1}`,
                    amountExpected: amountPerTranche,
                    amountPaid: 0,
                    deadline: deadline.toISOString(),
                    isFullyPaid: false
                  };
                });
          
                return {
                  id: `stu-${Date.now()}-${index}`,
                  name: newData.name,
                  grade: newData.grade,
                  sex: newData.sex,
                  totalAmount: baseTuition,
                  payments: payments
                };
             }
           });
           
           return {
             ...f,
             parentName: data.parent.name,
             parentWhatsapp: data.parent.whatsapp,
             parentDirectCall: data.parent.directCall,
             parentId: data.parent.id,
             parentPassword: data.parent.password,
             children: updatedChildren
           };
        }
        return f;
      }));
      setEditingFamily(null);
      return;
    }

    const newStudents = data.children.map((child, index) => {
      const numTranches = parseInt(child.tranches, 10);
      const baseTuition = getTuitionForGrade(child.grade);
      const amountPerTranche = baseTuition / numTranches;
      
      const payments = Array.from({ length: numTranches }).map((_, i) => {
        const today = new Date();
        const deadline = new Date();
        deadline.setMonth(today.getMonth() + (i * 2) - 1); 

        return {
          id: `pay-${Date.now()}-${index}-${i}`,
          title: `Tranche ${i+1}`,
          amountExpected: amountPerTranche,
          amountPaid: 0,
          deadline: deadline.toISOString(),
          isFullyPaid: false
        };
      });

      return {
        id: `stu-${Date.now()}-${index}`,
        name: child.name,
        grade: child.grade,
        sex: child.sex,
        totalAmount: baseTuition,
        payments: payments
      };
    });

    const newFamily = {
      id: `fam-${Date.now()}`,
      parentName: data.parent.name,
      parentWhatsapp: data.parent.whatsapp,
      parentDirectCall: data.parent.directCall,
      parentId: data.parent.id,
      parentPassword: data.parent.password,
      children: newStudents
    };

    setFamilies([...families, newFamily]);
  };

  const handleManualPaymentSubmit = (e) => {
    e.preventDefault();
    updatePayment(
      manualPaymentModal.familyId, 
      manualPaymentModal.studentId, 
      manualPaymentModal.trancheId, 
      manualPaymentModal.amount
    );
    setManualPaymentModal({ ...manualPaymentModal, isOpen: false });
  };

  const generateReceiptText = (family, student, payment) => {
    return `*REÇU DE PAIEMENT - EDUPAY*%0A%0A*École :* EduPay Démo%0A*Parent :* ${family.parentName}%0A*Élève :* ${student.name} (${student.grade})%0A*Motif :* ${payment.title}%0A%0A*Montant versé :* ${payment.amountPaid.toLocaleString()} FCFA%0A*Reste à payer :* ${(payment.amountExpected - payment.amountPaid).toLocaleString()} FCFA%0A%0AMerci pour votre paiement.`;
  };

  const handleWhatsAppReceipt = (family, student, payment) => {
    if (!family.parentWhatsapp) {
      alert("Ce parent n'a pas de numéro WhatsApp enregistré.");
      return;
    }
    const text = generateReceiptText(family, student, payment);
    const url = `https://wa.me/${family.parentWhatsapp.replace(/\D/g, '')}?text=${text}`;
    window.open(url, '_blank');
  };

  const handlePrintReceipt = (family, student, payment) => {
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(22);
    doc.setTextColor(0, 76, 153);
    doc.text('EduPay', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text('Reçu de Paiement Scolaire', 105, 30, { align: 'center' });
    
    // Ligne de séparation
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 35, 190, 35);
    
    // Informations
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 20, 50);
    doc.text(`Reçu N° : REC-${Date.now().toString().slice(-6)}`, 140, 50);
    
    doc.text(`Parent : ${family.parentName}`, 20, 65);
    doc.text(`Élève : ${student.name}`, 20, 75);
    doc.text(`Classe : ${student.grade}`, 20, 85);
    
    // Tableau
    doc.autoTable({
      startY: 100,
      head: [['Désignation', 'Montant Attendu', 'Montant Versé', 'Reste à Payer']],
      body: [
        [
          payment.title, 
          `${payment.amountExpected.toLocaleString()} FCFA`, 
          `${payment.amountPaid.toLocaleString()} FCFA`, 
          `${(payment.amountExpected - payment.amountPaid).toLocaleString()} FCFA`
        ]
      ],
      theme: 'grid',
      headStyles: { fillColor: [0, 76, 153] }
    });
    
    // Pied de page
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Document généré automatiquement par EduPay.', 105, 280, { align: 'center' });
    
    doc.save(`Recu_${student.name.replace(/\s+/g, '_')}_${payment.title.replace(/\s+/g, '_')}.pdf`);
  };

  const updatePayment = (familyId, studentId, trancheId, addedAmountStr) => {
    const addedAmount = parseFloat(addedAmountStr) || 0;
    
    setFamilies(families.map(family => {
      if (family.id !== familyId) return family;
      
      const updatedChildren = family.children.map(student => {
        if (student.id !== studentId) return student;
        
        const updatedPayments = student.payments.map(payment => {
          if (payment.id !== trancheId) return payment;
          
          const newTotalAmountPaid = payment.amountPaid + addedAmount;
          const isPaid = newTotalAmountPaid >= payment.amountExpected;
          const finalAmountPaid = newTotalAmountPaid > payment.amountExpected ? payment.amountExpected : newTotalAmountPaid;
          
          const diff = finalAmountPaid - payment.amountPaid;
          if (diff > 0) {
            addTransaction({
              id: `txn-${Date.now()}-${Math.floor(Math.random()*1000)}`,
              payment_id: payment.id,
              student_id: student.id,
              amount: diff
            });
          }

          return {
            ...payment,
            amountPaid: finalAmountPaid,
            isFullyPaid: isPaid
          };
        });
        return { ...student, payments: updatedPayments };
      });
      return { ...family, children: updatedChildren };
    }));
  };

  const toggleFullPayment = (familyId, studentId, trancheId) => {
    setFamilies(families.map(family => {
      if (family.id !== familyId) return family;
      
      const updatedChildren = family.children.map(student => {
        if (student.id !== studentId) return student;
        
        const updatedPayments = student.payments.map(payment => {
          if (payment.id !== trancheId) return payment;
          const isPaid = !payment.isFullyPaid;
          const finalAmountPaid = isPaid ? payment.amountExpected : 0;
          
          const diff = finalAmountPaid - payment.amountPaid;
          if (diff > 0) {
            addTransaction({
              id: `txn-${Date.now()}-${Math.floor(Math.random()*1000)}`,
              payment_id: payment.id,
              student_id: student.id,
              amount: diff
            });
          }

          return {
            ...payment,
            amountPaid: finalAmountPaid,
            isFullyPaid: isPaid
          };
        });
        return { ...student, payments: updatedPayments };
      });
      return { ...family, children: updatedChildren };
    }));
  };

  const confirmDelete = (id) => {
    setFamilyToDelete(id);
  };

  const confirmDeleteFamily = async () => {
    if (familyToDelete) {
      await deleteFamilyFromSupabase(familyToDelete);
      setFamilies(families.filter(f => f.id !== familyToDelete));
      setFamilyToDelete(null);
      // Si on était dans les détails de la famille supprimée, on retourne à la liste
      if (activeFamilyId === familyToDelete) {
        setActiveFamilyId(null);
      }
    }
  };

  // VUE DE DETAILS DU DOSSIER FAMILLE
  if (activeFamilyId) {
    const activeFamily = families.find(f => f.id === activeFamilyId);
    if (!activeFamily) return null;

    return (
      <div className="students-page">
        <div className="section-header" style={{ borderBottom: 'none', padding: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="icon-btn" style={{ flexShrink: 0 }} onClick={() => setActiveFamilyId(null)}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>Dossier : {activeFamily.parentName}</h2>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {activeFamily.parentDirectCall && (
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                  <Phone size={16} /> {activeFamily.parentDirectCall}
                </span>
              )}
              {activeFamily.parentWhatsapp && (
                <a 
                  href={`https://wa.me/${activeFamily.parentWhatsapp.replace(/\D/g,'')}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: '#25D366', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}
                >
                  <MessageCircle size={16} /> WhatsApp: {activeFamily.parentWhatsapp}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="students-grid stagger-children" style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
          {[...activeFamily.children].sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })).map(student => (
            <div key={student.id} className="student-card animate-fade-in-up">
              <div className="student-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                 <div className="student-info">
                   <div className="avatar-sm" style={{ background: 'var(--color-primary)' }}>
                     {student.name.charAt(0).toUpperCase()}
                   </div>
                   <div>
                     <h4 style={{ margin: 0, fontSize: '16px' }}>{student.name}</h4>
                     <span className="badge" style={{ background: '#F1F5F9', color: 'var(--text-muted)', marginTop: '4px', display: 'inline-block' }}>{student.grade} • {student.sex}</span>
                   </div>
                 </div>
                 <button className="icon-btn" title="Modifier l'élève" style={{ color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                   <Edit size={18} />
                 </button>
              </div>
              
              <div className="student-card-body">
                <h5 style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-main)', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                  Suivi des paiements ({student.totalAmount.toLocaleString()} FCFA)
                </h5>
                
                <div className="tranches-list">
                  {student.payments.map((payment) => {
                    const isOverdue = new Date(payment.deadline) < new Date() && !payment.isFullyPaid;
                    const progressPercent = Math.round((payment.amountPaid / payment.amountExpected) * 100);
                    
                    let statusClass = 'tranche-item ';
                    if (payment.isFullyPaid) statusClass += 'status-paid';
                    else if (isOverdue) statusClass += 'status-overdue';
                    else statusClass += 'status-pending';

                    return (
                      <div key={payment.id} className={statusClass}>
                        <div className="tranche-header">
                           <div className="tranche-title">
                             <input 
                               type="checkbox" 
                               checked={payment.isFullyPaid} 
                               onChange={() => toggleFullPayment(activeFamily.id, student.id, payment.id)}
                               className="tranche-checkbox"
                             />
                             <span style={{ fontWeight: 600 }}>{payment.title}</span>
                             {isOverdue && <AlertCircle size={14} color="#EF4444" style={{ marginLeft: '8px' }} title="Délai dépassé" />}
                           </div>
                           <span className="tranche-amount">{payment.amountExpected.toLocaleString()} FCFA</span>
                        </div>
                        
                        <div className="tranche-progress-section">
                           <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', margin: '12px 0 6px', color: isOverdue ? '#B91C1C' : 'var(--text-muted)' }}>
                             <span>Progression ({progressPercent}%)</span>
                             <span>{payment.amountPaid.toLocaleString()} FCFA réglés</span>
                           </div>
                           <div className="progress-bar-bg" style={{ height: '8px', background: isOverdue ? '#FEE2E2' : 'var(--border-light)' }}>
                             <div className="progress-bar-fill" style={{ width: `${progressPercent}%`, background: isOverdue ? '#EF4444' : 'var(--color-primary)' }}></div>
                           </div>
                           <div style={{ marginTop: '12px' }}>
                             <button 
                               className="btn-outline"
                               style={{ padding: '8px 12px', fontSize: '13px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                               onClick={() => setManualPaymentModal({
                                 isOpen: true,
                                 familyId: activeFamily.id,
                                 studentId: student.id,
                                 trancheId: payment.id,
                                 studentName: student.name,
                                 trancheTitle: payment.title,
                                 amount: ''
                               })}
                             >
                               <Banknote size={16} /> Effectuer un paiement manuel
                             </button>
                           </div>
                        </div>

                        {payment.amountPaid > 0 && (
                          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed var(--border-light)', display: 'flex', gap: '8px' }}>
                            <button 
                              className="btn-primary" 
                              style={{ flex: 1, padding: '8px', fontSize: '12px', background: '#25D366', borderColor: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                              onClick={() => handleWhatsAppReceipt(activeFamily, student, payment)}
                            >
                              <Share2 size={14} /> WhatsApp
                            </button>
                            <button 
                              className="btn-primary" 
                              style={{ flex: 1, padding: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                              onClick={() => handlePrintReceipt(activeFamily, student, payment)}
                            >
                              <Printer size={14} /> Imprimer
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {manualPaymentModal.isOpen && (
          <div className="modal-overlay">
            <div className="modal-content animate-fade-in-up" style={{ maxWidth: '400px', width: '100%', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--color-primary)' }}>
                <div style={{ background: 'var(--color-primary-50)', padding: '12px', borderRadius: '50%' }}>
                  <Banknote size={24} />
                </div>
                <h3 style={{ margin: 0 }}>Paiement Manuel</h3>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--text-muted)' }}>
                  Élève : <strong style={{ color: 'var(--text-main)' }}>{manualPaymentModal.studentName}</strong>
                </p>
                <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--text-muted)' }}>
                  Motif : <strong style={{ color: 'var(--text-main)' }}>{manualPaymentModal.trancheTitle}</strong>
                </p>
                
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Montant à ajouter (FCFA)</label>
                  <div className="search-input-wrapper">
                    <input 
                      type="number" 
                      className="search-input" 
                      placeholder="Ex: 50000" 
                      value={manualPaymentModal.amount}
                      onChange={(e) => setManualPaymentModal({...manualPaymentModal, amount: e.target.value})}
                      autoFocus
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-outline" style={{ flex: 1 }} onClick={() => setManualPaymentModal({...manualPaymentModal, isOpen: false})}>Annuler</button>
                <button className="btn-primary" style={{ flex: 1 }} onClick={handleManualPaymentSubmit}>Ajouter l'encaissement</button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // VUE LISTE DES FAMILLES (GAIN D'ESPACE)
  return (
    <div className="students-page">
      {/* Navigation Interne */}
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-light)', marginBottom: '24px' }}>
        <button 
          onClick={() => setActiveMainTab('familles')}
          style={{ 
            padding: '12px 24px', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeMainTab === 'familles' ? '2px solid var(--color-primary)' : '2px solid transparent',
            color: activeMainTab === 'familles' ? 'var(--color-primary)' : 'var(--text-muted)',
            fontWeight: activeMainTab === 'familles' ? 600 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Users size={18} /> Gestion des familles
        </button>
        <button 
          onClick={() => setActiveMainTab('bulletins')}
          style={{ 
            padding: '12px 24px', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeMainTab === 'bulletins' ? '2px solid var(--color-primary)' : '2px solid transparent',
            color: activeMainTab === 'bulletins' ? 'var(--color-primary)' : 'var(--text-muted)',
            fontWeight: activeMainTab === 'bulletins' ? 600 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FileText size={18} /> Bulletins de notes
        </button>
      </div>

      {activeMainTab === 'familles' && (
        <>
          <div className="section-header" style={{ borderBottom: 'none', padding: '0 0 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Liste des Familles</h2>
              <p style={{ color: 'var(--text-muted)' }}>Consultez et gérez les dossiers des élèves.</p>
            </div>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={20} /> Ajouter une famille
            </button>
          </div>

      <div className="families-grid stagger-children" style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {families.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', gridColumn: '1 / -1', border: '1px solid var(--border-light)' }}>
             <p style={{ color: 'var(--text-muted)' }}>Aucun dossier enregistré pour le moment. Cliquez sur "Ajouter une famille" pour commencer.</p>
          </div>
        ) : (
          [...families].sort((a,b) => a.parentName.localeCompare(b.parentName, 'fr', { sensitivity: 'base' })).map(family => (
            <div key={family.id} className="student-card animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', gap: '8px' }}>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setEditingFamily(family);
                    setIsModalOpen(true);
                  }} 
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Modifier la famille"
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); confirmDelete(family.id); }} 
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Supprimer la famille"
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-danger)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px', paddingRight: '24px' }}>Famille {family.parentName}</h3>
                
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {family.parentDirectCall && (
                    <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                      <Phone size={14} /> {family.parentDirectCall}
                    </span>
                  )}
                  {family.parentWhatsapp && (
                    <a 
                      href={`https://wa.me/${family.parentWhatsapp.replace(/\D/g,'')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ color: '#25D366', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontWeight: 500, fontSize: '13px' }}
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                  )}
                </div>

                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--text-main)' }}>Enfants : </strong> <br/>
                  {family.children.map(c => c.name).join(', ')}
                </p>
              </div>
              <button 
                className="btn-outline" 
                style={{ width: '100%', padding: '10px', color: 'var(--color-primary)', borderColor: 'var(--color-primary)', fontWeight: 600, background: 'var(--bg-app)' }}
                onClick={() => setActiveFamilyId(family.id)}
              >
                Accéder au dossier
              </button>
            </div>
          ))
        )}
      </div>

      <AddStudentModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingFamily(null); }} 
        onAdd={handleAddFamilies} 
        initialData={editingFamily}
        globalSettings={globalSettings}
      />

      {familyToDelete && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in-up" style={{ maxWidth: '400px', width: '100%', padding: '32px', textAlign: 'center' }}>
            <AlertCircle size={48} color="#EF4444" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ marginBottom: '12px' }}>Êtes-vous sûr ?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', lineHeight: 1.5 }}>
              Voulez-vous vraiment supprimer cette famille ? Toutes les données associées (enfants, paiements) seront définitivement effacées.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => setFamilyToDelete(null)}>Annuler</button>
              <button 
                className="btn-primary" 
                style={{ flex: 1, background: '#EF4444', border: 'none' }} 
                onClick={confirmDeleteFamily}
              >
                Oui, supprimer
              </button>
            </div>
          </div>
        </div>
      )}
      {manualPaymentModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in-up" style={{ maxWidth: '400px', width: '100%', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--color-primary)' }}>
              <div style={{ background: 'var(--color-primary-50)', padding: '12px', borderRadius: '50%' }}>
                <Banknote size={24} />
              </div>
              <h3 style={{ margin: 0 }}>Paiement Manuel</h3>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--text-muted)' }}>
                Élève : <strong style={{ color: 'var(--text-main)' }}>{manualPaymentModal.studentName}</strong>
              </p>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--text-muted)' }}>
                Motif : <strong style={{ color: 'var(--text-main)' }}>{manualPaymentModal.trancheTitle}</strong>
              </p>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Montant à ajouter (FCFA)</label>
                <div className="search-input-wrapper">
                  <input 
                    type="number" 
                    className="search-input" 
                    placeholder="Ex: 50000" 
                    value={manualPaymentModal.amount}
                    onChange={(e) => setManualPaymentModal({...manualPaymentModal, amount: e.target.value})}
                    autoFocus
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => setManualPaymentModal({...manualPaymentModal, isOpen: false})}>Annuler</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleManualPaymentSubmit}>Ajouter l'encaissement</button>
            </div>
          </div>
        </div>
      )}
      </>
      )}

      {activeMainTab === 'bulletins' && (
        <div className="animate-fade-in-up">
          {!selectedBulletinClass ? (
            <>
              <div className="section-header" style={{ borderBottom: 'none', padding: '0 0 24px 0' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Bulletins par classe</h2>
                <p style={{ color: 'var(--text-muted)' }}>Sélectionnez une classe pour voir les bulletins des élèves.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
                {Array.from(new Set(families.flatMap(f => f.children.map(c => c.grade)))).map(grade => (
                  <div key={grade} className="app-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid var(--color-primary-100)' }} onClick={() => setSelectedBulletinClass(grade)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)', padding: '12px', borderRadius: '12px' }}>
                        <Users size={24} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>Classe {grade}</h3>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Voir les élèves</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="section-header" style={{ borderBottom: 'none', padding: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button className="icon-btn" style={{ flexShrink: 0 }} onClick={() => setSelectedBulletinClass(null)}>
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>Élèves en classe de {selectedBulletinClass}</h2>
                  <p style={{ color: 'var(--text-muted)', margin: 0 }}>Génération et consultation des bulletins de notes.</p>
                </div>
              </div>

              <div className="app-card">
                <div className="table-wrapper">
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Nom et Prénom</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Sexe</th>
                        <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#475569' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {families.flatMap(f => f.children).filter(c => c.grade === selectedBulletinClass).sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })).map(student => (
                        <React.Fragment key={student.id}>
                          <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '12px', fontWeight: 500 }}>{student.name}</td>
                            <td style={{ padding: '12px' }}>{student.sex === 'M' ? 'Garçon' : 'Fille'}</td>
                            <td style={{ padding: '12px', textAlign: 'right' }}>
                              <button 
                                className="btn-outline btn-sm" 
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                onClick={() => {
                                  if (selectedBulletinStudent?.id === student.id && isBulletinModalOpen) {
                                    setSelectedBulletinStudent(null);
                                    setIsBulletinModalOpen(false);
                                  } else {
                                    setSelectedBulletinStudent(student);
                                    setIsBulletinModalOpen(true);
                                  }
                                }}
                              >
                                <FileText size={14} /> {selectedBulletinStudent?.id === student.id && isBulletinModalOpen ? 'Masquer le bulletin' : 'Voir le bulletin'}
                              </button>
                            </td>
                          </tr>
                          {selectedBulletinStudent?.id === student.id && isBulletinModalOpen && (
                            <tr>
                              <td colSpan="3" style={{ padding: 0, background: '#F8FAFC' }}>
                                <BulletinModal 
                                  isOpen={true} 
                                  onClose={() => {
                                    setIsBulletinModalOpen(false);
                                    setSelectedBulletinStudent(null);
                                  }}
                                  student={selectedBulletinStudent}
                                  grades={selectedBulletinStudent ? allGrades[selectedBulletinStudent.id] : null}
                                  bulletinSettings={bulletinSettings}
                                />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentsList;
