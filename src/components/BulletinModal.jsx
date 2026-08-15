import React, { useState, useEffect } from "react";
import { X, Printer } from "lucide-react";

const BulletinModal = ({
  isOpen,
  onClose,
  student,
  grades,
  bulletinSettings,
}) => {
  if (!isOpen || !student) return null;

  // Retrieve global settings for subjects
  const scientificSubjectsStr =
    bulletinSettings?.scientificSubjects ||
    "Mathématiques, Physique-Chimie, SVT";
  const literarySubjectsStr =
    bulletinSettings?.literarySubjects ||
    "Philosophie, Anglais, Français, Histoire-Géo, ECM, Allemand, Espagnol";
  const optionalSubjectsStr = bulletinSettings?.optionalSubjects || "EPS";

  const parseSubjects = (str) =>
    str
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const scientificSubjects = parseSubjects(scientificSubjectsStr);
  let literarySubjects = parseSubjects(literarySubjectsStr);
  const optionalSubjects = parseSubjects(optionalSubjectsStr);

  const isCollege = (grade) => {
    if (!grade) return false;
    const g = grade.toLowerCase();
    return (
      g.includes("6ème") ||
      g.includes("5ème") ||
      g.includes("4ème") ||
      g.includes("3ème") ||
      g.includes("6e") ||
      g.includes("5e") ||
      g.includes("4e") ||
      g.includes("3e")
    );
  };

  const isCollegeStudent = isCollege(student.grade);

  const isScientificClass = (grade) => {
    if (!grade) return false;
    const g = grade.toUpperCase();
    return /\b[CD]\b/.test(g) || g.endsWith("C") || g.endsWith("D") || g.includes(" C ") || g.includes(" D ");
  };

  const isScientific = isScientificClass(student.grade);

  if (isCollegeStudent) {
    literarySubjects = literarySubjects.filter(
      (subj) =>
        !subj.toLowerCase().includes("philosophie") &&
        !subj.toLowerCase().includes("allemand") &&
        !subj.toLowerCase().includes("espagnol"),
    );
  } else if (isScientific) {
    literarySubjects = literarySubjects.filter(
      (subj) =>
        !subj.toLowerCase().includes("allemand") &&
        !subj.toLowerCase().includes("espagnol"),
    );
  }

  const [localGrades, setLocalGrades] = useState({});

  useEffect(() => {
    // initialize local editable grades from the passed grades
    setLocalGrades(grades || {});
  }, [grades]);

  const handleLocalGradeChange = (subject, type, value) => {
    setLocalGrades((prev) => ({
      ...prev,
      [subject]: {
        ...(prev[subject] || {
          int: "",
          dev: "",
          comp: "",
          dev1: "",
          dev2: "",
          dev3: "",
        }),
        [type]: value,
      },
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    const element = document.getElementById("bulletin-pdf-content");
    const opt = {
      margin: 0,
      filename: `Bulletin_${student.name.replace(/\s+/g, "_")}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        ignoreElements: (el) =>
          el.classList && el.classList.contains("hide-on-print"),
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: isCollegeStudent ? "portrait" : "landscape",
      },
    };

    // Importer dynamiquement pour éviter les problèmes SSR si applicable
    import("html2pdf.js").then((html2pdf) => {
      html2pdf.default().set(opt).from(element).save();
    });
  };

  const getObservation = (moy) => {
    if (moy === null || moy === "") return "";
    const m = parseFloat(moy);
    if (isNaN(m)) return "";
    if (m < 5) return "Faible";
    if (m < 10) return "Insuffisant";
    if (m < 12) return "Passable";
    if (m < 14) return "Assez-Bien";
    if (m < 16) return "Bien";
    return "Très Bien";
  };

  const calculateHighSchoolRowStats = (subjGrades) => {
    if (!subjGrades)
      return {
        int: "",
        dev: "",
        comp: "",
        moyClasse: "",
        moyGen: "",
        coef: 1,
        moyCoef: "",
      };

    const int = subjGrades.int ? parseFloat(subjGrades.int) : null;
    const dev = subjGrades.dev ? parseFloat(subjGrades.dev) : null;
    const comp = subjGrades.comp ? parseFloat(subjGrades.comp) : null;

    let moyClasse = null;
    if (int !== null && dev !== null) moyClasse = (int + dev) / 2;
    else if (int !== null) moyClasse = int;
    else if (dev !== null) moyClasse = dev;

    let moyGen = null;
    if (moyClasse !== null && comp !== null) moyGen = (moyClasse + comp) / 2;
    else if (moyClasse !== null) moyGen = moyClasse;
    else if (comp !== null) moyGen = comp;

    const coef = subjGrades.coef ? parseFloat(subjGrades.coef) : 1;
    const moyCoef = moyGen !== null ? moyGen * coef : null;

    return {
      int: subjGrades.int || "",
      dev: subjGrades.dev || "",
      comp: subjGrades.comp || "",
      moyClasse: moyClasse !== null ? moyClasse.toFixed(2) : "",
      moyGen: moyGen !== null ? moyGen.toFixed(2) : "",
      coef: coef,
      moyCoef: moyCoef !== null ? moyCoef.toFixed(2) : "",
    };
  };

  const calculateCollegeRowStats = (subjGrades) => {
    if (!subjGrades)
      return {
        dev1: "",
        dev2: "",
        dev3: "",
        comp: "",
        moyClasse: "",
        moyGen: "",
        coef: 1,
        moyCoef: "",
      };

    const d1 = subjGrades.dev1 ? parseFloat(subjGrades.dev1) : null;
    const d2 = subjGrades.dev2 ? parseFloat(subjGrades.dev2) : null;
    const d3 = subjGrades.dev3 ? parseFloat(subjGrades.dev3) : null;
    const comp = subjGrades.comp ? parseFloat(subjGrades.comp) : null;

    const validDevs = [d1, d2, d3].filter((d) => d !== null);
    let moyClasse = null;
    if (validDevs.length > 0) {
      moyClasse = validDevs.reduce((a, b) => a + b, 0) / validDevs.length;
    }

    let moyGen = null;
    if (moyClasse !== null && comp !== null) moyGen = (moyClasse + comp) / 2;
    else if (moyClasse !== null) moyGen = moyClasse;
    else if (comp !== null) moyGen = comp;

    const coef = subjGrades.coef ? parseFloat(subjGrades.coef) : 1;
    const moyCoef = moyGen !== null ? moyGen * coef : null;

    return {
      dev1: subjGrades.dev1 || "",
      dev2: subjGrades.dev2 || "",
      dev3: subjGrades.dev3 || "",
      comp: subjGrades.comp || "",
      moyClasse: moyClasse !== null ? moyClasse.toFixed(2) : "",
      moyGen: moyGen !== null ? moyGen.toFixed(2) : "",
      coef: coef,
      moyCoef: moyCoef !== null ? moyCoef.toFixed(2) : "",
    };
  };

  const renderHighSchoolSubjectRow = (subject) => {
    const stats = calculateHighSchoolRowStats(localGrades[subject]);
    return (
      <tr key={subject} style={{ borderBottom: "1px solid #000" }}>
        <td
          style={{
            borderRight: "1px solid #000",
            padding: "4px",
            fontSize: "11px",
            fontWeight: "bold",
            textAlign: "left",
          }}
        >
          {subject}
        </td>
        <td style={{ borderRight: "1px solid #000", padding: "2px" }}>
          <input
            className="print-input"
            type="text"
            value={stats.int}
            onChange={(e) =>
              handleLocalGradeChange(subject, "int", e.target.value)
            }
          />
        </td>
        <td style={{ borderRight: "1px solid #000", padding: "2px" }}>
          <input
            className="print-input"
            type="text"
            value={stats.dev}
            onChange={(e) =>
              handleLocalGradeChange(subject, "dev", e.target.value)
            }
          />
        </td>
        <td
          style={{
            borderRight: "1px solid #000",
            padding: "2px",
            background: "#f5f5f5",
          }}
        >
          {stats.moyClasse}
        </td>
        <td style={{ borderRight: "1px solid #000", padding: "2px" }}>
          <input
            className="print-input"
            type="text"
            value={stats.comp}
            onChange={(e) =>
              handleLocalGradeChange(subject, "comp", e.target.value)
            }
          />
        </td>
        <td
          style={{
            borderRight: "1px solid #000",
            padding: "4px",
            textAlign: "center",
            fontWeight: "bold",
            background: "#e0e0e0",
          }}
        >
          {stats.moyGen}
        </td>
        <td
          style={{
            borderRight: "1px solid #000",
            padding: "4px",
            textAlign: "center",
          }}
        >
          {stats.coef}
        </td>
        <td
          style={{
            borderRight: "1px solid #000",
            padding: "4px",
            textAlign: "center",
            fontWeight: "bold",
            background: "#e0e0e0",
          }}
        >
          {stats.moyCoef}
        </td>
        <td
          style={{
            borderRight: "1px solid #000",
            padding: "4px",
            textAlign: "center",
          }}
        ></td>
        <td
          style={{
            borderRight: "1px solid #000",
            padding: "4px",
            fontSize: "10px",
            fontWeight: "bold",
          }}
        >
          {getObservation(stats.moyGen)}
        </td>
        <td
          style={{
            borderRight: "1px solid #000",
            padding: "4px",
            fontSize: "10px",
          }}
        ></td>
        <td style={{ padding: "4px", fontSize: "10px" }}></td>
      </tr>
    );
  };

  const renderCollegeSubjectRow = (subject) => {
    const stats = calculateCollegeRowStats(localGrades[subject]);
    return (
      <tr key={subject} style={{ borderBottom: "1px solid #000" }}>
        <td
          style={{
            borderRight: "1px solid #000",
            padding: "4px",
            fontSize: "11px",
            fontWeight: "bold",
            textAlign: "left",
          }}
        >
          {subject}
        </td>
        <td style={{ borderRight: "1px solid #000", padding: "2px" }}>
          <input
            className="print-input"
            type="text"
            value={stats.dev1}
            onChange={(e) =>
              handleLocalGradeChange(subject, "dev1", e.target.value)
            }
          />
        </td>
        <td style={{ borderRight: "1px solid #000", padding: "2px" }}>
          <input
            className="print-input"
            type="text"
            value={stats.dev2}
            onChange={(e) =>
              handleLocalGradeChange(subject, "dev2", e.target.value)
            }
          />
        </td>
        <td style={{ borderRight: "1px solid #000", padding: "2px" }}>
          <input
            className="print-input"
            type="text"
            value={stats.dev3}
            onChange={(e) =>
              handleLocalGradeChange(subject, "dev3", e.target.value)
            }
          />
        </td>
        <td
          style={{
            borderRight: "1px solid #000",
            padding: "2px",
            background: "#f5f5f5",
          }}
        >
          {stats.moyClasse}
        </td>
        <td style={{ borderRight: "1px solid #000", padding: "2px" }}>
          <input
            className="print-input"
            type="text"
            value={stats.comp}
            onChange={(e) =>
              handleLocalGradeChange(subject, "comp", e.target.value)
            }
          />
        </td>
        <td
          style={{
            borderRight: "1px solid #000",
            padding: "4px",
            textAlign: "center",
            fontWeight: "bold",
            background: "#e0e0e0",
          }}
        >
          {stats.moyGen}
        </td>
        <td
          style={{
            borderRight: "1px solid #000",
            padding: "4px",
            textAlign: "center",
          }}
        >
          {stats.coef}
        </td>
        <td
          style={{
            borderRight: "1px solid #000",
            padding: "4px",
            textAlign: "center",
            fontWeight: "bold",
            background: "#e0e0e0",
          }}
        >
          {stats.moyCoef}
        </td>
        <td
          style={{
            borderRight: "1px solid #000",
            padding: "4px",
            fontSize: "10px",
          }}
        ></td>
        <td
          style={{
            padding: "4px",
            fontSize: "10px",
            textAlign: "left",
            fontWeight: "bold",
          }}
        >
          {getObservation(stats.moyGen)}
        </td>
      </tr>
    );
  };

  const renderSubjectRow = isCollegeStudent
    ? renderCollegeSubjectRow
    : renderHighSchoolSubjectRow;

  return (
    <div
      className="bulletin-inline-wrapper hide-on-print"
      style={{
        width: "100%",
        overflowX: "auto",
        padding: "20px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
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
              width: ${isCollegeStudent ? "210mm" : "297mm"};
              height: ${isCollegeStudent ? "297mm" : "210mm"};
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
          .print-input[type="checkbox"] {
             width: auto;
             border: none;
          }
          .print-input:focus {
            outline: none;
            border-bottom: 1px solid blue;
          }
          .college-footer-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #000;
            font-size: 10px;
          }
          .college-footer-table td {
            border: 1px solid #000;
            padding: 2px 4px;
          }
        `}
      </style>

      <div
        className="hide-on-print"
        style={{
          display: "flex",
          gap: "10px",
          width: isCollegeStudent ? "210mm" : "297mm",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={handleExportPDF}
          className="btn-primary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            background: "#059669",
            borderColor: "#059669",
          }}
        >
          Télécharger PDF
        </button>
        <button
          onClick={handlePrint}
          className="btn-primary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
          }}
        >
          <Printer size={16} /> Imprimer
        </button>
        <button
          onClick={onClose}
          style={{
            background: "red",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <X size={20} />
        </button>
      </div>

      <div
        id="bulletin-pdf-content"
        className="bulletin-print-container"
        style={{
          background: "#fff",
          width: isCollegeStudent ? "210mm" : "297mm",
          minHeight: isCollegeStudent ? "297mm" : "210mm",
          padding: "20px",
          margin: "0 auto",
          position: "relative",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        }}
      >
        {/* En-tête (4 colonnes) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            borderBottom: "2px solid #000",
            paddingBottom: "10px",
            marginBottom: "10px",
          }}
        >
          {/* Colonne 1: Ministère */}
          <div
            style={{
              textAlign: "center",
              width: "25%",
              fontSize: "11px",
              fontWeight: "bold",
            }}
          >
            {bulletinSettings?.leftHeader ? (
              bulletinSettings.leftHeader.split("\n").map((line, idx) => (
                <p key={idx} style={{ margin: 0 }}>
                  {line}
                </p>
              ))
            ) : (
              <>
                <p style={{ margin: 0 }}>MINISTERE DE L'EDUCATION NATIONALE</p>
                <p style={{ margin: 0 }}>-----------------</p>
                <p style={{ margin: 0 }}>DIRECTION REGIONALE DE L'EDUCATION</p>
                <p style={{ margin: 0 }}>-----------------</p>
                <p style={{ margin: 0 }}>
                  INSPECTION DE L'ENSEIGNEMENT SECONDAIRE
                </p>
                <p style={{ margin: 0 }}>-----------------</p>
                <p style={{ margin: 0 }}>GENERAL ADJOINTIVE</p>
              </>
            )}

            <div
              style={{
                marginTop: "20px",
                border: "1px solid #000",
                padding: "5px",
                textAlign: "left",
              }}
            >
              NOM & PRENOM(S) : <strong>{student.name}</strong>
            </div>
          </div>

          {/* Colonne 2: Logo */}
          <div
            style={{
              textAlign: "center",
              width: "15%",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              paddingTop: "10px",
            }}
          >
            {bulletinSettings?.logoUrl ? (
              <img
                src={bulletinSettings.logoUrl}
                alt="Logo"
                style={{ width: "80px", height: "80px", objectFit: "contain" }}
              />
            ) : (
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  border: "1px solid #000",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                LOGO
              </div>
            )}
          </div>

          {/* Colonne 3: Info Lycée & Bulletin */}
          <div
            style={{
              textAlign: "center",
              width: "35%",
              fontSize: "12px",
              fontWeight: "bold",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p style={{ margin: 0, fontSize: "16px" }}>
              {bulletinSettings?.schoolName || "LYCEE LEGBASSITO"}
            </p>
            <p
              style={{
                margin: "2px 0 5px 0",
                fontSize: "10px",
                fontStyle: "italic",
                fontWeight: "normal",
              }}
            >
              Devise : {bulletinSettings?.motto || "Travail-Liberté-Patrie"}
            </p>
            {bulletinSettings?.phoneNumber && (
              <p
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "10px",
                  fontWeight: "normal",
                }}
              >
                Tel: {bulletinSettings.phoneNumber}
              </p>
            )}
            <p
              style={{
                margin: "5px 0",
                fontSize: "14px",
                border: "1px solid #000",
                padding: "4px",
              }}
            >
              {isCollegeStudent
                ? "BULLETIN DE NOTES"
                : "BULLETIN DU PREMIER SEMESTRE"}
            </p>
            <p style={{ margin: 0 }}>
              AN. ACAD: {bulletinSettings?.academicYear || "2025-2026"}
            </p>
            {isCollegeStudent && <p style={{ margin: 0 }}>Premier Trimestre</p>}
          </div>

          {/* Colonne 4: République + Tableau Effectif */}
          <div
            style={{
              width: "25%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
              <p style={{ margin: 0, fontSize: "12px", fontWeight: "bold" }}>
                REPUBLIQUE TOGOLAISE
              </p>
              <p
                style={{
                  margin: "0 0 2px 0",
                  fontSize: "10px",
                  fontStyle: "italic",
                  fontWeight: "normal",
                }}
              >
                {bulletinSettings?.motto || "Travail-Liberté-Patrie"}
              </p>
            </div>
            <table
              style={{
                borderCollapse: "collapse",
                border: "1px solid #000",
                fontSize: "11px",
                fontWeight: "bold",
                width: "100%",
              }}
            >
              <tbody>
                <tr>
                  <td style={{ border: "1px solid #000", padding: "4px" }}>
                    Classe: {student.grade}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #000", padding: "4px" }}>
                    Eff:{" "}
                    <input
                      type="text"
                      className="print-input"
                      style={{
                        width: "30px",
                        fontWeight: "bold",
                        display: "inline-block",
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #000", padding: "4px" }}>
                    Sexe: M/F{" "}
                    <input
                      type="text"
                      className="print-input"
                      style={{
                        width: "30px",
                        fontWeight: "bold",
                        display: "inline-block",
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tableau */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "2px solid #000",
            fontSize: "11px",
            textAlign: "center",
          }}
        >
          <thead>
            <tr
              style={{ background: "#e0e0e0", borderBottom: "2px solid #000" }}
            >
              <th
                rowSpan="2"
                style={{ borderRight: "1px solid #000", width: "15%" }}
              >
                MATIERES
              </th>
              {isCollegeStudent ? (
                <>
                  <th colSpan="3" style={{ borderRight: "1px solid #000" }}>
                    Devoirs
                  </th>
                  <th
                    rowSpan="2"
                    style={{ borderRight: "1px solid #000", width: "6%" }}
                  >
                    Moy.
                    <br />
                    Class
                  </th>
                  <th
                    rowSpan="2"
                    style={{ borderRight: "1px solid #000", width: "6%" }}
                  >
                    Note
                    <br />
                    Comp.
                  </th>
                  <th
                    rowSpan="2"
                    style={{ borderRight: "1px solid #000", width: "6%" }}
                  >
                    Moy. Gle
                  </th>
                </>
              ) : (
                <>
                  <th colSpan="3" style={{ borderRight: "1px solid #000" }}>
                    Notes de classe
                  </th>
                  <th
                    rowSpan="2"
                    style={{ borderRight: "1px solid #000", width: "6%" }}
                  >
                    Comp.
                  </th>
                  <th
                    rowSpan="2"
                    style={{ borderRight: "1px solid #000", width: "6%" }}
                  >
                    Moy General
                  </th>
                </>
              )}
              <th
                rowSpan="2"
                style={{ borderRight: "1px solid #000", width: "5%" }}
              >
                Coef
              </th>
              <th
                rowSpan="2"
                style={{ borderRight: "1px solid #000", width: "6%" }}
              >
                {isCollegeStudent ? "Total" : "Moy coef"}
              </th>
              {!isCollegeStudent && (
                <th
                  rowSpan="2"
                  style={{ borderRight: "1px solid #000", width: "5%" }}
                >
                  Rang
                </th>
              )}
              <th
                rowSpan="2"
                style={{ borderRight: "1px solid #000", width: "15%" }}
              >
                {isCollegeStudent ? "Professeurs" : "Appréciations"}
              </th>
              <th
                rowSpan="2"
                style={{ borderRight: "1px solid #000", width: "15%" }}
              >
                {isCollegeStudent ? "Observation & Sign" : "Professeurs"}
              </th>
              {!isCollegeStudent && (
                <th rowSpan="2" style={{ width: "10%" }}>
                  Signature
                </th>
              )}
            </tr>
            <tr
              style={{ background: "#e0e0e0", borderBottom: "2px solid #000" }}
            >
              {isCollegeStudent ? (
                <>
                  <th
                    style={{
                      borderRight: "1px solid #000",
                      width: "5%",
                      borderTop: "1px solid #000",
                    }}
                  >
                    1
                  </th>
                  <th
                    style={{
                      borderRight: "1px solid #000",
                      width: "5%",
                      borderTop: "1px solid #000",
                    }}
                  >
                    2
                  </th>
                  <th
                    style={{
                      borderRight: "1px solid #000",
                      width: "5%",
                      borderTop: "1px solid #000",
                    }}
                  >
                    3
                  </th>
                </>
              ) : (
                <>
                  <th
                    style={{
                      borderRight: "1px solid #000",
                      width: "5%",
                      borderTop: "1px solid #000",
                    }}
                  >
                    Int
                  </th>
                  <th
                    style={{
                      borderRight: "1px solid #000",
                      width: "5%",
                      borderTop: "1px solid #000",
                    }}
                  >
                    Dev.
                  </th>
                  <th
                    style={{
                      borderRight: "1px solid #000",
                      width: "5%",
                      borderTop: "1px solid #000",
                    }}
                  >
                    Moy. Classe
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {/* Matières Scientifiques */}
            {scientificSubjects.length > 0 && (
              <>
                <tr>
                  <td
                    colSpan={isCollegeStudent ? 11 : 12}
                    style={{
                      textAlign: "left",
                      fontWeight: "bold",
                      background: "#f5f5f5",
                      borderBottom: "1px solid #000",
                      padding: "4px",
                    }}
                  >
                    MATIERES SCIENTIFIQUES
                  </td>
                </tr>
                {scientificSubjects.map((subj) => renderSubjectRow(subj))}
                {isCollegeStudent && (
                  <tr style={{ fontWeight: "bold" }}>
                    <td
                      colSpan={6}
                      style={{
                        borderRight: "1px solid #000",
                        padding: "4px",
                        textAlign: "right",
                      }}
                    >
                      Total
                    </td>
                    <td
                      style={{
                        borderRight: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      <input
                        className="print-input"
                        style={{ fontWeight: "bold" }}
                      />
                    </td>
                    <td
                      style={{
                        borderRight: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      <input
                        className="print-input"
                        style={{ fontWeight: "bold" }}
                      />
                    </td>
                    <td
                      style={{
                        borderRight: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      <input
                        className="print-input"
                        style={{ fontWeight: "bold" }}
                      />
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                )}
              </>
            )}

            {/* Matières Littéraires */}
            {literarySubjects.length > 0 && (
              <>
                <tr>
                  <td
                    colSpan={isCollegeStudent ? 11 : 12}
                    style={{
                      textAlign: "left",
                      fontWeight: "bold",
                      background: "#f5f5f5",
                      borderBottom: "1px solid #000",
                      padding: "4px",
                    }}
                  >
                    MATIERES LITTERAIRES
                  </td>
                </tr>
                {literarySubjects.map((subj) => renderSubjectRow(subj))}
                {isCollegeStudent && (
                  <tr style={{ fontWeight: "bold" }}>
                    <td
                      colSpan={6}
                      style={{
                        borderRight: "1px solid #000",
                        padding: "4px",
                        textAlign: "right",
                      }}
                    >
                      Total
                    </td>
                    <td
                      style={{
                        borderRight: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      <input
                        className="print-input"
                        style={{ fontWeight: "bold" }}
                      />
                    </td>
                    <td
                      style={{
                        borderRight: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      <input
                        className="print-input"
                        style={{ fontWeight: "bold" }}
                      />
                    </td>
                    <td
                      style={{
                        borderRight: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      <input
                        className="print-input"
                        style={{ fontWeight: "bold" }}
                      />
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                )}
              </>
            )}

            {/* Total Obligatoires - For High School Only */}
            {!isCollegeStudent && (
              <tr
                style={{
                  background: "#e0e0e0",
                  fontWeight: "bold",
                  borderTop: "2px solid #000",
                  borderBottom: "2px solid #000",
                }}
              >
                <td
                  colSpan={5}
                  style={{
                    borderRight: "1px solid #000",
                    padding: "6px",
                    textAlign: "right",
                  }}
                >
                  TOTAL
                </td>
                <td style={{ borderRight: "1px solid #000" }}>-</td>
                <td style={{ borderRight: "1px solid #000" }}>-</td>
                <td style={{ borderRight: "1px solid #000" }}>-</td>
                <td colSpan={4}></td>
              </tr>
            )}

            {/* Matières Facultatives */}
            {optionalSubjects.length > 0 && (
              <>
                <tr>
                  <td
                    colSpan={isCollegeStudent ? 11 : 12}
                    style={{
                      textAlign: "left",
                      fontWeight: "bold",
                      background: "#f5f5f5",
                      borderBottom: "1px solid #000",
                      padding: "4px",
                    }}
                  >
                    MATIERES FACULTATIVES
                  </td>
                </tr>
                {optionalSubjects.map((subj) => renderSubjectRow(subj))}
                {isCollegeStudent && (
                  <tr style={{ fontWeight: "bold" }}>
                    <td
                      colSpan={6}
                      style={{
                        borderRight: "1px solid #000",
                        padding: "4px",
                        textAlign: "right",
                      }}
                    >
                      Total
                    </td>
                    <td
                      style={{
                        borderRight: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      <input
                        className="print-input"
                        style={{ fontWeight: "bold" }}
                      />
                    </td>
                    <td
                      style={{
                        borderRight: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      <input
                        className="print-input"
                        style={{ fontWeight: "bold" }}
                      />
                    </td>
                    <td
                      style={{
                        borderRight: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      <input
                        className="print-input"
                        style={{ fontWeight: "bold" }}
                      />
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                )}
              </>
            )}

            {/* Total General */}
            {isCollegeStudent ? (
              <tr
                style={{
                  background: "#e0e0e0",
                  fontWeight: "bold",
                  borderTop: "2px solid #000",
                }}
              >
                <td
                  colSpan={7}
                  style={{
                    borderRight: "1px solid #000",
                    padding: "6px",
                    textAlign: "right",
                  }}
                >
                  Totaux
                </td>
                <td
                  style={{ borderRight: "1px solid #000", textAlign: "center" }}
                >
                  <input
                    className="print-input"
                    style={{ fontWeight: "bold" }}
                  />
                </td>
                <td
                  style={{ borderRight: "1px solid #000", textAlign: "center" }}
                >
                  <input
                    className="print-input"
                    style={{ fontWeight: "bold" }}
                  />
                </td>
                <td colSpan={2}></td>
              </tr>
            ) : (
              <tr
                style={{
                  background: "#e0e0e0",
                  fontWeight: "bold",
                  borderTop: "2px solid #000",
                }}
              >
                <td
                  colSpan={5}
                  style={{
                    borderRight: "1px solid #000",
                    padding: "6px",
                    textAlign: "right",
                  }}
                >
                  TOTAL GENERAL (MATIERES OBLIGATOIRES + MOY. MATIERES
                  FACULTATIVES)
                </td>
                <td style={{ borderRight: "1px solid #000" }}>-</td>
                <td style={{ borderRight: "1px solid #000" }}>-</td>
                <td style={{ borderRight: "1px solid #000" }}>-</td>
                <td colSpan={4}></td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer info */}
        {isCollegeStudent ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "30px",
              fontSize: "10px",
              width: "100%",
              gap: "5px",
            }}
          >
            {/* LEFT AND MIDDLE CONTAINER */}
            <div
              style={{ width: "63%", display: "flex", flexDirection: "column" }}
            >
              {/* Top part of Left/Middle */}
              <div style={{ display: "flex", gap: "5px" }}>
                {/* Col 1 */}
                <div
                  style={{
                    width: "35%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <table className="college-footer-table">
                    <tbody>
                      <tr>
                        <td>Retards</td>
                        <td style={{ width: "30px" }}>
                          <input className="print-input" />
                        </td>
                      </tr>
                      <tr>
                        <td>Absences</td>
                        <td>
                          <input className="print-input" />
                        </td>
                      </tr>
                      <tr>
                        <td>Exclusions</td>
                        <td>
                          <input className="print-input" />
                        </td>
                      </tr>
                      <tr>
                        <td>Avertis.</td>
                        <td style={{ padding: 0 }}>
                          <div
                            style={{
                              borderBottom: "1px solid #000",
                              padding: "1px 2px",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            Travail{" "}
                            <input type="checkbox" className="print-input" />
                          </div>
                          <div
                            style={{
                              padding: "1px 2px",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            Discipline{" "}
                            <input type="checkbox" className="print-input" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table className="college-footer-table">
                    <tbody>
                      <tr>
                        <td>Félicitations</td>
                        <td style={{ width: "30px" }}>
                          <input type="checkbox" className="print-input" />
                        </td>
                      </tr>
                      <tr>
                        <td>Encouragements</td>
                        <td>
                          <input type="checkbox" className="print-input" />
                        </td>
                      </tr>
                      <tr>
                        <td>Tableau d'honneur</td>
                        <td>
                          <input type="checkbox" className="print-input" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Col 2 */}
                <div
                  style={{
                    width: "65%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <table className="college-footer-table">
                    <tbody>
                      <tr>
                        <td style={{ width: "50%" }}>Moy. Trimestrielle</td>
                        <td>
                          <input className="print-input" />
                        </td>
                      </tr>
                      <tr>
                        <td>Moy. Annuelle</td>
                        <td>
                          <input className="print-input" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div
                    style={{
                      textAlign: "center",
                      marginTop: "5px",
                      fontSize: "10px",
                    }}
                  >
                    Moy 1er Trim en lettre:{" "}
                    <input className="print-input" style={{ width: "150px" }} />
                  </div>
                  <table
                    className="college-footer-table"
                    style={{ marginTop: "5px" }}
                  >
                    <tbody>
                      <tr>
                        <td style={{ width: "30%", fontStyle: "italic" }}>
                          Observations
                        </td>
                        <td>
                          <input
                            className="print-input"
                            style={{ fontWeight: "bold", fontSize: "12px" }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    className="college-footer-table"
                    style={{
                      marginTop: "10px",
                      width: "80%",
                      margin: "10px auto 0",
                    }}
                  >
                    <tbody>
                      <tr>
                        <td style={{ width: "60%" }}>Moy. Premier Trimestre</td>
                        <td>
                          <input className="print-input" />
                        </td>
                      </tr>
                      <tr>
                        <td>Moy. Deuxième Trimestre</td>
                        <td>
                          <input className="print-input" />
                        </td>
                      </tr>
                      <tr>
                        <td>Moy. Troisième Trimestre</td>
                        <td>
                          <input className="print-input" />
                        </td>
                      </tr>
                      <tr>
                        <td>Moy. Annuelle</td>
                        <td>
                          <input className="print-input" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom part of Left/Middle: The Décision Box */}
              <div style={{ marginTop: "15px" }}>
                <table className="college-footer-table">
                  <tbody>
                    <tr>
                      <td
                        style={{
                          width: "30%",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        Décision du conseil
                        <br />
                        de classe
                      </td>
                      <td style={{ height: "45px" }}></td>
                    </tr>
                  </tbody>
                </table>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                    padding: "0 10px",
                  }}
                >
                  <p style={{ margin: 0, textDecoration: "underline" }}>
                    Le Titulaire
                  </p>
                  <p style={{ margin: 0 }}>
                    Lomé, le{" "}
                    <input
                      type="text"
                      className="print-input"
                      style={{
                        width: "80px",
                        display: "inline",
                        borderBottom: "1px dashed #000",
                      }}
                      defaultValue="07/01/2026"
                    />
                  </p>
                </div>
              </div>
            </div>

            {/* Col 3: Right side */}
            <div
              style={{
                width: "35%",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <div style={{ display: "flex", gap: "5px" }}>
                <div
                  style={{
                    width: "40%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <table className="college-footer-table">
                    <tbody>
                      <tr>
                        <td>Rang</td>
                        <td>
                          <input className="print-input" />
                        </td>
                      </tr>
                      <tr>
                        <td>Rang</td>
                        <td>
                          <input className="print-input" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div
                  style={{
                    width: "60%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <table className="college-footer-table">
                    <tbody>
                      <tr>
                        <td>Forte Moy Trim</td>
                        <td>
                          <input className="print-input" />
                        </td>
                      </tr>
                      <tr>
                        <td>Moy Class Trim</td>
                        <td>
                          <input className="print-input" />
                        </td>
                      </tr>
                      <tr>
                        <td>Faible moy Trim</td>
                        <td>
                          <input className="print-input" />
                        </td>
                      </tr>
                      <tr>
                        <td>Forte Moy An</td>
                        <td>
                          <input className="print-input" />
                        </td>
                      </tr>
                      <tr>
                        <td>Moy Class An</td>
                        <td>
                          <input className="print-input" />
                        </td>
                      </tr>
                      <tr>
                        <td>Faible moy An</td>
                        <td>
                          <input className="print-input" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div
                style={{
                  marginTop: "auto",
                  paddingTop: "50px",
                  paddingBottom: "10px",
                  textAlign: "center",
                }}
              >
                <p style={{ margin: 0, textDecoration: "underline" }}>
                  Le Directeur
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
              fontSize: "12px",
            }}
          >
            <div style={{ width: "40%" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  border: "1px solid #000",
                  fontSize: "10px",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ border: "1px solid #000", padding: "2px" }}>
                      Retard:
                    </td>
                    <td style={{ border: "1px solid #000", padding: "2px" }}>
                      Encouragement
                    </td>
                    <td style={{ border: "1px solid #000", padding: "2px" }}>
                      <input type="checkbox" className="print-input" />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid #000", padding: "2px" }}>
                      Blâme:
                    </td>
                    <td style={{ border: "1px solid #000", padding: "2px" }}>
                      Félicitation
                    </td>
                    <td style={{ border: "1px solid #000", padding: "2px" }}>
                      <input type="checkbox" className="print-input" />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid #000", padding: "2px" }}>
                      Avertissement:
                    </td>
                    <td style={{ border: "1px solid #000", padding: "2px" }}>
                      Tableau d'honneur
                    </td>
                    <td style={{ border: "1px solid #000", padding: "2px" }}>
                      <input type="checkbox" className="print-input" />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid #000", padding: "2px" }}>
                      Absence (H):
                    </td>
                    <td
                      colSpan="2"
                      style={{ border: "1px solid #000", padding: "2px" }}
                    >
                      Travail Discipline
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              style={{
                width: "55%",
                border: "1px solid #000",
                padding: "10px",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Moy. 1er semestre:</span>
                <span style={{ fontSize: "16px" }}>___</span>
                <span>Rang: ___</span>
              </div>
              <div>
                <p style={{ margin: "5px 0" }}>
                  Observations générales :{" "}
                  <input
                    className="print-input"
                    style={{ width: "150px" }}
                    type="text"
                  />
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "30px",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <p style={{ margin: 0, textDecoration: "underline" }}>
                      Le Titulaire
                    </p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ margin: 0 }}>
                      Fait à Lomé le ....................
                    </p>
                    <p style={{ margin: 0, textDecoration: "underline" }}>
                      Le Proviseur
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulletinModal;
