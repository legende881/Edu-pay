import React, { useState, useMemo } from 'react';
import { DollarSign, Search, Filter, ArrowUpRight, ArrowDownRight, AlertCircle, CheckCircle, Clock, Activity, X, User } from 'lucide-react';
import { getStudentTransactions } from '../supabaseService';

const PaymentsView = ({ currentFamilies }) => {
  const [filter, setFilter] = useState('tous'); // 'tous', 'soldes', 'partiels', 'impayes'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentTransactions, setStudentTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    const fetchAllTx = async () => {
      const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: false });
      if (data) setAllTransactions(data);
    };
    fetchAllTx();
  }, []);

  const handleOpenDetails = async (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
    setStudentTransactions([]);
    const txns = await getStudentTransactions(student.id);
    setStudentTransactions(txns);
  };

  // Traiter et aplatir toutes les données de paiement des élèves
  const allStudents = useMemo(() => {
    let studentsList = [];
    if (!currentFamilies) return studentsList;

    currentFamilies.forEach(family => {
      if (family.children) {
        family.children.forEach(child => {
          let totalScolarite = 50000; // Fake base if not specified
          // En vrai, dépend du plan ou de la classe. Simuler pour le démo:
          if (child.grade.includes('Terminal')) totalScolarite = 75000;
          if (child.grade.includes('1ere')) totalScolarite = 65000;

          // Compute total paid from payments array
          let amountPaid = 0;
          if (child.payments) {
            amountPaid = child.payments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
          }

          let amountDue = totalScolarite - amountPaid;
          if (amountDue < 0) amountDue = 0; // Au cas où

          let status = 'impayes';
          if (amountPaid >= totalScolarite) status = 'soldes';
          else if (amountPaid > 0) status = 'partiels';

          let lastRecordedBy = '-';
          if (allTransactions.length > 0) {
            const studentTx = allTransactions.find(t => t.student_id === child.id);
            if (studentTx) lastRecordedBy = studentTx.recorded_by || 'Système';
          }

          studentsList.push({
            id: child.id,
            name: child.name,
            grade: child.grade,
            parentName: family.parentName || 'Parent',
            phone: family.parentDirectCall || family.parentWhatsapp || 'Non renseigné',
            totalScolarite,
            amountPaid,
            amountDue,
            status,
            lastRecordedBy
          });
        });
      }
    });
    return studentsList;
  }, [currentFamilies, allTransactions]);

  // Compute KPIs
  const kpis = useMemo(() => {
    const totalExpected = allStudents.reduce((sum, s) => sum + s.totalScolarite, 0);
    const totalCollected = allStudents.reduce((sum, s) => sum + s.amountPaid, 0);
    const totalPending = totalExpected - totalCollected;
    const collectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;
    
    return { totalExpected, totalCollected, totalPending, collectionRate };
  }, [allStudents]);

  // Filtering & Searching
  const filteredStudents = useMemo(() => {
    return allStudents.filter(student => {
      const matchesFilter = filter === 'tous' || student.status === filter;
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            student.parentName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [allStudents, filter, searchQuery]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'soldes': return <span className="badge badge-success"><CheckCircle size={12} style={{marginRight: '4px'}}/> Soldé</span>;
      case 'partiels': return <span className="badge badge-warning"><Clock size={12} style={{marginRight: '4px'}}/> Partiel</span>;
      case 'impayes': return <span className="badge" style={{ background: '#FEE2E2', color: '#DC2626' }}><AlertCircle size={12} style={{marginRight: '4px'}}/> Impayé</span>;
      default: return null;
    }
  };

  return (
    <div className="payments-view animate-fade-in-up">
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>Gestion des Paiements</h2>
          <p style={{ color: 'var(--text-muted)' }}>Suivez en temps réel l'état des recouvrements scolaires</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="secondary-grid stagger-children" style={{ marginBottom: '32px' }}>
        <div className="app-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)', padding: '12px', borderRadius: '12px' }}>
              <DollarSign size={24} />
            </div>
            <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowUpRight size={14} /> Actif
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Total Recouvré</p>
          <h3 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-main)' }}>{formatCurrency(kpis.totalCollected)}</h3>
        </div>

        <div className="app-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ background: '#FEF3C7', color: '#D97706', padding: '12px', borderRadius: '12px' }}>
              <AlertCircle size={24} />
            </div>
            <span className="badge" style={{ background: '#F3F4F6', color: 'var(--text-muted)' }}>
              Attente
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Reste à Recouvrer</p>
          <h3 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-main)' }}>{formatCurrency(kpis.totalPending)}</h3>
        </div>

        <div className="app-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ background: '#E0E7FF', color: '#4F46E5', padding: '12px', borderRadius: '12px' }}>
              <Activity size={24} />
            </div>
            <div className="progress-ring-container" style={{ width: '40px', height: '40px', position: 'relative' }}>
               <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeDasharray={`${kpis.collectionRate}, 100`} />
               </svg>
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Taux de Recouvrement</p>
          <h3 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-main)' }}>{kpis.collectionRate}%</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Sur un total attendu de {formatCurrency(kpis.totalExpected)}</p>
        </div>
      </div>

      <div className="app-card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
          <div className="tabs" style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
            <button className={`btn ${filter === 'tous' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('tous')}>Tous ({allStudents.length})</button>
            <button className={`btn ${filter === 'soldes' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('soldes')}>Soldés</button>
            <button className={`btn ${filter === 'partiels' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('partiels')}>Partiels</button>
            <button className={`btn ${filter === 'impayes' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('impayes')}>Impayés</button>
          </div>

          <div className="search-input-wrapper" style={{ minWidth: '300px' }}>
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Rechercher un élève ou parent..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="table-wrapper">
          <table className="modern-table">
            <thead style={{ background: '#F8FAFC' }}>
              <tr>
                <th style={{ paddingLeft: '24px' }}>Élève</th>
                <th>Classe</th>
                <th>Parent & Contact</th>
                <th style={{ textAlign: 'right' }}>Scolarité</th>
                <th style={{ textAlign: 'right' }}>Payé</th>
                <th style={{ textAlign: 'right' }}>Reste</th>
                <th style={{ textAlign: 'center' }}>Statut</th>
                <th style={{ textAlign: 'right' }}>Enregistré par</th>
                <th style={{ textAlign: 'right', paddingRight: '24px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <tr key={student.id}>
                    <td style={{ paddingLeft: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="avatar-sm" style={{ background: 'var(--color-primary)' }}>
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{student.name}</span>
                      </div>
                    </td>
                    <td><span style={{ background: '#F1F5F9', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>{student.grade}</span></td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 500 }}>{student.parentName}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{student.phone}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>{formatCurrency(student.totalScolarite)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--color-primary-dark)' }}>{formatCurrency(student.amountPaid)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: student.amountDue > 0 ? '#D97706' : 'var(--text-muted)' }}>{formatCurrency(student.amountDue)}</td>
                    <td style={{ textAlign: 'center' }}>{getStatusBadge(student.status)}</td>
                    <td style={{ textAlign: 'right', fontSize: '13px', color: 'var(--text-muted)' }}>
                       {student.lastRecordedBy !== '-' && <User size={12} style={{marginRight: '4px', verticalAlign: 'middle'}}/>}
                       {student.lastRecordedBy}
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                      <button 
                        className="btn-outline btn-sm" 
                        style={{ padding: '6px 12px' }}
                        onClick={() => handleOpenDetails(student)}
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <AlertCircle size={32} color="#CBD5E1" />
                      <p>Aucun paiement trouvé correspondant à vos critères.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in-up" style={{ maxWidth: '600px', width: '100%', padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)' }}>Détails du paiement</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 250px', padding: '16px', background: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-muted)' }}>Informations Élève</h4>
                  <p style={{ margin: '0 0 4px 0', fontWeight: 600 }}>{selectedStudent.name}</p>
                  <p style={{ margin: 0, fontSize: '13px' }}>Classe: {selectedStudent.grade}</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>Parent: {selectedStudent.parentName} <br/>({selectedStudent.phone})</p>
                </div>
                <div style={{ flex: '1 1 250px', padding: '16px', background: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-muted)' }}>État Financier</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px' }}>Scolarité totale:</span>
                    <span style={{ fontWeight: 500 }}>{formatCurrency(selectedStudent.totalScolarite)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--color-primary-dark)' }}>Montant payé:</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>{formatCurrency(selectedStudent.amountPaid)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: selectedStudent.amountDue > 0 ? '#D97706' : 'var(--text-muted)' }}>Reste à payer:</span>
                    <span style={{ fontWeight: 600, color: selectedStudent.amountDue > 0 ? '#D97706' : 'var(--text-muted)' }}>{formatCurrency(selectedStudent.amountDue)}</span>
                  </div>
                  {getStatusBadge(selectedStudent.status)}
                </div>
              </div>

              <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: 'var(--text-main)', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                Historique des transactions
              </h4>
              
              {studentTransactions.length > 0 ? (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
                        <th style={{ padding: '8px 4px' }}>Date</th>
                        <th style={{ padding: '8px 4px', textAlign: 'right' }}>Montant</th>
                        <th style={{ padding: '8px 4px', textAlign: 'right' }}>Enregistré par</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentTransactions.map(txn => (
                        <tr key={txn.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                          <td style={{ padding: '12px 4px' }}>{new Date(txn.date || txn.created_at).toLocaleString('fr-FR')}</td>
                          <td style={{ padding: '12px 4px', fontWeight: 600, textAlign: 'right', color: 'var(--color-primary-dark)' }}>{formatCurrency(txn.amount)}</td>
                          <td style={{ padding: '12px 4px', color: 'var(--text-muted)', textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                              {txn.recorded_by || 'Système / Inconnu'}
                              <User size={14} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>Aucune transaction enregistrée.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsView;
