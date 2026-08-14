import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, BookOpen, Users, Calendar, Clock, Edit3, Save } from 'lucide-react';
import { supabase } from '../supabaseClient';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [hours, setHours] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [whatsapp, setWhatsapp] = useState('');
  
  const [activeTab, setActiveTab] = useState('assignments'); // 'assignments' or 'grades'
  
  // Grade entry state
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentsList, setStudentsList] = useState([]);
  const [grades, setGrades] = useState({}); // { studentId: { int, dev, comp } }
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (!savedUser) {
      navigate('/login/teacher');
      return;
    }
    const user = JSON.parse(savedUser);
    if (user.role !== 'teacher') {
      navigate('/login');
      return;
    }
    setCurrentUser(user);

    const fetchTeacher = async () => {
      if (user.id === 'ENS-DEMO') {
        setAssignedClasses(['6ème', '5ème', '4ème']);
        setSubjects(['Mathématiques', 'Physique']);
        setHours(['1ère heure', '2ème heure']);
        setAssignments([
          { class: '6ème', subject: 'Mathématiques', hour: '1ère heure' },
          { class: '5ème', subject: 'Physique', hour: '2ème heure' }
        ]);
        setSelectedClass('6ème');
        setSelectedSubject('Mathématiques');
        return;
      }

      const { data, error } = await supabase.from('teachers').select('*').eq('id', user.id);
      if (data && data.length > 0) {
        const fullTeacher = data[0];
        if (fullTeacher.classes) setAssignedClasses(fullTeacher.classes);
        if (fullTeacher.subjects) setSubjects(fullTeacher.subjects);
        if (fullTeacher.hours) setHours(fullTeacher.hours);
        if (fullTeacher.assignments) setAssignments(fullTeacher.assignments);
        if (fullTeacher.whatsapp) setWhatsapp(fullTeacher.whatsapp);
        
        if (fullTeacher.classes && fullTeacher.classes.length > 0) {
          setSelectedClass(fullTeacher.classes[0]);
        }
        if (fullTeacher.subjects && fullTeacher.subjects.length > 0) {
          setSelectedSubject(fullTeacher.subjects[0] === 'Cours Primaire' ? 'Toutes les matières' : fullTeacher.subjects[0]);
        }
      }
    };
    fetchTeacher();
  }, [navigate]);

  // Load students and grades when class changes
  useEffect(() => {
    if (!selectedClass || !selectedSubject) return;

    const fetchClassStudentsAndGrades = async () => {
      const { data: classStudents } = await supabase.from('students').select('*').eq('grade', selectedClass);
      
      if (classStudents) {
        // Sort students alphabetically
        classStudents.sort((a,b) => a.name.localeCompare(b.name));
        setStudentsList(classStudents);

        const { data: savedGrades } = await supabase.from('grades').select('*').eq('subject', selectedSubject);
        
        let currentGrades = {};
        classStudents.forEach(stu => {
          const studentGrade = savedGrades ? savedGrades.find(g => g.student_id === stu.id) : null;
          if (studentGrade && studentGrade.appreciation) {
            try {
              const parsed = JSON.parse(studentGrade.appreciation);
              currentGrades[stu.id] = { id: studentGrade.id, int: parsed.int || '', dev: parsed.dev || '', comp: parsed.comp || '', coef: parsed.coef || '1', dev1: parsed.dev1 || '', dev2: parsed.dev2 || '', dev3: parsed.dev3 || '' };
            } catch (e) {
              currentGrades[stu.id] = { id: studentGrade.id, int: '', dev: '', comp: '', coef: '1', dev1: '', dev2: '', dev3: '' };
            }
          } else if (studentGrade) {
            currentGrades[stu.id] = { id: studentGrade.id, int: '', dev: '', comp: '', coef: '1', dev1: '', dev2: '', dev3: '' };
          } else {
            currentGrades[stu.id] = { int: '', dev: '', comp: '', coef: '1', dev1: '', dev2: '', dev3: '' };
          }
        });
        setGrades(currentGrades);
      }
    };
    fetchClassStudentsAndGrades();
  }, [selectedClass, selectedSubject]);

  const handleGradeChange = (studentId, type, value) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [type]: value
      }
    }));
  };

  const handleSaveGrades = async () => {
    setSaveMessage('');
    for (const stu of studentsList) {
      const g = grades[stu.id];
      const payload = {
        student_id: stu.id,
        subject: selectedSubject,
        appreciation: JSON.stringify({
          int: g?.int || '',
          dev: g?.dev || '',
          comp: g?.comp || '',
          coef: g?.coef || '1',
          dev1: g?.dev1 || '',
          dev2: g?.dev2 || '',
          dev3: g?.dev3 || ''
        })
      };

      if (g && g.id) {
        payload.id = g.id;
        await supabase.from('grades').update(payload).eq('id', g.id);
      } else {
        const { data } = await supabase.from('grades').insert([payload]).select();
        if (data && data.length > 0) {
          grades[stu.id].id = data[0].id;
        }
      }
    }
    
    setSaveMessage('Notes enregistrées avec succès !');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const isCollege = (grade) => {
    if (!grade) return false;
    const g = grade.toLowerCase();
    return g.includes("6ème") || g.includes("5ème") || g.includes("4ème") || g.includes("3ème") || g.includes("6e") || g.includes("5e") || g.includes("4e") || g.includes("3e");
  };
  const isCollegeClass = isCollege(selectedClass);

  if (!currentUser) return null;

  return (
    <div className="dashboard-container" style={{ background: 'var(--bg-app)', minHeight: '100vh' }}>
      <main className="dashboard-main" style={{ marginLeft: 0 }}>
        <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', padding: '0 40px', background: 'white', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#EFF6FF', color: '#3B82F6', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={20} />
            </div>
            <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--text-main)' }}>Espace Enseignant</h2>
          </div>
          
          <div className="header-actions">
            <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'E'}
              </div>
              <div className="user-info" style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="name" style={{ fontWeight: 600 }}>{currentUser.name || 'Enseignant'}</span>
                <span className="role" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: {currentUser.id}</span>
                {whatsapp && (
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    {whatsapp}
                  </span>
                )}
              </div>
            </div>
            <button 
              className="btn-outline" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', color: '#EF4444', borderColor: '#FEE2E2', background: '#FEF2F2' }}
              onClick={() => {
                localStorage.removeItem('currentUser');
                navigate('/login');
              }}
            >
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </header>

        <div className="dashboard-content" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Navigation interne */}
          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-light)', marginBottom: '32px' }}>
            <button 
              onClick={() => setActiveTab('assignments')}
              style={{ 
                padding: '12px 24px', 
                background: 'none', 
                border: 'none', 
                borderBottom: activeTab === 'assignments' ? '2px solid var(--color-primary)' : '2px solid transparent',
                color: activeTab === 'assignments' ? 'var(--color-primary)' : 'var(--text-muted)',
                fontWeight: activeTab === 'assignments' ? 600 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <BookOpen size={18} /> Mes Affectations
            </button>
            <button 
              onClick={() => setActiveTab('grades')}
              style={{ 
                padding: '12px 24px', 
                background: 'none', 
                border: 'none', 
                borderBottom: activeTab === 'grades' ? '2px solid var(--color-primary)' : '2px solid transparent',
                color: activeTab === 'grades' ? 'var(--color-primary)' : 'var(--text-muted)',
                fontWeight: activeTab === 'grades' ? 600 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Edit3 size={18} /> Saisie des notes
            </button>
          </div>

          {activeTab === 'assignments' && (
            <div className="animate-fade-in-up">
              <div className="welcome-section" style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px' }}>Vos classes et horaires</h1>
                <p style={{ color: 'var(--text-muted)' }}>Consultez la liste des classes qui vous sont assignées cette année.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }} className="stagger-children">
                {assignments.length > 0 ? (
                  assignments.map((assignment, idx) => (
                    <div key={idx} className="app-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)', padding: '12px', borderRadius: '12px' }}>
                            <BookOpen size={24} />
                          </div>
                          <div>
                            <h3 style={{ margin: 0, fontSize: '18px' }}>Classe : {assignment.class}</h3>
                            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Matière : {assignment.subject}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', gap: '16px', flexDirection: 'column' }}>
                         <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>
                            <Clock size={14} style={{ marginTop: '2px' }} /> 
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              <span style={{ background: '#FEF3C7', color: '#B45309', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>{assignment.hour}</span>
                            </div>
                         </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="app-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 24px', background: '#F8FAFC' }}>
                    <div style={{ color: '#94A3B8', marginBottom: '16px' }}>
                      <BookOpen size={48} style={{ margin: '0 auto' }} />
                    </div>
                    <h3 style={{ marginBottom: '8px' }}>Aucune classe assignée</h3>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
                      Vous n'avez pas encore de classes assignées pour cette année scolaire. Veuillez contacter la direction.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'grades' && (
            <div className="animate-fade-in-up">
              <div className="welcome-section" style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px' }}>Saisie des notes</h1>
                <p style={{ color: 'var(--text-muted)' }}>Saisissez les notes de vos élèves. Elles seront automatiquement intégrées dans leur bulletin.</p>
              </div>

              <div className="app-card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>Classe</label>
                    <select className="search-input" value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setSelectedStudentId(''); }} style={{ width: '100%', padding: '10px' }}>
                      <option value="">Sélectionner une classe...</option>
                      {assignedClasses.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>Matière</label>
                    <select className="search-input" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} style={{ width: '100%', padding: '10px' }}>
                      <option value="">Sélectionner une matière...</option>
                      {subjects.map(s => <option key={s} value={s === 'Cours Primaire' ? 'Toutes les matières' : s}>{s === 'Cours Primaire' ? 'Toutes les matières' : s}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>Élève</label>
                    <select className="search-input" value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} style={{ width: '100%', padding: '10px' }} disabled={!selectedClass || studentsList.length === 0}>
                      <option value="">Sélectionner un élève...</option>
                      {studentsList.map(stu => <option key={stu.id} value={stu.id}>{stu.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {selectedClass && selectedSubject && selectedStudentId ? (
                <div className="app-card animate-fade-in-up">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>Saisie pour : {studentsList.find(s => s.id === selectedStudentId)?.name}</h3>
                  </div>
                  
                  {saveMessage && (
                    <div style={{ padding: '12px', background: '#ECFDF5', color: '#059669', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>
                      {saveMessage}
                    </div>
                  )}
                  <div className="form-grid">
                    <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                      <label className="form-label">Coefficient de la matière</label>
                      <input 
                        type="number" min="1" step="1" className="search-input" 
                        value={grades[selectedStudentId]?.coef || '1'}
                        onChange={(e) => handleGradeChange(selectedStudentId, 'coef', e.target.value)}
                      />
                    </div>
                    
                    {!isCollegeClass ? (
                      <>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Note d'interrogation (/20)</label>
                          <input 
                            type="number" max="20" min="0" step="0.25" className="search-input" 
                            value={grades[selectedStudentId]?.int || ''}
                            onChange={(e) => handleGradeChange(selectedStudentId, 'int', e.target.value)}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Note de devoir (/20)</label>
                          <input 
                            type="number" max="20" min="0" step="0.25" className="search-input" 
                            value={grades[selectedStudentId]?.dev || ''}
                            onChange={(e) => handleGradeChange(selectedStudentId, 'dev', e.target.value)}
                          />
                        </div>
                        
                        <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                          <label className="form-label">Moyenne de classe (Calculée automatiquement)</label>
                          <input 
                            type="text" disabled className="search-input" style={{ background: '#F8FAFC', fontWeight: 'bold' }}
                            value={
                              (() => {
                                const int = grades[selectedStudentId]?.int ? parseFloat(grades[selectedStudentId].int) : null;
                                const dev = grades[selectedStudentId]?.dev ? parseFloat(grades[selectedStudentId].dev) : null;
                                if (int !== null && dev !== null) return ((int + dev) / 2).toFixed(2);
                                if (int !== null) return int.toFixed(2);
                                if (dev !== null) return dev.toFixed(2);
                                return '';
                              })()
                            }
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Devoir 1 (/20)</label>
                          <input 
                            type="number" max="20" min="0" step="0.25" className="search-input" 
                            value={grades[selectedStudentId]?.dev1 || ''}
                            onChange={(e) => handleGradeChange(selectedStudentId, 'dev1', e.target.value)}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Devoir 2 (/20)</label>
                          <input 
                            type="number" max="20" min="0" step="0.25" className="search-input" 
                            value={grades[selectedStudentId]?.dev2 || ''}
                            onChange={(e) => handleGradeChange(selectedStudentId, 'dev2', e.target.value)}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Devoir 3 (/20)</label>
                          <input 
                            type="number" max="20" min="0" step="0.25" className="search-input" 
                            value={grades[selectedStudentId]?.dev3 || ''}
                            onChange={(e) => handleGradeChange(selectedStudentId, 'dev3', e.target.value)}
                          />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                          <label className="form-label">Moyenne de devoirs (Calculée automatiquement)</label>
                          <input 
                            type="text" disabled className="search-input" style={{ background: '#F8FAFC', fontWeight: 'bold' }}
                            value={
                              (() => {
                                const d1 = grades[selectedStudentId]?.dev1 ? parseFloat(grades[selectedStudentId].dev1) : null;
                                const d2 = grades[selectedStudentId]?.dev2 ? parseFloat(grades[selectedStudentId].dev2) : null;
                                const d3 = grades[selectedStudentId]?.dev3 ? parseFloat(grades[selectedStudentId].dev3) : null;
                                const validDevs = [d1, d2, d3].filter(d => d !== null);
                                if (validDevs.length > 0) {
                                  return (validDevs.reduce((a, b) => a + b, 0) / validDevs.length).toFixed(2);
                                }
                                return '';
                              })()
                            }
                          />
                        </div>
                      </>
                    )}

                    <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                      <label className="form-label">Note de composition (/20)</label>
                      <input 
                        type="number" max="20" min="0" step="0.25" className="search-input" 
                        value={grades[selectedStudentId]?.comp || ''}
                        onChange={(e) => handleGradeChange(selectedStudentId, 'comp', e.target.value)}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                      <label className="form-label">Moyenne générale (Calculée automatiquement)</label>
                      <input 
                        type="text" disabled className="search-input" style={{ background: '#F8FAFC', fontWeight: 'bold', color: 'var(--color-primary)' }}
                        value={
                          (() => {
                            const comp = grades[selectedStudentId]?.comp ? parseFloat(grades[selectedStudentId].comp) : null;
                            let moyClasse = null;

                            if (!isCollegeClass) {
                              const int = grades[selectedStudentId]?.int ? parseFloat(grades[selectedStudentId].int) : null;
                              const dev = grades[selectedStudentId]?.dev ? parseFloat(grades[selectedStudentId].dev) : null;
                              if (int !== null && dev !== null) moyClasse = (int + dev) / 2;
                              else if (int !== null) moyClasse = int;
                              else if (dev !== null) moyClasse = dev;
                            } else {
                              const d1 = grades[selectedStudentId]?.dev1 ? parseFloat(grades[selectedStudentId].dev1) : null;
                              const d2 = grades[selectedStudentId]?.dev2 ? parseFloat(grades[selectedStudentId].dev2) : null;
                              const d3 = grades[selectedStudentId]?.dev3 ? parseFloat(grades[selectedStudentId].dev3) : null;
                              const validDevs = [d1, d2, d3].filter(d => d !== null);
                              if (validDevs.length > 0) moyClasse = validDevs.reduce((a, b) => a + b, 0) / validDevs.length;
                            }
                            
                            if (moyClasse !== null && comp !== null) return ((moyClasse + comp) / 2).toFixed(2);
                            if (moyClasse !== null) return moyClasse.toFixed(2);
                            if (comp !== null) return comp.toFixed(2);
                            return '';
                          })()
                        }
                      />
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '32px', textAlign: 'right' }}>
                    <button className="btn-primary" onClick={handleSaveGrades} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
                      <Save size={18} /> Enregistrer les notes
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed var(--border-light)' }}>
                  Veuillez sélectionner une classe, une matière et un élève pour commencer la saisie.
                </div>
              )}

              {selectedClass && selectedSubject && studentsList.length > 0 && (
                <div className="app-card animate-fade-in-up" style={{ marginTop: '24px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>Récapitulatif des notes ({selectedSubject})</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                          <th style={{ padding: '12px', fontWeight: 600, color: '#475569' }}>Élève</th>
                          {!isCollegeClass ? (
                            <>
                              <th style={{ padding: '12px', fontWeight: 600, color: '#475569' }}>Int.</th>
                              <th style={{ padding: '12px', fontWeight: 600, color: '#475569' }}>Dev.</th>
                            </>
                          ) : (
                            <>
                              <th style={{ padding: '12px', fontWeight: 600, color: '#475569' }}>Dev. 1</th>
                              <th style={{ padding: '12px', fontWeight: 600, color: '#475569' }}>Dev. 2</th>
                              <th style={{ padding: '12px', fontWeight: 600, color: '#475569' }}>Dev. 3</th>
                            </>
                          )}
                          <th style={{ padding: '12px', fontWeight: 600, color: '#475569' }}>Comp.</th>
                          <th style={{ padding: '12px', fontWeight: 600, color: '#475569', textAlign: 'center' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentsList.map((stu) => (
                          <tr key={stu.id} style={{ borderBottom: '1px solid #E2E8F0', background: selectedStudentId === stu.id ? '#EFF6FF' : 'white' }}>
                            <td style={{ padding: '12px', fontWeight: 500 }}>{stu.name}</td>
                            {!isCollegeClass ? (
                              <>
                                <td style={{ padding: '12px' }}>{grades[stu.id]?.int || '-'}</td>
                                <td style={{ padding: '12px' }}>{grades[stu.id]?.dev || '-'}</td>
                              </>
                            ) : (
                              <>
                                <td style={{ padding: '12px' }}>{grades[stu.id]?.dev1 || '-'}</td>
                                <td style={{ padding: '12px' }}>{grades[stu.id]?.dev2 || '-'}</td>
                                <td style={{ padding: '12px' }}>{grades[stu.id]?.dev3 || '-'}</td>
                              </>
                            )}
                            <td style={{ padding: '12px' }}>{grades[stu.id]?.comp || '-'}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                              <button 
                                className="btn-outline btn-sm" 
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '4px 8px', borderColor: 'var(--border-light)' }}
                                onClick={() => {
                                  setSelectedStudentId(stu.id);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                              >
                                <Edit3 size={14} /> Éditer
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
