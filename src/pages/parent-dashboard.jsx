import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Clock, CheckCircle, AlertCircle, Calendar, X, CreditCard, Smartphone } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { getFamiliesNested, saveFamiliesToSupabase } from '../supabaseService';
const ParentDashboard = () => {
  const navigate = useNavigate();
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatNumber, setChatNumber] = useState(null);
  const [tmoneyNumber, setTmoneyNumber] = useState('');
  const [floozNumber, setFloozNumber] = useState('');
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, method: '', student: null, studentId: null, step: 1, phoneNumber: '', amount: '' });

  useEffect(() => {
    const savedGlobal = localStorage.getItem('eduPayGlobalSettings');
    if (savedGlobal) {
      const settings = JSON.parse(savedGlobal);
      if (settings.chatNumber) {
        setChatNumber(settings.chatNumber);
      }
      if (settings.tmoneyNumber) {
        setTmoneyNumber(settings.tmoneyNumber);
      }
      if (settings.floozNumber) {
        setFloozNumber(settings.floozNumber);
      }
    }
  }, []);

  useEffect(() => {
    const parentId = localStorage.getItem('loggedParentId');
    if (!parentId) {
      navigate('/login/parent');
      return;
    }

    const fetchFamily = async () => {
      const families = await getFamiliesNested();
      const found = families.find(f => f.id === parentId);
      if (found) {
        setFamily(found);
      } else {
        localStorage.removeItem('loggedParentId');
        navigate('/login/parent');
      }
      setLoading(false);
    };
    
    fetchFamily();
  }, [navigate]);

  useEffect(() => {
    if (family) {
      const savedMessages = localStorage.getItem(`eduPayChat_${family.id}`);
      if (savedMessages) {
        setChatMessages(JSON.parse(savedMessages));
      } else {
        setChatMessages([{ sender: 'admin', text: 'Bonjour ! Comment pouvons-nous vous aider aujourd\'hui ?', time: new Date().toISOString() }]);
      }
    }
  }, [family]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = { sender: 'parent', text: chatInput, time: new Date().toISOString() };
    const updatedMessages = [...chatMessages, newMsg];
    setChatMessages(updatedMessages);
    localStorage.setItem(`eduPayChat_${family.id}`, JSON.stringify(updatedMessages));
    
    // Ouvrir WhatsApp avec le message pré-rempli
    if (chatNumber) {
      const cleanNumber = chatNumber.replace(/[^0-9]/g, '');
      const encodedText = encodeURIComponent(newMsg.text);
      window.open(`https://wa.me/${cleanNumber}?text=${encodedText}`, '_blank');
    }
    
    setChatInput('');

    // Message système interne pour expliquer l'action
    setTimeout(() => {
      const botText = "Ouverture de WhatsApp... Veuillez confirmer l'envoi du message sur votre application WhatsApp.";
      const botMsg = { sender: 'admin', text: botText, time: new Date().toISOString() };
      const newMsgsWithBot = [...updatedMessages, botMsg];
      setChatMessages(newMsgsWithBot);
      localStorage.setItem(`eduPayChat_${family.id}`, JSON.stringify(newMsgsWithBot));
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedParentId');
    navigate('/login/parent');
  };

  const calculateDaysRemaining = (deadlineDate) => {
    const today = new Date();
    const deadline = new Date(deadlineDate);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) return null;
  if (!family) return null;

  const processPayment = () => {
    const amountToPay = parseFloat(paymentModal.amount);
    if (!amountToPay || amountToPay <= 0) return;
    
    const saved = localStorage.getItem('eduPayFamilies');
    let families = saved ? JSON.parse(saved) : [];
    let updatedFamily = null;

    families = families.map(f => {
      if (f.id === family.id) {
        const updatedChildren = f.children.map(child => {
          if (child.id === paymentModal.studentId) {
            let remainingPayment = amountToPay;
            const updatedPayments = child.payments.map(payment => {
              if (!payment.isFullyPaid && remainingPayment > 0) {
                const amountNeeded = payment.amountExpected - payment.amountPaid;
                if (remainingPayment >= amountNeeded) {
                  remainingPayment -= amountNeeded;
                  return { ...payment, amountPaid: payment.amountExpected, isFullyPaid: true };
                } else {
                  const newPaid = payment.amountPaid + remainingPayment;
                  remainingPayment = 0;
                  return { ...payment, amountPaid: newPaid, isFullyPaid: newPaid >= payment.amountExpected };
                }
              }
              return payment;
            });
            return { ...child, payments: updatedPayments };
          }
          return child;
        });
        updatedFamily = { ...f, children: updatedChildren };
        return updatedFamily;
      }
      return f;
    });

    if (updatedFamily) {
      saveFamiliesToSupabase([updatedFamily]);
      setFamily(updatedFamily); // Mise à jour de l'affichage local pour voir la barre de progression bouger
    }
  };

  return (
    <div className="dashboard-container" style={{ display: 'block', background: 'var(--bg-app)', minHeight: '100vh' }}>
      <header className="dashboard-header" style={{ padding: '0 24px', background: 'white', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div className="sidebar-logo" style={{ marginBottom: 0, padding: 0 }}>
          <div className="logo-icon" style={{ width: '32px', height: '32px', fontSize: '16px' }}>E</div>
          <h2 style={{ fontSize: '20px' }}>EduPay Parent</h2>
        </div>
        
        <div className="header-actions">
          <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'var(--color-secondary-50)', padding: '8px', borderRadius: '50%', color: 'var(--color-secondary)' }}>
              <User size={20} />
            </div>
            <div className="user-info">
              <span className="name">Famille {family.parentName}</span>
              <span className="role">Espace Parent</span>
            </div>
            <button 
              onClick={handleLogout} 
              className="icon-btn"
              style={{ marginLeft: '12px', color: '#EF4444', background: '#FEF2F2' }}
              title="Se déconnecter"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div className="welcome-section animate-fade-in-up" style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', color: 'var(--text-main)', marginBottom: '8px' }}>Bonjour, {family.parentName} 👋</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Voici le suivi financier pour vos enfants inscrits.</p>
        </div>

        <div className="students-grid stagger-children" style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {family.children.map(student => {
            // Find the next pending payment
            const pendingPayment = student.payments.find(p => !p.isFullyPaid);
            
            return (
              <div key={student.id} className="app-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
                  <div className="avatar-sm" style={{ background: 'var(--color-primary)', width: '48px', height: '48px', fontSize: '20px' }}>
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: 'var(--text-main)' }}>{student.name}</h3>
                    <span className="badge" style={{ background: '#F1F5F9', color: 'var(--text-muted)', fontSize: '13px' }}>Classe : {student.grade}</span>
                  </div>
                </div>

                <div className="tranches-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--text-main)' }}>Détail des tranches</h4>
                  
                  {student.payments.map((payment) => {
                    const isOverdue = new Date(payment.deadline) < new Date() && !payment.isFullyPaid;
                    const progressPercent = Math.round((payment.amountPaid / payment.amountExpected) * 100);
                    const daysRemaining = calculateDaysRemaining(payment.deadline);
                    const isCurrentPending = pendingPayment && pendingPayment.id === payment.id;
                    
                    let bgStatus = 'var(--bg-card)';
                    let borderStatus = 'var(--border-light)';
                    let fillColor = 'var(--color-primary)';
                    
                    if (payment.isFullyPaid) {
                      fillColor = '#10B981';
                    } else if (isOverdue) {
                      fillColor = '#EF4444';
                    } else if (isCurrentPending) {
                      fillColor = progressPercent >= 50 ? '#F59E0B' : '#3B82F6';
                    } else {
                      fillColor = progressPercent >= 50 ? '#F59E0B' : 'var(--color-primary)';
                    }

                    return (
                      <div key={payment.id} style={{ background: bgStatus, border: `1px solid ${borderStatus}`, borderRadius: 'var(--radius-md)', padding: '16px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                           <div>
                             <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>{payment.title}</span>
                             <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                               <Calendar size={12} /> Échéance : {new Date(payment.deadline).toLocaleDateString('fr-FR')}
                             </span>
                           </div>
                           <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{payment.amountExpected.toLocaleString()} FCFA</span>
                        </div>
                        
                        {!payment.isFullyPaid ? (
                          <div className="tranche-progress-section">
                             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', margin: '0 0 6px', color: isOverdue ? '#B91C1C' : 'var(--text-muted)' }}>
                               <span>{progressPercent}% payé</span>
                               <span>Reste { (payment.amountExpected - payment.amountPaid).toLocaleString() } FCFA</span>
                             </div>
                             <div className="progress-bar-bg" style={{ height: '8px', background: isOverdue ? '#FECACA' : (isCurrentPending ? '#DBEAFE' : 'var(--border-light)') }}>
                               <div className="progress-bar-fill" style={{ width: `${progressPercent}%`, background: fillColor, transition: 'width 0.5s ease-in-out, background 0.3s' }}></div>
                             </div>
                             
                             {/* Message dynamique pour la tranche en cours */}
                             {isCurrentPending && (
                               <div style={{ marginTop: '12px', fontSize: '13px', color: isOverdue ? '#EF4444' : '#3B82F6', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500, background: 'rgba(255,255,255,0.5)', padding: '6px 10px', borderRadius: '6px' }}>
                                 {isOverdue ? (
                                   <><AlertCircle size={14} /> En retard de {Math.abs(daysRemaining)} jour(s)</>
                                 ) : (
                                   <><Clock size={14} /> Il vous reste {daysRemaining} jour(s) pour régler</>
                                 )}
                               </div>
                             )}
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '13px', fontWeight: 500, marginTop: '8px' }}>
                            <CheckCircle size={14} /> Totalité réglée
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Section de paiement */}
                <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
                  <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-main)', textAlign: 'center' }}>Régler la scolarité via :</h4>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <button className="payment-btn payment-tmoney" onClick={() => setPaymentModal({ isOpen: true, method: 'Tmoney', student: student.name, studentId: student.id, step: 1, phoneNumber: '', amount: '' })}>
                        Tmoney
                      </button>
                      <button className="payment-btn payment-flooz" onClick={() => setPaymentModal({ isOpen: true, method: 'Flooz', student: student.name, studentId: student.id, step: 1, phoneNumber: '', amount: '' })}>
                        Flooz
                      </button>
                      <button className="payment-btn payment-carte" onClick={() => alert("Ouverture du module Carte Bancaire (Simulation)")}>
                        💳 Carte
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Chat Widget */}
      {chatNumber && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          
          {isChatOpen && (
            <div className="app-card animate-scale-in" style={{ width: '350px', height: '480px', marginBottom: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0, border: '1px solid var(--border-light)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
              
              {/* Header */}
              <div style={{ background: 'var(--color-primary)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', color: 'white' }}>Administration</h3>
                  <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>En ligne</p>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <a 
                    href={`https://wa.me/${chatNumber.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: 'white', display: 'flex', alignItems: 'center', opacity: 0.9, transition: 'opacity 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = 0.9}
                    title="Continuer sur WhatsApp"
                  >
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  </a>
                  <button onClick={() => setIsChatOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '24px', lineHeight: 1 }}>&times;</button>
                </div>
              </div>

              {/* Messages Area */}
              <div style={{ flex: 1, padding: '16px', overflowY: 'auto', background: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {chatMessages.map((msg, idx) => (
                  <div key={idx} style={{ alignSelf: msg.sender === 'parent' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                    <div style={{ background: msg.sender === 'parent' ? 'var(--color-primary)' : 'white', color: msg.sender === 'parent' ? 'white' : 'var(--text-main)', padding: '10px 14px', borderRadius: msg.sender === 'parent' ? '12px 12px 0 12px' : '12px 12px 12px 0', border: msg.sender === 'parent' ? 'none' : '1px solid var(--border-light)', fontSize: '14px', lineHeight: '1.4' }}>
                      {msg.text}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', textAlign: msg.sender === 'parent' ? 'right' : 'left' }}>
                      {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div style={{ padding: '12px', background: 'white', borderTop: '1px solid var(--border-light)' }}>
                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    value={chatInput} 
                    onChange={(e) => setChatInput(e.target.value)} 
                    placeholder="Écrivez un message..." 
                    className="search-input" 
                    style={{ flex: 1, padding: '8px 16px', borderRadius: '24px', outline: 'none' }} 
                  />
                  <button type="submit" style={{ background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  </button>
                </form>
              </div>

            </div>
          )}
          
          {/* Main Floating Button */}
          {!isChatOpen && (
            <button 
              onClick={() => setIsChatOpen(true)}
              style={{
                background: '#25D366',
                color: 'white',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 16px rgba(37, 211, 102, 0.4)',
                zIndex: 1000,
                transition: 'transform 0.2s',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              title="Discuter avec l'administration"
            >
              <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </button>
          )}
        </div>
      )}
      {/* Payment API Modal */}
      {paymentModal.isOpen && (
        <div className="modal-overlay hide-on-print" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="modal-content animate-fade-in-up" style={{ width: '100%', maxWidth: '400px', background: 'white', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            
            {paymentModal.step === 1 && (
              <>
                <div style={{ background: paymentModal.method === 'Tmoney' ? '#FABB18' : '#0066CC', color: paymentModal.method === 'Tmoney' ? '#1A1A1A' : '#FFF', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                  {paymentModal.method === 'Tmoney' ? 'TMZ' : 'FLZ'}
                </div>
                <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>Paiement {paymentModal.method}</h3>
                
                <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px', marginBottom: '24px', border: '1px solid var(--border-light)', textAlign: 'left' }}>
                  <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-muted)' }}>Élève : <strong style={{ color: 'var(--text-main)' }}>{paymentModal.student}</strong></p>
                  <div style={{ borderTop: '1px dashed var(--border-light)', margin: '12px 0' }}></div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: 'var(--text-main)' }}>
                    Votre numéro de paiement {paymentModal.method}
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: 90 00 00 00" 
                    className="search-input" 
                    style={{ width: '100%', padding: '12px' }} 
                    value={paymentModal.phoneNumber}
                    onChange={(e) => setPaymentModal({...paymentModal, phoneNumber: e.target.value})}
                  />
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', marginTop: '16px', color: 'var(--text-main)' }}>
                    Montant à payer (FCFA)
                  </label>
                  <input 
                    type="number" 
                    placeholder="Ex: 50000" 
                    className="search-input" 
                    style={{ width: '100%', padding: '12px' }} 
                    value={paymentModal.amount}
                    onChange={(e) => setPaymentModal({...paymentModal, amount: e.target.value})}
                  />
                  <div style={{ marginTop: '12px', padding: '8px', background: '#E2E8F0', borderRadius: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    Les fonds seront virés vers le compte de l'école (N°: {paymentModal.method === 'Tmoney' ? (tmoneyNumber || 'Non configuré') : (floozNumber || 'Non configuré')}).
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn-outline" style={{ flex: 1, padding: '12px' }} onClick={() => setPaymentModal({ ...paymentModal, isOpen: false })}>Annuler</button>
                  <button 
                    className="btn-primary" 
                    style={{ flex: 1, padding: '12px', background: paymentModal.method === 'Tmoney' ? '#E0A800' : '#004C99', borderColor: 'transparent', color: paymentModal.method === 'Tmoney' ? '#1A1A1A' : '#FFF' }} 
                    onClick={() => { 
                      const targetNumber = paymentModal.method === 'Tmoney' ? tmoneyNumber : floozNumber;
                      if (!targetNumber) {
                        alert("Le directeur n'a pas encore configuré de numéro de réception pour ce moyen de paiement.");
                        return;
                      }
                      if (!paymentModal.phoneNumber || paymentModal.phoneNumber.length < 8) {
                        alert("Veuillez saisir un numéro de téléphone valide.");
                        return;
                      }
                      if (!paymentModal.amount || paymentModal.amount <= 0) {
                        alert("Veuillez saisir un montant valide à payer.");
                        return;
                      }
                      setPaymentModal({ ...paymentModal, step: 2 });
                      
                      // Simulate API delay and update data
                      setTimeout(() => {
                        processPayment();
                        setPaymentModal(prev => prev.isOpen ? { ...prev, step: 3 } : prev);
                      }, 5000);
                    }}
                  >
                    Continuer
                  </button>
                </div>
              </>
            )}

            {paymentModal.step === 2 && (
              <>
                <div style={{ width: '80px', height: '80px', margin: '0 auto 24px', color: 'var(--color-primary)' }}>
                   <Smartphone size={80} style={{ animation: 'pulse 1.5s infinite' }} />
                </div>
                <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>Validation sur votre téléphone</h3>
                <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '24px 16px', marginBottom: '24px', border: '1px solid var(--border-light)' }}>
                   <p style={{ margin: 0, fontSize: '15px', color: 'var(--text-main)', lineHeight: 1.5 }}>
                     Une demande de paiement a été envoyée sur votre téléphone au <strong style={{ letterSpacing: '1px' }}>{paymentModal.phoneNumber}</strong>.<br/><br/>
                     Veuillez renseigner votre <strong>mot de passe {paymentModal.method}</strong> pour valider le virement vers le compte de l'école.
                   </p>
                </div>
                <button className="btn-outline" style={{ width: '100%', padding: '12px' }} onClick={() => setPaymentModal({ ...paymentModal, isOpen: false })}>
                  Annuler la transaction
                </button>
              </>
            )}

            {paymentModal.step === 3 && (
              <>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <CheckCircle size={48} />
                </div>
                <h3 style={{ marginBottom: '16px', fontSize: '22px', color: '#10B981' }}>Paiement réussi !</h3>
                <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '24px 16px', marginBottom: '24px', border: '1px solid var(--border-light)' }}>
                   <p style={{ margin: 0, fontSize: '15px', color: 'var(--text-main)', lineHeight: 1.5 }}>
                     Votre compte {paymentModal.method} a été débité avec succès.<br/><br/>
                     Les fonds ont été transférés sur le compte de l'école. L'écolage de <strong>{paymentModal.student}</strong> est à jour !
                   </p>
                </div>
                <button className="btn-primary" style={{ width: '100%', padding: '12px' }} onClick={() => setPaymentModal({ ...paymentModal, isOpen: false })}>
                  Terminer
                </button>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
