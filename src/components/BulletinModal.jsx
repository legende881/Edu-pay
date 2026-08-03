import React, { useState, useEffect } from 'react';
import { X, Printer } from 'lucide-react';

const BulletinModal = ({ isOpen, onClose, student, grades, bulletinSettings }) => {
  if (!isOpen || !student) return null;

  // Retrieve global settings for subjects
  const scientificSubjectsStr = bulletinSettings?.scientificSubjects || 'Mathématiques, Physique-Chimie, SVT';
  const literarySubjectsStr = bulletinSettings?.literarySubjects || 'Philosophie, Anglais, Français, Histoire-Géo, ECM, Allemand, Espagnol';
  const optionalSubjectsStr = bulletinSettings?.optionalSubjects || 'EPS';

  const parseSubjects = (str) => str.split(',').map(s => s.trim()).filter(Boolean);
  
  const scientificSubjects = parseSubjects(scientificSubjectsStr);
  const literarySubjects = parseSubjects(literarySubjectsStr);
  const optionalSubjects = parseSubjects(optionalSubjectsStr);

  const [localGrades, setLocalGrades] = useState({});

  useEffect(() => {
    // initialize local editable grades from the passed grades
    setLocalGrades(grades || {});
  }, [grades]);

  const handleLocalGradeChange = (subject, type, value) => {
    setLocalGrades(prev => ({
      ...prev,
      [subject]: {
        ...(prev[subject] || { int: '', dev: '', comp: '' }),
        [type]: value
      }
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    const element = document.getElementById('bulletin-pdf-content');
    const opt = {
      margin:       0,
      filename:     `Bulletin_${student.name.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { 
        scale: 2, 
        useCORS: true,
        ignoreElements: (el) => el.classList && el.classList.contains('hide-on-print')
      },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    // Importer dynamiquement pour éviter les problèmes SSR si applicable
    import('html2pdf.js').then((html2pdf) => {
      html2pdf.default().set(opt).from(element).save();
    });
  };

  const calculateRowStats = (subjGrades) => {
    if (!subjGrades) return { int: '', dev: '', comp: '', moy: '', coef: 1, moyCoef: '' };
    const int = parseFloat(subjGrades.int) || 0;
    const dev = parseFloat(subjGrades.dev) || 0;
    const comp = parseFloat(subjGrades.comp) || 0;
    
    // Simplification for the prototype: (Int + Dev + Comp) / 3 if all exist
    let total = 0, count = 0;
    if (subjGrades.int) { total += int; count++; }
    if (subjGrades.dev) { total += dev; count++; }
    if (subjGrades.comp) { total += comp; count++; }
    
    const moy = count > 0 ? (total / count) : 0;
    const coef = subjGrades.coef ? parseFloat(subjGrades.coef) : 1;
    const moyCoef = moy * coef;

    return {
      int: subjGrades.int || '',
      dev: subjGrades.dev || '',
      comp: subjGrades.comp || '',
      moy: count > 0 ? moy.toFixed(2) : '',
      coef: coef,
      moyCoef: count > 0 ? moyCoef.toFixed(2) : ''
    };
  };

  const renderSubjectRow = (subject) => {
    const stats = calculateRowStats(localGrades[subject]);
    return (
      <tr key={subject} style={{ borderBottom: '1px solid #000' }}>
        <td style={{ borderRight: '1px solid #000', padding: '4px', fontSize: '11px', fontWeight: 'bold' }}>{subject}</td>
        <td style={{ borderRight: '1px solid #000', padding: '2px' }}>
          <input className="print-input" type="text" value={stats.int} onChange={e => handleLocalGradeChange(subject, 'int', e.target.value)} />
        </td>
        <td style={{ borderRight: '1px solid #000', padding: '2px' }}>
          <input className="print-input" type="text" value={stats.dev} onChange={e => handleLocalGradeChange(subject, 'dev', e.target.value)} />
        </td>
        <td style={{ borderRight: '1px solid #000', padding: '2px', background: '#f5f5f5' }}>{stats.moy}</td>
        <td style={{ borderRight: '1px solid #000', padding: '2px' }}>
          <input className="print-input" type="text" value={stats.comp} onChange={e => handleLocalGradeChange(subject, 'comp', e.target.value)} />
        </td>
        <td style={{ borderRight: '1px solid #000', padding: '4px', textAlign: 'center', fontWeight: 'bold', background: '#e0e0e0' }}>{stats.moy}</td>
        <td style={{ borderRight: '1px solid #000', padding: '4px', textAlign: 'center' }}>{stats.coef}</td>
        <td style={{ borderRight: '1px solid #000', padding: '4px', textAlign: 'center', fontWeight: 'bold', background: '#e0e0e0' }}>{stats.moyCoef}</td>
        <td style={{ borderRight: '1px solid #000', padding: '4px', textAlign: 'center' }}></td>
        <td style={{ borderRight: '1px solid #000', padding: '4px', fontSize: '10px' }}></td>
        <td style={{ borderRight: '1px solid #000', padding: '4px', fontSize: '10px' }}></td>
        <td style={{ padding: '4px', fontSize: '10px' }}></td>
      </tr>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="bulletin-inline-wrapper hide-on-print" style={{ width: '100%', overflowX: 'auto', padding: '20px 0', display: 'flex', justifyContent: 'center' }}>
      
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .bulletin-print-container, .bulletin-print-container * {
              visibility: visible;
            }
            .bulletin-print-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 297mm;
              height: 210mm;
              margin: 0;
              padding: 0 !important;
            }
            .print-input {
              border: none !important;
              background: transparent !important;
              text-align: center;
              font-family: inherit;
              font-size: inherit;
              width: 100%;
            }
            .hide-on-print {
              display: none !important;
            }
          }
          .print-input {
            width: 100%;
            border: 1px dashed #ccc;
            background: transparent;
            text-align: center;
            font-size: 11px;
            padding: 2px 0;
          }
          .print-input:focus {
            outline: none;
            border-bottom: 1px solid blue;
          }
        `}
      </style>

      <div id="bulletin-pdf-content" className="bulletin-print-container" style={{ background: '#fff', width: '297mm', minHeight: '210mm', padding: '20px', margin: '0 auto', position: 'relative', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
        
        <div className="hide-on-print" style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '10px' }}>
          <button onClick={handleExportPDF} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#059669', borderColor: '#059669' }}>
             Télécharger PDF
          </button>
          <button onClick={handlePrint} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
            <Printer size={16} /> Imprimer
          </button>
          <button onClick={onClose} style={{ background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* En-tête (4 colonnes) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '10px' }}>
          
          {/* Colonne 1: Ministère */}
          <div style={{ textAlign: 'center', width: '25%', fontSize: '11px', fontWeight: 'bold' }}>
            {bulletinSettings?.leftHeader ? (
              bulletinSettings.leftHeader.split('\n').map((line, idx) => (
                <p key={idx} style={{ margin: 0 }}>{line}</p>
              ))
            ) : (
              <>
                <p style={{ margin: 0 }}>MINISTERE DE L'EDUCATION NATIONALE</p>
                <p style={{ margin: 0 }}>-----------------</p>
                <p style={{ margin: 0 }}>DIRECTION REGIONALE DE L'EDUCATION</p>
                <p style={{ margin: 0 }}>-----------------</p>
                <p style={{ margin: 0 }}>INSPECTION DE L'ENSEIGNEMENT SECONDAIRE</p>
                <p style={{ margin: 0 }}>-----------------</p>
                <p style={{ margin: 0 }}>GENERAL ADJOINTIVE</p>
              </>
            )}
            
            <div style={{ marginTop: '20px', border: '1px solid #000', padding: '5px', textAlign: 'left' }}>
              NOM & PRENOM(S) : <strong>{student.name}</strong>
            </div>
          </div>
          
          {/* Colonne 2: Logo */}
          <div style={{ textAlign: 'center', width: '15%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '10px' }}>
             {bulletinSettings?.logoUrl ? (
                <img src={bulletinSettings.logoUrl} alt="Logo" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
             ) : (
                <div style={{ width: '60px', height: '60px', border: '1px solid #000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>LOGO</div>
             )}
          </div>

          {/* Colonne 3: République */}
          <div style={{ textAlign: 'center', width: '35%', fontSize: '12px', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ margin: 0 }}>REPUBLIQUE TOGOLAISE</p>
            <p style={{ margin: '0 0 2px 0', fontSize: '10px', fontStyle: 'italic', fontWeight: 'normal' }}>{bulletinSettings?.motto || 'Travail-Liberté-Patrie'}</p>
            {bulletinSettings?.phoneNumber && (
              <p style={{ margin: '0 0 10px 0', fontSize: '10px', fontWeight: 'normal' }}>Tel: {bulletinSettings.phoneNumber}</p>
            )}
            <p style={{ margin: 0, fontSize: '16px' }}>{bulletinSettings?.schoolName || 'LYCEE LEGBASSITO'}</p>
            <p style={{ margin: '5px 0', fontSize: '14px', border: '1px solid #000', padding: '4px' }}>BULLETIN DU PREMIER SEMESTRE</p>
            <p style={{ margin: 0 }}>AN. ACAD: {bulletinSettings?.academicYear || '2025-2026'}</p>
          </div>

          {/* Colonne 4: Tableau Effectif */}
          <div style={{ width: '25%', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
            <table style={{ borderCollapse: 'collapse', border: '1px solid #000', fontSize: '11px', fontWeight: 'bold', width: '100%' }}>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '4px' }}>Classe: {student.grade}</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '4px' }}>
                    Eff: <input type="text" className="print-input" style={{ width: '30px', fontWeight: 'bold', display: 'inline-block' }} />
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '4px' }}>
                    Aband: <input type="text" className="print-input" style={{ width: '30px', fontWeight: 'bold', display: 'inline-block' }} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        {/* Tableau */}
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #000', fontSize: '11px', textAlign: 'center' }}>
          <thead>
            <tr style={{ background: '#e0e0e0', borderBottom: '2px solid #000' }}>
              <th rowSpan="2" style={{ borderRight: '1px solid #000', width: '15%' }}>MATIERES</th>
              <th colSpan="3" style={{ borderRight: '1px solid #000' }}>Notes de classe</th>
              <th rowSpan="2" style={{ borderRight: '1px solid #000', width: '6%' }}>Comp.</th>
              <th rowSpan="2" style={{ borderRight: '1px solid #000', width: '6%' }}>Moy General</th>
              <th rowSpan="2" style={{ borderRight: '1px solid #000', width: '5%' }}>Coef</th>
              <th rowSpan="2" style={{ borderRight: '1px solid #000', width: '6%' }}>Moy coef</th>
              <th rowSpan="2" style={{ borderRight: '1px solid #000', width: '5%' }}>Rang</th>
              <th rowSpan="2" style={{ borderRight: '1px solid #000', width: '15%' }}>Appréciations</th>
              <th rowSpan="2" style={{ borderRight: '1px solid #000', width: '15%' }}>Professeurs</th>
              <th rowSpan="2" style={{ width: '10%' }}>Signature</th>
            </tr>
            <tr style={{ background: '#e0e0e0', borderBottom: '2px solid #000' }}>
              <th style={{ borderRight: '1px solid #000', width: '5%', borderTop: '1px solid #000' }}>Int</th>
              <th style={{ borderRight: '1px solid #000', width: '5%', borderTop: '1px solid #000' }}>Dev.</th>
              <th style={{ borderRight: '1px solid #000', width: '5%', borderTop: '1px solid #000' }}>Moy. Classe</th>
            </tr>
          </thead>
          <tbody>
            {/* Matières Scientifiques */}
            {scientificSubjects.length > 0 && (
              <tr>
                <td colSpan="12" style={{ textAlign: 'left', fontWeight: 'bold', background: '#f5f5f5', borderBottom: '1px solid #000', padding: '4px' }}>
                  MATIERES SCIENTIFIQUES
                </td>
              </tr>
            )}
            {scientificSubjects.map(subj => renderSubjectRow(subj))}

            {/* Matières Littéraires */}
            {literarySubjects.length > 0 && (
              <tr>
                <td colSpan="12" style={{ textAlign: 'left', fontWeight: 'bold', background: '#f5f5f5', borderBottom: '1px solid #000', padding: '4px' }}>
                  MATIERES LITTERAIRES
                </td>
              </tr>
            )}
            {literarySubjects.map(subj => renderSubjectRow(subj))}

            {/* Total Obligatoires */}
            <tr style={{ background: '#e0e0e0', fontWeight: 'bold', borderTop: '2px solid #000', borderBottom: '2px solid #000' }}>
              <td colSpan="5" style={{ borderRight: '1px solid #000', padding: '6px', textAlign: 'right' }}>TOTAL</td>
              <td style={{ borderRight: '1px solid #000' }}>-</td>
              <td style={{ borderRight: '1px solid #000' }}>-</td>
              <td style={{ borderRight: '1px solid #000' }}>-</td>
              <td colSpan="4"></td>
            </tr>

            {/* Matières Facultatives */}
            {optionalSubjects.length > 0 && (
              <tr>
                <td colSpan="12" style={{ textAlign: 'left', fontWeight: 'bold', background: '#f5f5f5', borderBottom: '1px solid #000', padding: '4px' }}>
                  MATIERES FACULTATIVES
                </td>
              </tr>
            )}
            {optionalSubjects.map(subj => renderSubjectRow(subj))}

            {/* Total General */}
            <tr style={{ background: '#e0e0e0', fontWeight: 'bold', borderTop: '2px solid #000' }}>
              <td colSpan="5" style={{ borderRight: '1px solid #000', padding: '6px', textAlign: 'right' }}>TOTAL GENERAL (MATIERES OBLIGATOIRES + MOY. MATIERES FACULTATIVES)</td>
              <td style={{ borderRight: '1px solid #000' }}>-</td>
              <td style={{ borderRight: '1px solid #000' }}>-</td>
              <td style={{ borderRight: '1px solid #000' }}>-</td>
              <td colSpan="4"></td>
            </tr>
          </tbody>
        </table>

        {/* Footer info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '12px' }}>
          <div style={{ width: '40%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', fontSize: '10px' }}>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '2px' }}>Retard:</td>
                  <td style={{ border: '1px solid #000', padding: '2px' }}>Encouragement</td>
                  <td style={{ border: '1px solid #000', padding: '2px' }}><input type="checkbox" className="print-input" /></td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '2px' }}>Blâme:</td>
                  <td style={{ border: '1px solid #000', padding: '2px' }}>Félicitation</td>
                  <td style={{ border: '1px solid #000', padding: '2px' }}><input type="checkbox" className="print-input" /></td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '2px' }}>Avertissement:</td>
                  <td style={{ border: '1px solid #000', padding: '2px' }}>Tableau d'honneur</td>
                  <td style={{ border: '1px solid #000', padding: '2px' }}><input type="checkbox" className="print-input" /></td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '2px' }}>Absence (H):</td>
                  <td colSpan="2" style={{ border: '1px solid #000', padding: '2px' }}>
                    Travail Discipline
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ width: '55%', border: '1px solid #000', padding: '10px' }}>
             <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
               <span>Moy. 1er semestre:</span>
               <span style={{ fontSize: '16px' }}>___</span>
               <span>Rang: ___</span>
             </div>
             <div>
               <p style={{ margin: '5px 0' }}>Observations générales : <input className="print-input" style={{ width: '150px' }} type="text" /></p>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                 <div style={{ textAlign: 'center' }}>
                   <p style={{ margin: 0, textDecoration: 'underline' }}>Le Titulaire</p>
                 </div>
                 <div style={{ textAlign: 'center' }}>
                   <p style={{ margin: 0 }}>Fait à Lomé le ....................</p>
                   <p style={{ margin: 0, textDecoration: 'underline' }}>Le Proviseur</p>
                 </div>
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BulletinModal;
