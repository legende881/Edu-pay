import React, { useState, useEffect } from "react";
import { DollarSign, AlertCircle, Users, Activity, TrendingUp, Bell, Search, Lock, Unlock, ChevronDown, Settings, LogOut, Eye, Menu, X, Calendar, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StudentsList from "./students";
import PaymentsView from "./payments";
import { supabase } from "../supabaseClient";
import { getFamiliesNested, getTransactions } from "../supabaseService";
const SettingsPlan = () => {
  const [defaultTranches, setDefaultTranches] = useState("3");
  const [chatNumber, setChatNumber] = useState("+22890000000");
  const [yasNumber, setYasNumber] = useState("");
  const [floozNumber, setFloozNumber] = useState("");
  const [directorPin, setDirectorPin] = useState("1234");
  const [classTuitions, setClassTuitions] = useState([
    { id: 1, name: "CP1", amount: 12e4 },
    { id: 2, name: "CE1", amount: 12e4 },
    { id: 3, name: "6\xE8me", amount: 15e4 }
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase.from("global_settings").select("data").eq("id", 1).single();
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
    setClassTuitions(classTuitions.map((ct) => ct.id === id ? { ...ct, [field]: value } : ct));
  };
  const addClassTuition = () => {
    setClassTuitions([...classTuitions, { id: Date.now(), name: "", amount: "" }]);
  };
  const removeClassTuition = (id) => {
    setClassTuitions(classTuitions.filter((ct) => ct.id !== id));
  };
  const handleSave = async (e) => {
    e.preventDefault();
    const { data: currentData } = await supabase.from("global_settings").select("data").eq("id", 1).single();
    const settings = currentData?.data || {};
    settings.defaultTranches = defaultTranches;
    settings.chatNumber = chatNumber;
    settings.yasNumber = yasNumber;
    settings.floozNumber = floozNumber;
    settings.directorPin = directorPin;
    settings.classTuitions = classTuitions;
    await supabase.from("global_settings").upsert([{ id: 1, data: settings }]);
    setMessage("Les param\xE8tres ont \xE9t\xE9 mis \xE0 jour avec succ\xE8s.");
    setTimeout(() => setMessage(""), 3e3);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "welcome-section animate-fade-in-up", style: { background: "white", padding: "32px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)" } }, /* @__PURE__ */ React.createElement("h2", { style: { marginBottom: "8px" } }, "Param\xE8tres du Plan de Paiement"), /* @__PURE__ */ React.createElement("p", { style: { color: "var(--text-muted)", marginBottom: "32px" } }, "D\xE9finissez la configuration globale des paiements pour l'ann\xE9e en cours."), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSave, style: { maxWidth: "400px" } }, /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { marginBottom: "24px" } }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontWeight: 500, marginBottom: "8px" } }, "Nombre de tranches par d\xE9faut"), /* @__PURE__ */ React.createElement(
    "select",
    {
      className: "search-input",
      value: defaultTranches,
      onChange: (e) => setDefaultTranches(e.target.value),
      style: { width: "100%", padding: "10px" }
    },
    /* @__PURE__ */ React.createElement("option", { value: "1" }, "1 Tranche (Paiement int\xE9gral)"),
    /* @__PURE__ */ React.createElement("option", { value: "2" }, "2 Tranches"),
    /* @__PURE__ */ React.createElement("option", { value: "3" }, "3 Tranches"),
    /* @__PURE__ */ React.createElement("option", { value: "4" }, "4 Tranches"),
    /* @__PURE__ */ React.createElement("option", { value: "5" }, "5 Tranches")
  ), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "13px", color: "var(--text-muted)", marginTop: "8px" } }, "Ce param\xE8tre s'appliquera par d\xE9faut lors de l'ajout de nouveaux \xE9l\xE8ves. Vous pourrez toujours ajuster le plan individuellement pour chaque \xE9l\xE8ve.")), /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { marginBottom: "24px" } }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontWeight: 500, marginBottom: "8px" } }, "Num\xE9ro de Chat Support (ex: WhatsApp)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      className: "search-input",
      value: chatNumber,
      onChange: (e) => setChatNumber(e.target.value),
      placeholder: "+228...",
      style: { width: "100%", padding: "10px" }
    }
  ), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "13px", color: "var(--text-muted)", marginTop: "8px" } }, "Ce num\xE9ro sera utilis\xE9 par les parents pour vous contacter directement via le bouton de chat dans leur espace.")), /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { marginBottom: "24px" } }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontWeight: 500, marginBottom: "8px" } }, "Num\xE9ro de r\xE9ception YAS"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      className: "search-input",
      value: yasNumber,
      onChange: (e) => setYasNumber(e.target.value),
      placeholder: "Num\xE9ro YAS de l'\xE9cole...",
      style: { width: "100%", padding: "10px" }
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { marginBottom: "24px" } }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontWeight: 500, marginBottom: "8px" } }, "Num\xE9ro de r\xE9ception Flooz"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      className: "search-input",
      value: floozNumber,
      onChange: (e) => setFloozNumber(e.target.value),
      placeholder: "Num\xE9ro Flooz de l'\xE9cole...",
      style: { width: "100%", padding: "10px" }
    }
  ), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "13px", color: "var(--text-muted)", marginTop: "8px" } }, "Les paiements Mobile Money effectu\xE9s par les parents seront dirig\xE9s vers ces num\xE9ros respectifs via l'API.")), /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { marginBottom: "24px" } }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontWeight: 500, marginBottom: "8px" } }, "Code PIN Directeur (S\xE9curit\xE9)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "password",
      className: "search-input",
      value: directorPin,
      onChange: (e) => setDirectorPin(e.target.value),
      placeholder: "Ex: 1234",
      maxLength: 6,
      style: { width: "100%", padding: "10px", letterSpacing: "2px" }
    }
  ), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "13px", color: "var(--text-muted)", marginTop: "8px" } }, "Ce code est requis pour annuler ou modifier \xE0 la baisse un paiement d\xE9j\xE0 effectu\xE9.")), /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { marginBottom: "24px", borderTop: "1px solid var(--border-light)", paddingTop: "24px" } }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontWeight: 500, marginBottom: "16px", fontSize: "16px" } }, "\xC9colages par classe"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" } }, classTuitions.map((ct) => /* @__PURE__ */ React.createElement("div", { key: ct.id, style: { display: "flex", gap: "12px", alignItems: "center" } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      className: "search-input",
      value: ct.name,
      onChange: (e) => handleTuitionChange(ct.id, "name", e.target.value),
      placeholder: "Nom de la classe (ex: CP1)",
      style: { flex: 1, padding: "10px" },
      required: true
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      className: "search-input",
      value: ct.amount,
      onChange: (e) => handleTuitionChange(ct.id, "amount", parseInt(e.target.value) || ""),
      placeholder: "Montant (FCFA)",
      style: { flex: 1, padding: "10px" },
      required: true
    }
  ), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => removeClassTuition(ct.id), style: { background: "none", border: "none", color: "#EF4444", cursor: "pointer", padding: "8px", flexShrink: 0 }, title: "Supprimer" }, "\u{1F5D1}\uFE0F")))), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: addClassTuition, className: "btn-outline btn-sm", style: { padding: "8px 16px" } }, "+ Ajouter une classe"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "13px", color: "var(--text-muted)", marginTop: "8px" } }, "Ces montants serviront de base lors de l'inscription d'un nouvel \xE9l\xE8ve.")), message && /* @__PURE__ */ React.createElement("div", { style: { padding: "12px", background: "#ECFDF5", color: "#059669", borderRadius: "8px", marginBottom: "24px", fontSize: "14px" } }, message), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn-primary", style: { padding: "10px 24px" } }, "Enregistrer les modifications")));
};
const SettingsBulletin = () => {
  const defaultSettings = {
    schoolName: "LYC\xC9E LEGBASSITO",
    motto: "Travail - Libert\xE9 - Patrie",
    academicYear: "2025-2026",
    logoUrl: "",
    leftHeader: "MINISTERE DE L'EDUCATION NATIONALE\n-----------------\nDIRECTION REGIONALE DE L'EDUCATION\n-----------------\nINSPECTION DE L'ENSEIGNEMENT SECONDAIRE\n-----------------\nGENERAL ADJOINTIVE",
    phoneNumber: "",
    scientificSubjects: "Math\xE9matiques, Physique-Chimie, SVT",
    literarySubjects: "Philosophie, Anglais, Fran\xE7ais, Histoire-G\xE9o, ECM, Allemand, Espagnol",
    optionalSubjects: "EPS"
  };
  const [bulletinSettings, setBulletinSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase.from("global_settings").select("data").eq("id", 2).single();
      if (data && data.data) {
        setBulletinSettings({ ...defaultSettings, ...data.data });
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);
  const [message, setMessage] = useState("");
  const handleChange = (field, value) => {
    setBulletinSettings({ ...bulletinSettings, [field]: value });
  };
  const handleSave = async (e) => {
    e.preventDefault();
    await supabase.from("global_settings").upsert([{ id: 2, data: bulletinSettings }]);
    setMessage("Param\xE8tres du bulletin mis \xE0 jour avec succ\xE8s.");
    setTimeout(() => setMessage(""), 3e3);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "welcome-section animate-fade-in-up", style: { background: "white", padding: "32px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)" } }, /* @__PURE__ */ React.createElement("h2", { style: { marginBottom: "8px" } }, "Param\xE9trage du Bulletin"), /* @__PURE__ */ React.createElement("p", { style: { color: "var(--text-muted)", marginBottom: "32px" } }, "Configurez l'en-t\xEAte et les cat\xE9gories de mati\xE8res pour les bulletins de notes."), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSave, style: { maxWidth: "600px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" } }, /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontWeight: 500, marginBottom: "8px" } }, "Nom de l'\xE9tablissement"), /* @__PURE__ */ React.createElement("input", { type: "text", className: "search-input", value: bulletinSettings.schoolName, onChange: (e) => handleChange("schoolName", e.target.value), style: { width: "100%", padding: "10px" }, required: true })), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontWeight: 500, marginBottom: "8px" } }, "Devise"), /* @__PURE__ */ React.createElement("input", { type: "text", className: "search-input", value: bulletinSettings.motto, onChange: (e) => handleChange("motto", e.target.value), style: { width: "100%", padding: "10px" } }))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" } }, /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontWeight: 500, marginBottom: "8px" } }, "Ann\xE9e Acad\xE9mique"), /* @__PURE__ */ React.createElement("input", { type: "text", className: "search-input", value: bulletinSettings.academicYear, onChange: (e) => handleChange("academicYear", e.target.value), style: { width: "100%", padding: "10px" }, required: true })), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontWeight: 500, marginBottom: "8px" } }, "Num\xE9ro de t\xE9l\xE9phone officiel"), /* @__PURE__ */ React.createElement("input", { type: "text", className: "search-input", value: bulletinSettings.phoneNumber || "", onChange: (e) => handleChange("phoneNumber", e.target.value), placeholder: "Ex: +228 90 00 00 00", style: { width: "100%", padding: "10px" } }))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" } }, /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { gridColumn: "1 / -1" } }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontWeight: 500, marginBottom: "8px" } }, "Logo de l'\xE9tablissement (Format Image, ex: JPEG, PNG)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "file",
      accept: "image/*",
      className: "search-input",
      onChange: (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            handleChange("logoUrl", reader.result);
          };
          reader.readAsDataURL(file);
        }
      },
      style: { width: "100%", padding: "10px", background: "#F8FAFC" }
    }
  ), bulletinSettings.logoUrl && /* @__PURE__ */ React.createElement("div", { style: { marginTop: "10px" } }, /* @__PURE__ */ React.createElement("img", { src: bulletinSettings.logoUrl, alt: "Aper\xE7u logo", style: { maxHeight: "80px", objectFit: "contain" } })))), /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { marginBottom: "24px" } }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontWeight: 500, marginBottom: "8px" } }, "En-t\xEAte gauche (Minist\xE8re, Direction, etc.)"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "search-input",
      value: bulletinSettings.leftHeader || "",
      onChange: (e) => handleChange("leftHeader", e.target.value),
      style: { width: "100%", padding: "10px", minHeight: "120px", fontFamily: "monospace" }
    }
  )), /* @__PURE__ */ React.createElement("h3", { style: { fontSize: "16px", marginBottom: "16px", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" } }, "Classification des Mati\xE8res (S\xE9par\xE9es par des virgules)"), /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { marginBottom: "16px" } }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontWeight: 500, marginBottom: "8px" } }, "Mati\xE8res Scientifiques"), /* @__PURE__ */ React.createElement("input", { type: "text", className: "search-input", value: bulletinSettings.scientificSubjects, onChange: (e) => handleChange("scientificSubjects", e.target.value), style: { width: "100%", padding: "10px" } })), /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { marginBottom: "16px" } }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontWeight: 500, marginBottom: "8px" } }, "Mati\xE8res Litt\xE9raires"), /* @__PURE__ */ React.createElement("input", { type: "text", className: "search-input", value: bulletinSettings.literarySubjects, onChange: (e) => handleChange("literarySubjects", e.target.value), style: { width: "100%", padding: "10px" } })), /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { marginBottom: "24px" } }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontWeight: 500, marginBottom: "8px" } }, "Mati\xE8res Facultatives"), /* @__PURE__ */ React.createElement("input", { type: "text", className: "search-input", value: bulletinSettings.optionalSubjects, onChange: (e) => handleChange("optionalSubjects", e.target.value), style: { width: "100%", padding: "10px" } })), message && /* @__PURE__ */ React.createElement("div", { style: { padding: "12px", background: "#ECFDF5", color: "#059669", borderRadius: "8px", marginBottom: "24px", fontSize: "14px" } }, message), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn-primary", style: { padding: "10px 24px" } }, "Enregistrer la configuration")));
};
const SettingsPersonal = () => {
  const savedUser = localStorage.getItem("currentUser");
  const currentUser = savedUser ? JSON.parse(savedUser) : { role: "director" };
  const isDirector = currentUser.role === "director";
  const [directorProfile, setDirectorProfile] = useState({
    name: "M. le Directeur",
    email: "directeur@ecole.com",
    photo: "https://i.pravatar.cc/150?u=director"
  });
  const [adminsList, setAdminsList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProfileAndAdmins = async () => {
      const { data: settingsData } = await supabase.from("global_settings").select("data").eq("id", 1).single();
      if (settingsData && settingsData.data && settingsData.data.directorProfile) {
        setDirectorProfile(settingsData.data.directorProfile);
      }
      const { data, error } = await supabase.from("admins").select("*");
      if (data) setAdminsList(data);
      setLoading(false);
    };
    fetchProfileAndAdmins();
  }, []);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
  const [adminToEdit, setAdminToEdit] = useState(null);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (adminsList.find((a) => a.username === newAdminEmail)) {
      setAdminMessage("Cet administrateur existe d\xE9j\xE0.");
      setTimeout(() => setAdminMessage(""), 3e3);
      return;
    }
    const { data, error } = await supabase.from("admins").insert([
      { username: newAdminEmail, password: newAdminPassword }
    ]).select();
    if (!error && data) {
      setAdminsList([...adminsList, data[0]]);
      setAdminMessage("Administrateur ajout\xE9 avec succ\xE8s.");
      setNewAdminEmail("");
      setNewAdminPassword("");
    } else {
      setAdminMessage("Erreur lors de l'ajout.");
    }
    setTimeout(() => setAdminMessage(""), 3e3);
  };
  const saveEditedAdmin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("admins").update({ username: adminToEdit.email, password: adminToEdit.password }).eq("id", adminToEdit.id);
    if (!error) {
      setAdminsList(adminsList.map((a) => a.id === adminToEdit.id ? { ...a, username: adminToEdit.email, password: adminToEdit.password } : a));
      setAdminToEdit(null);
    }
  };
  const confirmDeleteAdmin = async () => {
    const { error } = await supabase.from("admins").delete().eq("id", adminToDelete);
    if (!error) {
      setAdminsList(adminsList.filter((a) => a.id !== adminToDelete));
      setAdminToDelete(null);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "welcome-section animate-fade-in-up", style: { background: "white", padding: "32px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)", opacity: isDirector ? 1 : 0.6, pointerEvents: isDirector ? "auto" : "none" } }, !isDirector && /* @__PURE__ */ React.createElement("div", { style: { background: "#F1F5F9", color: "#64748B", padding: "12px", borderRadius: "8px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" } }, /* @__PURE__ */ React.createElement(Lock, { size: 16 }), " Acc\xE8s en lecture seule - R\xE9serv\xE9 au directeur"), /* @__PURE__ */ React.createElement("h2", { style: { marginBottom: "8px" } }, "Informations Personnelles"), /* @__PURE__ */ React.createElement("p", { style: { color: "var(--text-muted)", marginBottom: "32px" } }, "G\xE9rez les informations de votre profil directeur."), /* @__PURE__ */ React.createElement("div", { style: { maxWidth: "400px", marginBottom: "40px" } }, /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px" } }, /* @__PURE__ */ React.createElement("img", { src: directorProfile.photo, alt: "Profil", style: { width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border-light)" } }), isDirector && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { htmlFor: "photo-upload", className: "btn-outline", style: { padding: "6px 12px", fontSize: "13px", cursor: "pointer", display: "inline-block" } }, "Changer la photo"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "photo-upload",
      type: "file",
      accept: "image/*",
      style: { display: "none" },
      onChange: (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setDirectorProfile((prev) => ({ ...prev, photo: reader.result }));
          };
          reader.readAsDataURL(file);
        }
      }
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { marginBottom: "16px" } }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontWeight: 500, marginBottom: "8px" } }, "Nom complet"), /* @__PURE__ */ React.createElement("input", { type: "text", className: "search-input", value: directorProfile.name, onChange: (e) => setDirectorProfile({ ...directorProfile, name: e.target.value }), style: { width: "100%", padding: "10px" }, disabled: !isDirector })), /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { marginBottom: "24px" } }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontWeight: 500, marginBottom: "8px" } }, "Adresse Email"), /* @__PURE__ */ React.createElement("input", { type: "email", className: "search-input", value: directorProfile.email, onChange: (e) => setDirectorProfile({ ...directorProfile, email: e.target.value }), style: { width: "100%", padding: "10px" }, disabled: !isDirector })), isDirector && /* @__PURE__ */ React.createElement("button", { className: "btn-primary", style: { padding: "10px 24px" }, onClick: async () => {
    const { data: currentData } = await supabase.from("global_settings").select("data").eq("id", 1).single();
    const settings = currentData?.data || {};
    settings.directorProfile = directorProfile;
    await supabase.from("global_settings").upsert([{ id: 1, data: settings }]);
    alert("Profil mis \xE0 jour ! Le changement appara\xEEtra dans le menu en haut \xE0 droite.");
  } }, "Mettre \xE0 jour mes informations")), /* @__PURE__ */ React.createElement("div", { style: { borderTop: "1px solid var(--border-light)", paddingTop: "32px" } }, /* @__PURE__ */ React.createElement("h3", { style: { marginBottom: "8px", fontSize: "18px" } }, "Ajouter un administrateur"), /* @__PURE__ */ React.createElement("p", { style: { color: "var(--text-muted)", marginBottom: "24px", fontSize: "14px" } }, "L'administrateur ajout\xE9 pourra se connecter sans inscription pour g\xE9rer les informations en votre absence (mais n'aura pas acc\xE8s \xE0 cette page)."), /* @__PURE__ */ React.createElement("form", { onSubmit: handleAddAdmin, style: { maxWidth: "400px" } }, /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { marginBottom: "16px" } }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontWeight: 500, marginBottom: "8px" } }, "Email de l'administrateur"), /* @__PURE__ */ React.createElement("input", { type: "email", required: true, className: "search-input", style: { width: "100%", padding: "10px" }, value: newAdminEmail, onChange: (e) => setNewAdminEmail(e.target.value), placeholder: "admin@ecole.com" })), /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { marginBottom: "24px" } }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontWeight: 500, marginBottom: "8px" } }, "Mot de passe provisoire"), /* @__PURE__ */ React.createElement("input", { type: "password", required: true, className: "search-input", style: { width: "100%", padding: "10px" }, value: newAdminPassword, onChange: (e) => setNewAdminPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })), adminMessage && /* @__PURE__ */ React.createElement("div", { style: { padding: "12px", background: adminMessage.includes("succ\xE8s") ? "#ECFDF5" : "#FEF2F2", color: adminMessage.includes("succ\xE8s") ? "#059669" : "#EF4444", borderRadius: "8px", marginBottom: "24px", fontSize: "14px" } }, adminMessage), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn-outline", style: { padding: "10px 24px", display: "flex", alignItems: "center", gap: "8px" } }, /* @__PURE__ */ React.createElement(Users, { size: 18 }), " Cr\xE9er l'acc\xE8s administrateur")), adminsList.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: "32px" } }, /* @__PURE__ */ React.createElement("h4", { style: { marginBottom: "16px", fontSize: "15px" } }, "Administrateurs existants"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "12px" } }, adminsList.map((admin, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", border: "1px solid var(--border-light)", borderRadius: "8px", background: "#F8FAFC" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 500, color: "var(--text-main)", marginBottom: "4px" } }, admin.username), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "12px", color: "var(--text-muted)" } }, "Mot de passe : ", admin.password)), isDirector && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "12px" } }, /* @__PURE__ */ React.createElement("button", { type: "button", style: { background: "none", border: "none", cursor: "pointer", fontSize: "18px" }, onClick: () => setAdminToEdit({ id: admin.id, email: admin.username, password: admin.password }), title: "Modifier" }, "\u270F\uFE0F"), /* @__PURE__ */ React.createElement("button", { type: "button", style: { background: "none", border: "none", cursor: "pointer", fontSize: "18px" }, onClick: () => setAdminToDelete(admin.id), title: "Supprimer" }, "\u{1F5D1}\uFE0F"))))))), adminToEdit && /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1e3, backdropFilter: "blur(4px)" } }, /* @__PURE__ */ React.createElement("div", { className: "app-card animate-scale-in", style: { width: "400px", padding: "32px" } }, /* @__PURE__ */ React.createElement("h3", { style: { marginBottom: "24px" } }, "Modifier l'administrateur"), /* @__PURE__ */ React.createElement("form", { onSubmit: saveEditedAdmin }, /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { marginBottom: "16px" } }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontWeight: 500, marginBottom: "8px" } }, "Adresse Email"), /* @__PURE__ */ React.createElement("input", { type: "email", required: true, className: "search-input", style: { width: "100%", padding: "10px" }, value: adminToEdit.email, onChange: (e) => setAdminToEdit({ ...adminToEdit, email: e.target.value }) })), /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { marginBottom: "24px" } }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontWeight: 500, marginBottom: "8px" } }, "Nouveau mot de passe"), /* @__PURE__ */ React.createElement("input", { type: "text", required: true, className: "search-input", style: { width: "100%", padding: "10px" }, value: adminToEdit.password, onChange: (e) => setAdminToEdit({ ...adminToEdit, password: e.target.value }) })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "12px", justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-outline", onClick: () => setAdminToEdit(null) }, "Annuler"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn-primary" }, "Enregistrer"))))), adminToDelete && /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1e3, backdropFilter: "blur(4px)" } }, /* @__PURE__ */ React.createElement("div", { className: "app-card animate-scale-in", style: { width: "400px", padding: "32px", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#FEF2F2", width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#EF4444" } }, /* @__PURE__ */ React.createElement(AlertCircle, { size: 32 })), /* @__PURE__ */ React.createElement("h3", { style: { marginBottom: "16px" } }, "Confirmer la suppression"), /* @__PURE__ */ React.createElement("p", { style: { color: "var(--text-muted)", marginBottom: "32px" } }, "Voulez-vous vraiment supprimer cet acc\xE8s ? Cette action est irr\xE9versible."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "12px", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-outline", onClick: () => setAdminToDelete(null) }, "Annuler"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-primary", style: { background: "#EF4444", borderColor: "#EF4444" }, onClick: confirmDeleteAdmin }, "Supprimer")))));
};
const SettingsTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTeachers = async () => {
      const { data, error } = await supabase.from("teachers").select("*");
      if (data) {
        data.sort((a, b) => a.name.localeCompare(b.name));
        setTeachers(data);
      }
      setLoading(false);
    };
    fetchTeachers();
  }, []);
  const [newName, setNewName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [currentClass, setCurrentClass] = useState("");
  const [currentSubject, setCurrentSubject] = useState("");
  const [currentDay, setCurrentDay] = useState("");
  const [currentHour, setCurrentHour] = useState("");
  const [message, setMessage] = useState("");
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
  const handlePrint = () => {
    window.print();
  };
  const generateWhatsappLink = (teacher) => {
    if (!teacher.whatsapp) return "#";
    let phone = teacher.whatsapp.replace(/\s+/g, "");
    if (phone.startsWith("+")) phone = phone.substring(1);
    let text = `Bonjour ${teacher.name}, voici vos affectations :

`;
    if (teacher.assignments && teacher.assignments.length > 0) {
      teacher.assignments.forEach((a) => {
        text += `- Classe: ${a.class} | Cours: ${a.subject === "-" ? "Tous" : a.subject} | Jour: ${a.day === "-" ? "Tous" : a.day} | Heure: ${a.hour}
`;
      });
    } else {
      text += "(Aucune affectation pr\xE9cise)\n";
    }
    text += `
(Les identifiants ne sont pas inclus pour des raisons de confidentialit\xE9)

Cordialement, La Direction.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };
  const PREDEFINED_DAYS = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche"
  ];
  const PREDEFINED_HOURS = [
    "1\xE8re heure",
    "2\xE8me heure",
    "3\xE8me heure",
    "4\xE8me heure",
    "5\xE8me heure",
    "6\xE8me heure",
    "7\xE8me heure",
    "8\xE8me heure",
    "9\xE8me heure",
    "10\xE8me heure"
  ];
  const PREDEFINED_SUBJECTS = [
    "Cours Primaire",
    "Math\xE9matiques",
    "Physique-Chimie",
    "SVT",
    "Philosophie",
    "Anglais",
    "Fran\xE7ais",
    "Histoire-G\xE9o",
    "ECM",
    "Allemand",
    "Espagnol",
    "EPS"
  ];
  const PREDEFINED_CLASSES = [
    "CEI1",
    "CEI2",
    "CP1",
    "CP2",
    "CE1",
    "CE2",
    "CM1",
    "CM2",
    "6\xE8me",
    "5\xE8me",
    "4\xE8me",
    "3\xE8me",
    "Seconde A",
    "Seconde C",
    "Seconde D",
    "Premi\xE8re A",
    "Premi\xE8re C",
    "Premi\xE8re D",
    "Terminale A",
    "Terminale C",
    "Terminale D"
  ];
  const handleAddAssignment = () => {
    if (!currentClass) {
      alert("Veuillez s\xE9lectionner au moins une classe.");
      return;
    }
    setAssignments([...assignments, {
      class: currentClass,
      subject: currentSubject || "-",
      day: currentDay || "-",
      hour: currentHour || "-"
    }]);
    setCurrentClass("");
    setCurrentSubject("");
    setCurrentDay("");
    setCurrentHour("");
  };
  const handleRemoveAssignment = (index) => {
    setAssignments(assignments.filter((_, i) => i !== index));
  };
  const handleAddTeacher = async (e) => {
    e.preventDefault();
    if (!newName) return;
    let finalAssignments = [...assignments];
    if (currentClass) {
      finalAssignments.push({ class: currentClass, subject: currentSubject || "-", day: currentDay || "-", hour: currentHour || "-" });
    }
    if (finalAssignments.length === 0) {
      alert("Veuillez ajouter au moins une affectation (classe/cours) au tableau.");
      return;
    }
    const uniqueClasses = [...new Set(finalAssignments.map((a) => a.class))];
    const uniqueSubjects = [...new Set(finalAssignments.map((a) => a.subject).filter((s) => s !== "-"))];
    const uniqueDays = [...new Set(finalAssignments.map((a) => a.day).filter((d) => d !== "-"))];
    const uniqueHours = [...new Set(finalAssignments.map((a) => a.hour).filter((h) => h !== "-"))];
    if (editingTeacherId) {
      const { data, error } = await supabase.from("teachers").update({
        name: newName,
        whatsapp,
        assignments: finalAssignments,
        classes: uniqueClasses,
        subjects: uniqueSubjects,
        days: uniqueDays,
        hours: uniqueHours
      }).eq("id", editingTeacherId).select();
      if (!error && data) {
        let updated = teachers.map((t) => t.id === editingTeacherId ? data[0] : t);
        updated.sort((a, b) => a.name.localeCompare(b.name));
        setTeachers(updated);
        setMessage(`Enseignant ${newName} mis \xE0 jour avec succ\xE8s.`);
      }
    } else {
      const newId = `ENS-${String(teachers.length + 1).padStart(3, "0")}`;
      const newPassword = Math.floor(1e3 + Math.random() * 9e3).toString();
      const newTeacher = {
        id: newId,
        name: newName,
        whatsapp,
        password: newPassword,
        assignments: finalAssignments,
        classes: uniqueClasses,
        subjects: uniqueSubjects,
        days: uniqueDays,
        hours: uniqueHours
      };
      const { data, error } = await supabase.from("teachers").insert([newTeacher]).select();
      if (!error && data) {
        let updated = [...teachers, data[0]];
        updated.sort((a, b) => a.name.localeCompare(b.name));
        setTeachers(updated);
        setMessage(`Enseignant ajout\xE9 ! ID: ${newId} | Mdp: ${newPassword}`);
      }
    }
    setNewName("");
    setWhatsapp("");
    setAssignments([]);
    setCurrentClass("");
    setCurrentSubject("");
    setCurrentDay("");
    setCurrentHour("");
    setEditingTeacherId(null);
    setTimeout(() => setMessage(""), 1e4);
  };
  const handleEditTeacher = (teacher) => {
    setNewName(teacher.name || "");
    setWhatsapp(teacher.whatsapp || "");
    setAssignments(teacher.assignments || []);
    setEditingTeacherId(teacher.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleDeleteTeacher = (teacher) => {
    setTeacherToDelete(teacher);
  };
  const confirmDeleteTeacher = async () => {
    if (teacherToDelete) {
      const { error } = await supabase.from("teachers").delete().eq("id", teacherToDelete.id);
      if (!error) {
        setTeachers(teachers.filter((t) => t.id !== teacherToDelete.id));
        setTeacherToDelete(null);
      }
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "welcome-section animate-fade-in-up", style: { background: "white", padding: "32px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)" } }, /* @__PURE__ */ React.createElement("h2", { style: { marginBottom: "8px" } }, "Gestion des enseignants"), /* @__PURE__ */ React.createElement("p", { style: { color: "var(--text-muted)", marginBottom: "32px" } }, "Ajoutez des enseignants, leurs cours et attribuez-leur des classes."), /* @__PURE__ */ React.createElement("form", { onSubmit: handleAddTeacher, style: { maxWidth: "600px", marginBottom: "40px" } }, /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { marginBottom: "16px" } }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontWeight: 500, marginBottom: "8px" } }, "Nom complet de l'enseignant"), /* @__PURE__ */ React.createElement("input", { type: "text", className: "search-input", value: newName, onChange: (e) => setNewName(e.target.value), placeholder: "Ex: Jean Dupont", style: { width: "100%", padding: "10px" }, required: true })), /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { marginBottom: "16px" } }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontWeight: 500, marginBottom: "8px" } }, "Num\xE9ro WhatsApp ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text-muted)", fontSize: "12px" } }, "(Optionnel)")), /* @__PURE__ */ React.createElement("input", { type: "tel", className: "search-input", value: whatsapp, onChange: (e) => setWhatsapp(e.target.value), placeholder: "Ex: +33 6 12 34 56 78", style: { width: "100%", padding: "10px" } })), /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { marginBottom: "24px" } }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontWeight: 500, marginBottom: "12px" } }, "Affectations (Classe, Cours, Heure) ", /* @__PURE__ */ React.createElement("span", { style: { color: "red" } }, "*")), /* @__PURE__ */ React.createElement("div", { style: { padding: "16px", border: "1px solid var(--border-light)", borderRadius: "8px", background: "#F8FAFC", marginBottom: "16px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: "1 1 120px" } }, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: "12px", marginBottom: "4px", color: "var(--text-muted)" } }, "Classe"), /* @__PURE__ */ React.createElement("select", { className: "search-input", value: currentClass, onChange: (e) => setCurrentClass(e.target.value), style: { width: "100%", padding: "8px" } }, /* @__PURE__ */ React.createElement("option", { value: "" }, "S\xE9lectionner"), PREDEFINED_CLASSES.map((c) => /* @__PURE__ */ React.createElement("option", { key: c, value: c }, c)))), /* @__PURE__ */ React.createElement("div", { style: { flex: "1 1 120px" } }, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: "12px", marginBottom: "4px", color: "var(--text-muted)" } }, "Cours (Opt.)"), /* @__PURE__ */ React.createElement("select", { className: "search-input", value: currentSubject, onChange: (e) => setCurrentSubject(e.target.value), style: { width: "100%", padding: "8px" } }, /* @__PURE__ */ React.createElement("option", { value: "" }, "Aucun"), PREDEFINED_SUBJECTS.map((s) => /* @__PURE__ */ React.createElement("option", { key: s, value: s }, s)))), /* @__PURE__ */ React.createElement("div", { style: { flex: "1 1 120px" } }, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: "12px", marginBottom: "4px", color: "var(--text-muted)" } }, "Jour (Opt.)"), /* @__PURE__ */ React.createElement("select", { className: "search-input", value: currentDay, onChange: (e) => setCurrentDay(e.target.value), style: { width: "100%", padding: "8px" } }, /* @__PURE__ */ React.createElement("option", { value: "" }, "Aucun"), PREDEFINED_DAYS.map((d) => /* @__PURE__ */ React.createElement("option", { key: d, value: d }, d)))), /* @__PURE__ */ React.createElement("div", { style: { flex: "1 1 120px" } }, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: "12px", marginBottom: "4px", color: "var(--text-muted)" } }, "Heure (Opt.)"), /* @__PURE__ */ React.createElement("select", { className: "search-input", value: currentHour, onChange: (e) => setCurrentHour(e.target.value), style: { width: "100%", padding: "8px" } }, /* @__PURE__ */ React.createElement("option", { value: "" }, "Aucune"), PREDEFINED_HOURS.map((h) => /* @__PURE__ */ React.createElement("option", { key: h, value: h }, h)))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-outline", onClick: handleAddAssignment, style: { padding: "8px 16px", height: "37px", borderColor: "var(--color-primary)", color: "var(--color-primary)" } }, "+ Ajouter")))), assignments.length > 0 && /* @__PURE__ */ React.createElement("table", { style: { width: "100%", fontSize: "13px", borderCollapse: "collapse", border: "1px solid var(--border-light)" } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bg-app)", borderBottom: "1px solid #E2E8F0" } }, /* @__PURE__ */ React.createElement("th", { style: { padding: "12px", textAlign: "left", fontWeight: 600 } }, "Classe"), /* @__PURE__ */ React.createElement("th", { style: { padding: "12px", textAlign: "left", fontWeight: 600 } }, "Cours"), /* @__PURE__ */ React.createElement("th", { style: { padding: "12px", textAlign: "left", fontWeight: 600 } }, "Jour"), /* @__PURE__ */ React.createElement("th", { style: { padding: "12px", textAlign: "left", fontWeight: 600 } }, "Heure"), /* @__PURE__ */ React.createElement("th", { style: { padding: "12px", textAlign: "right", fontWeight: 600 } }, "Action"))), /* @__PURE__ */ React.createElement("tbody", null, assignments.map((assignment, index) => /* @__PURE__ */ React.createElement("tr", { key: index, style: { borderBottom: "1px solid var(--border-light)", background: "white" } }, /* @__PURE__ */ React.createElement("td", { style: { padding: "12px", color: "var(--text-main)" } }, assignment.class), /* @__PURE__ */ React.createElement("td", { style: { padding: "12px", color: "var(--text-muted)" } }, assignment.subject), /* @__PURE__ */ React.createElement("td", { style: { padding: "12px", color: "var(--text-muted)" } }, assignment.day), /* @__PURE__ */ React.createElement("td", { style: { padding: "12px", color: "var(--text-muted)" } }, assignment.hour), /* @__PURE__ */ React.createElement("td", { style: { padding: "12px", textAlign: "right" } }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => handleRemoveAssignment(index), style: { background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: "18px" } }, "\xD7"))))))), message && /* @__PURE__ */ React.createElement("div", { style: { padding: "16px", background: "#ECFDF5", color: "#059669", borderRadius: "8px", marginBottom: "24px", fontSize: "15px", fontWeight: 500, border: "1px solid #10B981" } }, "\u2705 ", message), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "12px" } }, /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn-primary", style: { padding: "10px 24px", display: "flex", alignItems: "center", gap: "8px" } }, editingTeacherId ? "Mettre \xE0 jour l'enseignant" : "+ Ajouter l'enseignant"), editingTeacherId && /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-outline", onClick: () => {
    setEditingTeacherId(null);
    setNewName("");
    setWhatsapp("");
    setAssignments([]);
  }, style: { padding: "10px 24px" } }, "Annuler"))), teachers.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { borderTop: "1px solid var(--border-light)", paddingTop: "32px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" } }, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: "18px", margin: 0 } }, "Enseignants enregistr\xE9s (", teachers.length, ")"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "12px" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-outline", onClick: handlePrint, style: { display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px" } }, /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("polyline", { points: "6 9 6 2 18 2 18 9" }), /* @__PURE__ */ React.createElement("path", { d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" }), /* @__PURE__ */ React.createElement("rect", { x: "6", y: "14", width: "12", height: "8" })), "Imprimer"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-primary", onClick: () => setShowWhatsappModal(true), style: { display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "#25D366", borderColor: "#25D366" } }, /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" })), "WhatsApp"))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" } }, [...teachers].sort((a, b) => a.name.localeCompare(b.name)).map((teacher) => /* @__PURE__ */ React.createElement("div", { key: teacher.id, style: { padding: "16px", border: "1px solid var(--border-light)", borderRadius: "8px", background: "#F8FAFC" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, color: "var(--text-main)", fontSize: "16px" } }, teacher.name), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px" } }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => handleEditTeacher(teacher), style: { background: "none", border: "none", cursor: "pointer", color: "var(--color-primary)", padding: "4px" }, title: "Modifier" }, /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }), /* @__PURE__ */ React.createElement("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" }))), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => handleDeleteTeacher(teacher), style: { background: "none", border: "none", cursor: "pointer", color: "#EF4444", padding: "4px" }, title: "Supprimer" }, /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ React.createElement("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }))))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px", color: "var(--color-primary)", fontWeight: 500, marginBottom: "4px" } }, "ID: ", teacher.id), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px" } }, "Mdp: ", teacher.password), teacher.whatsapp && /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "4px" } }, /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" })), teacher.whatsapp), teacher.assignments && teacher.assignments.length > 0 ? /* @__PURE__ */ React.createElement("table", { style: { width: "100%", fontSize: "12px", borderCollapse: "collapse", border: "1px solid var(--border-light)", marginTop: "8px" } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" } }, /* @__PURE__ */ React.createElement("th", { style: { padding: "6px", textAlign: "left", fontWeight: 600, color: "#475569" } }, "Classe"), /* @__PURE__ */ React.createElement("th", { style: { padding: "6px", textAlign: "left", fontWeight: 600, color: "#475569" } }, "Cours"), /* @__PURE__ */ React.createElement("th", { style: { padding: "6px", textAlign: "left", fontWeight: 600, color: "#475569" } }, "Jour"), /* @__PURE__ */ React.createElement("th", { style: { padding: "6px", textAlign: "left", fontWeight: 600, color: "#475569" } }, "Heure"))), /* @__PURE__ */ React.createElement("tbody", null, teacher.assignments.map((a, i) => /* @__PURE__ */ React.createElement("tr", { key: i, style: { borderBottom: "1px solid #E2E8F0", background: "white" } }, /* @__PURE__ */ React.createElement("td", { style: { padding: "6px" } }, a.class), /* @__PURE__ */ React.createElement("td", { style: { padding: "6px", color: a.subject === "-" ? "#94A3B8" : "inherit" } }, a.subject === "-" ? "Aucun" : a.subject), /* @__PURE__ */ React.createElement("td", { style: { padding: "6px", color: a.day === "-" ? "#94A3B8" : "inherit" } }, a.day === "-" ? "Aucun" : a.day), /* @__PURE__ */ React.createElement("td", { style: { padding: "6px", color: a.hour === "-" ? "#94A3B8" : "inherit" } }, a.hour))))) : /* @__PURE__ */ React.createElement(React.Fragment, null, teacher.subjects && teacher.subjects.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: "8px", fontSize: "13px", color: "var(--text-main)", background: "#F1F5F9", padding: "6px 10px", borderRadius: "6px", border: "1px solid #E2E8F0" } }, /* @__PURE__ */ React.createElement("strong", { style: { color: "#475569" } }, "Cours :"), " ", teacher.subjects.join(", ")), teacher.hours && teacher.hours.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: "12px", fontSize: "13px", color: "var(--text-main)", background: "#FFFBEB", padding: "6px 10px", borderRadius: "6px", border: "1px solid #FEF3C7" } }, /* @__PURE__ */ React.createElement("strong", { style: { color: "#B45309" } }, "Heures :"), " ", teacher.hours.join(", ")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: "6px" } }, teacher.classes && teacher.classes.map((c, i) => /* @__PURE__ */ React.createElement("span", { key: i, style: { background: "white", border: "1px solid #CBD5E1", padding: "2px 10px", borderRadius: "12px", fontSize: "12px", color: "#334155", fontWeight: 500 } }, c)))))))), teacherToDelete && /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1e3 } }, /* @__PURE__ */ React.createElement("div", { style: { background: "white", padding: "32px", borderRadius: "12px", maxWidth: "400px", width: "100%", textAlign: "center", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" } }, /* @__PURE__ */ React.createElement("div", { style: { width: "64px", height: "64px", background: "#FEE2E2", color: "#EF4444", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" } }, /* @__PURE__ */ React.createElement(AlertCircle, { size: 32 })), /* @__PURE__ */ React.createElement("h3", { style: { marginBottom: "16px" } }, "Confirmer la suppression"), /* @__PURE__ */ React.createElement("p", { style: { color: "var(--text-muted)", marginBottom: "32px" } }, "Voulez-vous vraiment supprimer l'enseignant ", /* @__PURE__ */ React.createElement("strong", null, teacherToDelete.name), " ? Cette action est irr\xE9versible."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "12px", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-outline", onClick: () => setTeacherToDelete(null) }, "Annuler"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-primary", style: { background: "#EF4444", borderColor: "#EF4444" }, onClick: confirmDeleteTeacher }, "Supprimer")))), showWhatsappModal && /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1e3 } }, /* @__PURE__ */ React.createElement("div", { style: { background: "white", padding: "24px", borderRadius: "12px", maxWidth: "500px", width: "100%", maxHeight: "80vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" } }, /* @__PURE__ */ React.createElement("h3", { style: { margin: 0 } }, "Envoyer par WhatsApp"), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowWhatsappModal(false), style: { background: "none", border: "none", cursor: "pointer", fontSize: "20px" } }, "\u2715")), /* @__PURE__ */ React.createElement("p", { style: { color: "var(--text-muted)", marginBottom: "16px", fontSize: "14px" } }, `Cliquez sur "Envoyer" pour ouvrir WhatsApp pr\xE9-rempli pour chaque enseignant. (L'ID et mot de passe ne sont pas inclus).`), /* @__PURE__ */ React.createElement("div", { style: { overflowY: "auto", flex: 1, paddingRight: "8px" } }, teachers.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "20px", color: "var(--text-muted)" } }, "Aucun enseignant") : [...teachers].sort((a, b) => a.name.localeCompare(b.name)).map((t) => /* @__PURE__ */ React.createElement("div", { key: t.id, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", borderBottom: "1px solid var(--border-light)" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 500 } }, t.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "12px", color: "var(--text-muted)" } }, t.whatsapp || "Pas de num\xE9ro")), t.whatsapp ? /* @__PURE__ */ React.createElement("a", { href: generateWhatsappLink(t), target: "_blank", rel: "noopener noreferrer", style: { display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", background: "#25D366", color: "white", borderRadius: "20px", textDecoration: "none", fontSize: "13px", fontWeight: 500 } }, /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M22 2L11 13" }), /* @__PURE__ */ React.createElement("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })), "Envoyer") : /* @__PURE__ */ React.createElement("span", { style: { fontSize: "12px", color: "#EF4444" } }, "Num\xE9ro manquant")))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: "16px", textAlign: "right" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-outline", onClick: () => setShowWhatsappModal(false) }, "Fermer")))), /* @__PURE__ */ React.createElement("div", { id: "print-section", style: { display: "none" } }, /* @__PURE__ */ React.createElement("h1", { style: { textAlign: "center", marginBottom: "24px" } }, "Fiche des Enseignants - Affectations"), /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: "12pt" } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { style: { border: "1px solid black", padding: "8px" } }, "Nom"), /* @__PURE__ */ React.createElement("th", { style: { border: "1px solid black", padding: "8px" } }, "WhatsApp"), /* @__PURE__ */ React.createElement("th", { style: { border: "1px solid black", padding: "8px" } }, "Affectations (Classe - Cours - Heure)"))), /* @__PURE__ */ React.createElement("tbody", null, [...teachers].sort((a, b) => a.name.localeCompare(b.name)).map((t) => /* @__PURE__ */ React.createElement("tr", { key: t.id }, /* @__PURE__ */ React.createElement("td", { style: { border: "1px solid black", padding: "8px", fontWeight: "bold" } }, t.name), /* @__PURE__ */ React.createElement("td", { style: { border: "1px solid black", padding: "8px" } }, t.whatsapp || "N/A"), /* @__PURE__ */ React.createElement("td", { style: { border: "1px solid black", padding: "8px" } }, t.assignments && t.assignments.length > 0 ? /* @__PURE__ */ React.createElement("ul", { style: { margin: 0, paddingLeft: "20px" } }, t.assignments.map((a, i) => /* @__PURE__ */ React.createElement("li", { key: i }, a.class, " | ", a.subject === "-" ? "Tous" : a.subject, " | ", a.hour))) : "Aucune")))))));
};
const DashboardOverview = ({ stats, formatCurrency, onViewStudent, currentFamilies = [] }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [historyDate, setHistoryDate] = useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
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
        password
      });
      if (signInError) throw signInError;
      if (data.user) {
        setIsUnlocked(true);
        setShowLogin(false);
        setError("");
        setResetMessage("");
      }
    } catch (err) {
      setError("Identifiants incorrects.");
      setResetMessage("");
    } finally {
      setLoading(false);
    }
  };
  const openForgotModal = () => {
    setShowForgotModal(true);
    setForgotEmail(email);
    setForgotMessage("");
  };
  const submitForgotPassword = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotMessage(`Un lien de renouvellement a \xE9t\xE9 envoy\xE9 \xE0 ${forgotEmail}. Vous pourrez y modifier votre mot de passe avant de revenir vous connecter.`);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "welcome-section animate-fade-in-up" }, /* @__PURE__ */ React.createElement("h1", null, "Bonjour, Directeur \u{1F44B}"), /* @__PURE__ */ React.createElement("p", null, "Voici un aper\xE7u financier \xE9l\xE9gant et en temps r\xE9el de votre \xE9tablissement."), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", marginTop: "32px" } }, !isUnlocked && /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(255, 255, 255, 0.4)",
        backdropFilter: "blur(8px)",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--radius-lg)",
        cursor: "pointer",
        border: "1px solid rgba(255,255,255,0.5)"
      },
      onClick: () => setShowLogin(true)
    },
    /* @__PURE__ */ React.createElement("div", { style: { background: "var(--color-primary)", padding: "16px", borderRadius: "50%", color: "white", marginBottom: "16px", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)", transition: "transform 0.2s" }, onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.1)", onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)" }, /* @__PURE__ */ React.createElement(Lock, { size: 32 })),
    /* @__PURE__ */ React.createElement("h3", { style: { margin: 0, color: "var(--text-main)" } }, "Section Financi\xE8re Verrouill\xE9e"),
    /* @__PURE__ */ React.createElement("p", { style: { color: "var(--text-main)", marginTop: "8px", fontWeight: 500 } }, "Cliquez pour d\xE9verrouiller")
  ), /* @__PURE__ */ React.createElement("div", { className: "students-grid stagger-children", style: { filter: !isUnlocked ? "blur(6px)" : "none", transition: "filter 0.3s ease", opacity: !isUnlocked ? 0.7 : 1, userSelect: !isUnlocked ? "none" : "auto", marginBottom: "32px" } }, /* @__PURE__ */ React.createElement("div", { className: "app-card" }, /* @__PURE__ */ React.createElement("div", { className: "card-top" }, /* @__PURE__ */ React.createElement("div", { className: "icon-wrapper" }, /* @__PURE__ */ React.createElement(DollarSign, { size: 24, color: "#059669" })), /* @__PURE__ */ React.createElement("span", { className: "trend-badge positive" }, "\u2197 +15.3%")), /* @__PURE__ */ React.createElement("h3", null, "Versement total per\xE7u"), /* @__PURE__ */ React.createElement("div", { className: "amount" }, formatCurrency(stats.totalPaid)), /* @__PURE__ */ React.createElement("div", { className: "progress-section" }, /* @__PURE__ */ React.createElement("div", { className: "progress-bar-bg" }, /* @__PURE__ */ React.createElement("div", { className: "progress-bar-fill success", style: { width: "77%" } })), /* @__PURE__ */ React.createElement("p", { className: "subtitle" }, "77% de l'objectif annuel atteint"))), /* @__PURE__ */ React.createElement("div", { className: "app-card" }, /* @__PURE__ */ React.createElement("div", { className: "card-top" }, /* @__PURE__ */ React.createElement("div", { className: "icon-wrapper" }, /* @__PURE__ */ React.createElement(AlertCircle, { size: 24, color: "#B45309" })), /* @__PURE__ */ React.createElement("span", { className: "trend-badge negative" }, "\u2198 \xE0 surveiller")), /* @__PURE__ */ React.createElement("h3", null, "Argent restant \xE0 payer"), /* @__PURE__ */ React.createElement("div", { className: "amount" }, formatCurrency(stats.totalRemaining)), /* @__PURE__ */ React.createElement("div", { className: "progress-section" }, /* @__PURE__ */ React.createElement("div", { className: "progress-bar-bg" }, /* @__PURE__ */ React.createElement("div", { className: "progress-bar-fill warning", style: { width: "23%" } })), /* @__PURE__ */ React.createElement("p", { className: "subtitle" }, "Impay\xE9s \xE0 recouvrer urgemment"))))), showLogin && !isUnlocked && /* @__PURE__ */ React.createElement("div", { className: "modal-overlay", style: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", zIndex: 1e3, display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { className: "modal-content animate-fade-in-up", style: { background: "white", padding: "32px", borderRadius: "20px", width: "100%", maxWidth: "400px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: "24px" } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#ECFDF5", width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "var(--color-primary)" } }, /* @__PURE__ */ React.createElement(Lock, { size: 32 })), /* @__PURE__ */ React.createElement("h3", { style: { fontSize: "20px", margin: "0 0 8px 0" } }, "D\xE9verrouiller les finances"), /* @__PURE__ */ React.createElement("p", { style: { color: "var(--text-muted)", fontSize: "14px", margin: 0 } }, "Veuillez vous authentifier")), /* @__PURE__ */ React.createElement("form", { onSubmit: handleUnlock }, /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { marginBottom: "16px" } }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px" } }, "Adresse email"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "email",
      className: "search-input",
      autoFocus: true,
      required: true,
      placeholder: "directeur@ecole.com",
      value: email,
      onChange: (e) => setEmail(e.target.value),
      style: { width: "100%", padding: "10px", border: "1px solid var(--border-light)", borderRadius: "8px" }
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { marginBottom: "8px" } }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px" } }, "Mot de passe"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "password",
      className: "search-input",
      required: true,
      placeholder: "1234",
      value: password,
      onChange: (e) => setPassword(e.target.value),
      style: { width: "100%", padding: "10px", border: "1px solid var(--border-light)", borderRadius: "8px" }
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right", marginBottom: "24px" } }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: openForgotModal, style: { background: "none", border: "none", color: "var(--color-primary)", fontSize: "13px", cursor: "pointer", padding: 0, fontWeight: 500 } }, "Mot de passe oubli\xE9 ?")), error && /* @__PURE__ */ React.createElement("div", { style: { color: "#EF4444", fontSize: "14px", marginBottom: "16px", textAlign: "center", background: "#FEF2F2", padding: "8px", borderRadius: "4px" } }, error), resetMessage && /* @__PURE__ */ React.createElement("div", { style: { color: "#059669", fontSize: "14px", marginBottom: "16px", textAlign: "center", background: "#ECFDF5", padding: "8px", borderRadius: "4px" } }, resetMessage), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "16px" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-outline", style: { flex: 1, padding: "10px", background: "transparent", border: "1px solid var(--border-light)", borderRadius: "8px", cursor: "pointer" }, onClick: () => {
    setShowLogin(false);
    setError("");
    setResetMessage("");
  }, disabled: loading }, "Annuler"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn-primary", style: { flex: 1, padding: "10px", background: "var(--color-primary)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 500 }, disabled: loading }, loading ? "V\xE9rification..." : "D\xE9verrouiller"))))), showForgotModal && /* @__PURE__ */ React.createElement("div", { className: "modal-overlay", style: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { className: "modal-content animate-fade-in-up", style: { background: "white", padding: "32px", borderRadius: "20px", width: "100%", maxWidth: "400px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: "24px" } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#EFF6FF", width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#3B82F6" } }, /* @__PURE__ */ React.createElement(Lock, { size: 32 })), /* @__PURE__ */ React.createElement("h3", { style: { fontSize: "20px", margin: "0 0 8px 0" } }, "Mot de passe oubli\xE9"), /* @__PURE__ */ React.createElement("p", { style: { color: "var(--text-muted)", fontSize: "14px", margin: 0 } }, "Entrez votre email pour recevoir le lien")), forgotMessage ? /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { color: "#059669", fontSize: "14px", marginBottom: "24px", background: "#ECFDF5", padding: "12px", borderRadius: "8px", lineHeight: 1.5 } }, forgotMessage), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-primary", style: { width: "100%", padding: "10px", background: "var(--color-primary)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 500 }, onClick: () => setShowForgotModal(false) }, "Fermer")) : /* @__PURE__ */ React.createElement("form", { onSubmit: submitForgotPassword }, /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { marginBottom: "24px" } }, /* @__PURE__ */ React.createElement("label", { className: "form-label", style: { display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px" } }, "Adresse email"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "email",
      className: "search-input",
      autoFocus: true,
      required: true,
      placeholder: "directeur@ecole.com",
      value: forgotEmail,
      onChange: (e) => setForgotEmail(e.target.value),
      style: { width: "100%", padding: "10px", border: "1px solid var(--border-light)", borderRadius: "8px" }
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "16px" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-outline", style: { flex: 1, padding: "10px", background: "transparent", border: "1px solid var(--border-light)", borderRadius: "8px", cursor: "pointer" }, onClick: () => setShowForgotModal(false) }, "Annuler"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn-primary", style: { flex: 1, padding: "10px", background: "var(--color-primary)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 500 } }, "Envoyer le lien"))))), /* @__PURE__ */ React.createElement("div", { className: "students-grid stagger-children", style: { animationDelay: "200ms", marginTop: "32px" } }, /* @__PURE__ */ React.createElement("div", { className: "app-card", style: { display: "flex", alignItems: "center", gap: "20px" } }, /* @__PURE__ */ React.createElement("div", { className: "stat-icon-soft blue" }, /* @__PURE__ */ React.createElement(Users, { size: 24 })), /* @__PURE__ */ React.createElement("div", { className: "stat-details" }, /* @__PURE__ */ React.createElement("h4", null, "Total \xC9l\xE8ves"), /* @__PURE__ */ React.createElement("span", { className: "stat-num" }, stats.totalStudents))), /* @__PURE__ */ React.createElement("div", { className: "app-card", style: { display: "flex", alignItems: "center", gap: "20px" } }, /* @__PURE__ */ React.createElement("div", { className: "stat-icon-soft purple" }, /* @__PURE__ */ React.createElement(Activity, { size: 24 })), /* @__PURE__ */ React.createElement("div", { className: "stat-details" }, /* @__PURE__ */ React.createElement("h4", null, "Recouvrement"), /* @__PURE__ */ React.createElement("span", { className: "stat-num" }, stats.collectionRate, "%"))), /* @__PURE__ */ React.createElement("div", { className: "app-card", style: { display: "flex", alignItems: "center", gap: "20px" } }, /* @__PURE__ */ React.createElement("div", { className: "stat-icon-soft green" }, /* @__PURE__ */ React.createElement(TrendingUp, { size: 24 })), /* @__PURE__ */ React.createElement("div", { className: "stat-details" }, /* @__PURE__ */ React.createElement("h4", null, "Paiements (Aujourd'hui)"), /* @__PURE__ */ React.createElement("span", { className: "stat-num" }, "12")))), (() => {
    const displayPayments = transactions.filter((t) => {
      if (!t.date) return false;
      const tDate = t.date.split("T")[0];
      return tDate === historyDate;
    });
    return /* @__PURE__ */ React.createElement("div", { className: "recent-transactions animate-fade-in-up", style: { animationDelay: "400ms", marginTop: "32px" } }, /* @__PURE__ */ React.createElement("div", { className: "section-header", style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("h3", null, "Derniers paiements enregistr\xE9s"), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", display: "inline-block" } }, /* @__PURE__ */ React.createElement("div", { className: "btn-outline btn-sm", style: { display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", background: "white" } }, /* @__PURE__ */ React.createElement(Calendar, { size: 16 }), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 500 } }, "Historique :"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "date",
        value: historyDate,
        onChange: (e) => setHistoryDate(e.target.value),
        style: {
          border: "none",
          outline: "none",
          background: "transparent",
          color: "var(--text-color)",
          fontFamily: "inherit",
          fontSize: "14px",
          cursor: "pointer"
        }
      }
    )))), /* @__PURE__ */ React.createElement("div", { className: "table-wrapper" }, /* @__PURE__ */ React.createElement("table", { className: "modern-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "\xC9l\xE8ve"), /* @__PURE__ */ React.createElement("th", null, "Classe"), /* @__PURE__ */ React.createElement("th", null, "Heure"), /* @__PURE__ */ React.createElement("th", null, "Montant"), /* @__PURE__ */ React.createElement("th", null, "Statut"), /* @__PURE__ */ React.createElement("th", { style: { width: "40px" } }))), /* @__PURE__ */ React.createElement("tbody", null, displayPayments.length > 0 ? displayPayments.map((payment, idx) => {
      const timeString = new Date(payment.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
      return /* @__PURE__ */ React.createElement("tr", { key: idx }, /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { className: "student-cell" }, /* @__PURE__ */ React.createElement("div", { className: "avatar-sm", style: { background: "var(--color-primary)" } }, payment.students?.name?.charAt(0).toUpperCase()), /* @__PURE__ */ React.createElement("span", null, payment.students?.name))), /* @__PURE__ */ React.createElement("td", null, payment.students?.grade), /* @__PURE__ */ React.createElement("td", null, timeString), /* @__PURE__ */ React.createElement("td", { className: "amount-cell" }, payment.amount.toLocaleString(), " FCFA"), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: "badge badge-success" }, "Valid\xE9")), /* @__PURE__ */ React.createElement("td", { style: { textAlign: "right" } }));
    }) : /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "6", style: { textAlign: "center", padding: "24px", color: "var(--text-muted)" } }, "Aucun paiement enregistr\xE9 pour cette date."))))));
  })());
};
const Dashboard = () => {
  const savedUser = localStorage.getItem("currentUser");
  const currentUser = savedUser ? JSON.parse(savedUser) : { role: "director" };
  const isDirector = currentUser.role === "director";
  const [activeTab, setActiveTab] = useState("overview");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [premiumState, setPremiumState] = useState(null);
  const [showPremiumBlocker, setShowPremiumBlocker] = useState(false);
  const [showPaymentSimulation, setShowPaymentSimulation] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [simPhoneNumber, setSimPhoneNumber] = useState("");
  const [simProcessing, setSimProcessing] = useState(false);
  const [directorProfile, setDirectorProfile] = useState({
    name: "M. le Directeur",
    email: "directeur@ecole.com",
    photo: "https://i.pravatar.cc/150?u=director"
  });
  useEffect(() => {
    const fetchPremiumStatusAndProfile = async () => {
      const { data: profileData } = await supabase.from("global_settings").select("data").eq("id", 1).single();
      if (profileData && profileData.data && profileData.data.directorProfile) {
        setDirectorProfile(profileData.data.directorProfile);
      }
      const { data, error } = await supabase.from("global_settings").select("data").eq("id", 3).single();
      let currentPremiumSettings = null;
      if (!data || error) {
        currentPremiumSettings = {
          firstConnectionDate: (/* @__PURE__ */ new Date()).toISOString(),
          isPremium: false
        };
        await supabase.from("global_settings").upsert([{ id: 3, data: currentPremiumSettings }]);
      } else {
        currentPremiumSettings = data.data;
      }
      const firstConn = new Date(currentPremiumSettings.firstConnectionDate);
      const today = /* @__PURE__ */ new Date();
      const diffTime = today.getTime() - firstConn.getTime();
      const diffDays = Math.floor(diffTime / (1e3 * 60 * 60 * 24));
      const daysLeft = 30 - diffDays;
      currentPremiumSettings.daysLeft = daysLeft;
      setPremiumState(currentPremiumSettings);
      if (!currentPremiumSettings.isPremium && daysLeft <= 0) {
        setTimeout(() => {
          setShowPremiumBlocker(true);
        }, 5e3);
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
      const { data: studentsData } = await supabase.from("students").select("*");
      const { data: paymentsData } = await supabase.from("payments").select("*");
      let actualTotalStudents = studentsData ? studentsData.length : 0;
      let actualTotalPaid = 0;
      let actualTotalRemaining = 0;
      if (paymentsData) {
        paymentsData.forEach((payment) => {
          actualTotalPaid += payment.amount_paid || 0;
          const remaining = (payment.amount || 0) - (payment.amount_paid || 0);
          if (remaining > 0) {
            actualTotalRemaining += remaining;
          }
        });
      }
      const actualCollectionRate = actualTotalPaid + actualTotalRemaining > 0 ? Math.round(actualTotalPaid / (actualTotalPaid + actualTotalRemaining) * 100) : 0;
      setStats({
        totalPaid: actualTotalPaid,
        totalRemaining: actualTotalRemaining,
        totalStudents: actualTotalStudents,
        collectionRate: actualCollectionRate
      });
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
    const { data: families } = await supabase.from("families").select("*").ilike("parent_name", `%${value}%`);
    const { data: students } = await supabase.from("students").select("*, families(parent_name)").ilike("name", `%${value}%`);
    const results = [];
    if (families) {
      families.forEach((family) => {
        results.push({ type: "parent", name: family.parent_name, familyId: family.id });
      });
    }
    if (students) {
      students.forEach((student) => {
        results.push({ type: "student", name: student.name, familyId: student.family_id, parentName: student.families?.parent_name });
      });
    }
    setSearchResults(results);
    setShowSuggestions(true);
  };
  const handleSuggestionClick = (result) => {
    setSearchQuery(result.name);
    setShowSuggestions(false);
    setActiveTab("students");
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF" }).format(amount);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "dashboard-container" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: `sidebar-overlay ${isMobileMenuOpen ? "open" : ""}`,
      onClick: () => setIsMobileMenuOpen(false)
    }
  ), /* @__PURE__ */ React.createElement("aside", { className: `premium-sidebar ${isMobileMenuOpen ? "open" : ""}` }, /* @__PURE__ */ React.createElement("div", { className: "sidebar-logo" }, /* @__PURE__ */ React.createElement("div", { className: "logo-icon" }, "E"), /* @__PURE__ */ React.createElement("h2", null, "EduPay"), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "hamburger-btn",
      style: { marginLeft: "auto", display: isMobileMenuOpen ? "flex" : "none", color: "white" },
      onClick: () => setIsMobileMenuOpen(false)
    },
    /* @__PURE__ */ React.createElement(X, { size: 24 })
  )), /* @__PURE__ */ React.createElement("nav", { className: "sidebar-nav" }, /* @__PURE__ */ React.createElement("a", { href: "#", className: `nav-item ${activeTab === "overview" ? "active" : ""}`, onClick: (e) => {
    e.preventDefault();
    setActiveTab("overview");
    setIsMobileMenuOpen(false);
  } }, /* @__PURE__ */ React.createElement("span", { className: "nav-icon" }, "\u{1F4CA}"), " Tableau de bord"), /* @__PURE__ */ React.createElement("a", { href: "#", className: `nav-item ${activeTab === "students" ? "active" : ""}`, onClick: (e) => {
    e.preventDefault();
    setActiveTab("students");
    setIsMobileMenuOpen(false);
  } }, /* @__PURE__ */ React.createElement("span", { className: "nav-icon" }, "\u{1F465}"), " Liste des \xE9l\xE8ves"), /* @__PURE__ */ React.createElement("a", { href: "#", className: `nav-item ${activeTab === "payments" ? "active" : ""}`, onClick: (e) => {
    e.preventDefault();
    setActiveTab("payments");
    setIsMobileMenuOpen(false);
  } }, /* @__PURE__ */ React.createElement("span", { className: "nav-icon" }, "\u{1F4B3}"), " Paiements"), /* @__PURE__ */ React.createElement("div", { className: "nav-group" }, /* @__PURE__ */ React.createElement("a", { href: "#", className: `nav-item ${activeTab.startsWith("settings") ? "active" : ""}`, onClick: (e) => {
    e.preventDefault();
    setIsSettingsOpen(!isSettingsOpen);
  } }, /* @__PURE__ */ React.createElement("span", { className: "nav-icon" }, "\u2699\uFE0F"), " Param\xE8tres", /* @__PURE__ */ React.createElement(ChevronDown, { size: 16, style: { marginLeft: "auto", transform: isSettingsOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" } })), isSettingsOpen && /* @__PURE__ */ React.createElement("div", { className: "sub-nav animate-fade-in-up", style: { paddingLeft: "40px", display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" } }, /* @__PURE__ */ React.createElement(
    "a",
    {
      href: "#",
      className: `nav-item ${activeTab === "settings-plan" ? "active" : ""}`,
      style: { fontSize: "14px", padding: "8px 12px", minHeight: "auto", whiteSpace: "nowrap" },
      onClick: (e) => {
        e.preventDefault();
        setActiveTab("settings-plan");
        setIsMobileMenuOpen(false);
      }
    },
    "Plan"
  ), /* @__PURE__ */ React.createElement(
    "a",
    {
      href: "#",
      className: `nav-item ${activeTab === "settings-bulletin" ? "active" : ""}`,
      style: { fontSize: "14px", padding: "8px 12px", minHeight: "auto", whiteSpace: "nowrap" },
      onClick: (e) => {
        e.preventDefault();
        setActiveTab("settings-bulletin");
        setIsMobileMenuOpen(false);
      }
    },
    "Param\xE9trage bulletin"
  ), /* @__PURE__ */ React.createElement(
    "a",
    {
      href: "#",
      className: `nav-item ${activeTab === "settings-teachers" ? "active" : ""}`,
      style: { fontSize: "14px", padding: "8px 12px", minHeight: "auto", whiteSpace: "nowrap" },
      onClick: (e) => {
        e.preventDefault();
        setActiveTab("settings-teachers");
        setIsMobileMenuOpen(false);
      }
    },
    "Gestion des enseignants"
  ), /* @__PURE__ */ React.createElement(
    "a",
    {
      href: "#",
      className: `nav-item ${activeTab === "settings-personal" ? "active" : ""}`,
      style: { fontSize: "14px", padding: "8px 12px", minHeight: "auto", whiteSpace: "nowrap" },
      onClick: (e) => {
        e.preventDefault();
        setActiveTab("settings-personal");
        setIsMobileMenuOpen(false);
      }
    },
    "Informations personnelles"
  ))))), /* @__PURE__ */ React.createElement("main", { className: "dashboard-main" }, /* @__PURE__ */ React.createElement("header", { className: "dashboard-header", style: { position: "relative" } }, /* @__PURE__ */ React.createElement("button", { className: "hamburger-btn", onClick: () => setIsMobileMenuOpen(true) }, /* @__PURE__ */ React.createElement(Menu, { size: 24 })), /* @__PURE__ */ React.createElement("div", { className: "search-bar-container", style: { position: "relative" } }), premiumState && !premiumState.isPremium && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", zIndex: 20 } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setShowPaymentSimulation(true),
      style: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: premiumState.daysLeft > 5 ? "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)" : "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)",
        color: premiumState.daysLeft > 5 ? "#92400E" : "#B91C1C",
        border: `1px solid ${premiumState.daysLeft > 5 ? "#FCD34D" : "#FCA5A5"}`,
        padding: "6px 16px",
        borderRadius: "24px",
        fontSize: "13px",
        fontWeight: 700,
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        outline: "none"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0,0,0,0.1)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)";
      }
    },
    /* @__PURE__ */ React.createElement(Crown, { size: 16, color: premiumState.daysLeft > 5 ? "#D97706" : "#DC2626" }),
    "Essai Gratuit - Reste ",
    premiumState.daysLeft > 0 ? premiumState.daysLeft : 0,
    " jour(s)"
  )), /* @__PURE__ */ React.createElement("div", { className: "header-actions" }, /* @__PURE__ */ React.createElement("button", { className: "icon-btn" }, /* @__PURE__ */ React.createElement(Bell, { size: 20 }), /* @__PURE__ */ React.createElement("span", { className: "notification-dot" })), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "user-profile",
      style: { position: "relative", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" },
      onClick: () => setIsDropdownOpen(!isDropdownOpen)
    },
    /* @__PURE__ */ React.createElement(
      "img",
      {
        src: currentUser.role === "admin" ? "https://i.pravatar.cc/150?u=admin" : directorProfile.photo,
        alt: "Profil",
        style: { width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border-light)" }
      }
    ),
    /* @__PURE__ */ React.createElement("div", { className: "user-info", style: { display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React.createElement("span", { className: "name", style: { fontWeight: 600, fontSize: "14px" } }, currentUser.role === "admin" ? currentUser.name : directorProfile.name), /* @__PURE__ */ React.createElement("span", { className: "role", style: { fontSize: "12px", color: "var(--text-muted)" } }, currentUser.role === "admin" ? "Administrateur" : "Directeur")),
    /* @__PURE__ */ React.createElement(ChevronDown, { size: 16, color: "var(--text-muted)", style: { marginLeft: "4px", transform: isDropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" } }),
    isDropdownOpen && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: "100%", right: 0, marginTop: "8px", background: "white", border: "1px solid var(--border-light)", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", minWidth: "200px", zIndex: 100, overflow: "hidden" } }, /* @__PURE__ */ React.createElement(
      "div",
      {
        style: { padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", transition: "background 0.2s" },
        onMouseEnter: (e) => e.currentTarget.style.background = "var(--bg-app)",
        onMouseLeave: (e) => e.currentTarget.style.background = "white",
        onClick: (e) => {
          e.stopPropagation();
          alert("Param\xE8tres de connexion \xE0 venir");
          setIsDropdownOpen(false);
        }
      },
      /* @__PURE__ */ React.createElement(Settings, { size: 16, color: "var(--text-muted)" }),
      /* @__PURE__ */ React.createElement("span", { style: { fontSize: "14px", color: "var(--text-main)" } }, "Param\xE8tres")
    ), /* @__PURE__ */ React.createElement(
      "div",
      {
        style: { padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", transition: "background 0.2s", borderTop: "1px solid var(--border-light)" },
        onMouseEnter: (e) => e.currentTarget.style.background = "#FEF2F2",
        onMouseLeave: (e) => e.currentTarget.style.background = "white",
        onClick: (e) => {
          e.stopPropagation();
          navigate("/login");
        }
      },
      /* @__PURE__ */ React.createElement(LogOut, { size: 16, color: "#EF4444" }),
      /* @__PURE__ */ React.createElement("span", { style: { fontSize: "14px", color: "#EF4444" } }, "D\xE9connexion")
    ))
  ))), /* @__PURE__ */ React.createElement("div", { className: "dashboard-content" }, activeTab === "overview" && /* @__PURE__ */ React.createElement(DashboardOverview, { stats, formatCurrency, currentFamilies, onViewStudent: (id) => {
    setActiveTab("students");
    localStorage.setItem("eduPaySelectedFamily", id);
  } }), activeTab === "students" && /* @__PURE__ */ React.createElement(StudentsList, { initialActiveFamilyId: localStorage.getItem("eduPaySelectedFamily") }), activeTab === "payments" && /* @__PURE__ */ React.createElement(PaymentsView, { currentFamilies }), activeTab === "settings-plan" && /* @__PURE__ */ React.createElement(SettingsPlan, null), activeTab === "settings-personal" && /* @__PURE__ */ React.createElement(SettingsPersonal, null), activeTab === "settings-teachers" && /* @__PURE__ */ React.createElement(SettingsTeachers, null), activeTab === "settings-bulletin" && /* @__PURE__ */ React.createElement(SettingsBulletin, null))), showPremiumBlocker && !showPaymentSimulation && /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(10px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { className: "animate-fade-in-up", style: { background: "white", padding: "40px", borderRadius: "16px", maxWidth: "480px", width: "90%", textAlign: "center", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#FEE2E2", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "#EF4444" } }, /* @__PURE__ */ React.createElement(Lock, { size: 40 })), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: "24px", fontWeight: 700, marginBottom: "16px", color: "#0F172A" } }, "P\xE9riode d'essai termin\xE9e"), /* @__PURE__ */ React.createElement("p", { style: { color: "#475569", marginBottom: "32px", lineHeight: 1.6 } }, "Votre p\xE9riode d'essai gratuit de 30 jours est arriv\xE9e \xE0 expiration. Pour continuer \xE0 profiter de toutes les fonctionnalit\xE9s d'Edu-Pay (gestion des \xE9l\xE8ves, recouvrements, impressions...), veuillez activer votre abonnement Premium."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "16px" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setShowPaymentSimulation(true), className: "btn-primary", style: { background: "#F59E0B", borderColor: "#F59E0B", fontSize: "16px", padding: "14px", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "20px" } }, "\u{1F4F1}"), " Payer par TMoney / Flooz"), /* @__PURE__ */ React.createElement("button", { onClick: () => alert("Veuillez contacter le support Edu-Pay \xE0 l'adresse support@edupay.com."), className: "btn-outline", style: { padding: "14px" } }, "Contacter l'administrateur")))), showPaymentSimulation && /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(12px)", zIndex: 1e4, display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { className: "animate-fade-in-up", style: { background: "white", padding: "32px", borderRadius: "16px", maxWidth: "400px", width: "90%", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" } }, /* @__PURE__ */ React.createElement("h3", { style: { margin: 0, fontSize: "20px", fontWeight: 700 } }, "Paiement S\xE9curis\xE9"), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowPaymentSimulation(false), style: { background: "none", border: "none", cursor: "pointer", fontSize: "24px", color: "#94A3B8" } }, "\u2715")), /* @__PURE__ */ React.createElement("div", { style: { background: "#F8FAFC", padding: "16px", borderRadius: "12px", marginBottom: "24px", border: "1px solid #E2E8F0" } }, /* @__PURE__ */ React.createElement("h4", { style: { margin: "0 0 12px 0", fontSize: "14px", color: "#475569" } }, "Choisissez votre plan"), /* @__PURE__ */ React.createElement(
    "div",
    {
      onClick: () => setSelectedPlan("monthly"),
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px",
        marginBottom: "8px",
        borderRadius: "8px",
        cursor: "pointer",
        border: selectedPlan === "monthly" ? "2px solid #10B981" : "1px solid #CBD5E1",
        background: selectedPlan === "monthly" ? "#ECFDF5" : "white"
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } }, /* @__PURE__ */ React.createElement("div", { style: { width: "16px", height: "16px", borderRadius: "50%", border: selectedPlan === "monthly" ? "4px solid #10B981" : "1px solid #94A3B8" } }), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600, color: "#0F172A" } }, "Mensuel")),
    /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: "#0F172A" } }, "5 000 FCFA")
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      onClick: () => setSelectedPlan("yearly"),
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px",
        borderRadius: "8px",
        cursor: "pointer",
        border: selectedPlan === "yearly" ? "2px solid #10B981" : "1px solid #CBD5E1",
        background: selectedPlan === "yearly" ? "#ECFDF5" : "white"
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } }, /* @__PURE__ */ React.createElement("div", { style: { width: "16px", height: "16px", borderRadius: "50%", border: selectedPlan === "yearly" ? "4px solid #10B981" : "1px solid #94A3B8" } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600, color: "#0F172A" } }, "Annuel"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: "11px", color: "#10B981", fontWeight: 600 } }, "\xC9conomisez 20 000 FCFA"))),
    /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: "#0F172A" } }, "40 000 FCFA")
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: (e) => {
        e.preventDefault();
        if (!window.FedaPay) {
          alert("L'outil de paiement n'est pas encore pr\xEAt. Veuillez patienter ou recharger la page.");
          return;
        }
        setSimProcessing(true);
        let widget = window.FedaPay.init({
          public_key: "pk_live_C2KkZEsYgriOFu-4NrbTM-t2",
          transaction: {
            amount: selectedPlan === "monthly" ? 5e3 : 4e4,
            description: "Abonnement Premium Edu-Pay (" + (selectedPlan === "monthly" ? "Mensuel" : "Annuel") + ")"
          },
          customer: {
            email: "directeur@edupay.com",
            lastname: "Directeur"
          },
          onComplete: async function(resp) {
            if (resp.reason === "CHECKOUT COMPLETE") {
              const newSettings = { ...premiumState, isPremium: true, plan: selectedPlan };
              await supabase.from("global_settings").upsert([{ id: 3, data: newSettings }]);
              setPremiumState(newSettings);
              setShowPremiumBlocker(false);
              setShowPaymentSimulation(false);
            } else {
              console.log("Paiement non finalis\xE9:", resp);
            }
            setSimProcessing(false);
          }
        });
        widget.open();
      },
      disabled: simProcessing,
      className: "btn-primary",
      style: { width: "100%", padding: "14px", fontSize: "16px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", background: simProcessing ? "#94A3B8" : "#10B981", borderColor: simProcessing ? "#94A3B8" : "#10B981" }
    },
    simProcessing ? "Ouverture..." : `Payer ${selectedPlan === "monthly" ? "5 000" : "40 000"} FCFA`
  )), /* @__PURE__ */ React.createElement("p", { style: { textAlign: "center", fontSize: "12px", color: "#94A3B8", marginTop: "16px" } }, "Paiement s\xE9curis\xE9 par FedaPay."))));
};
export default Dashboard;
