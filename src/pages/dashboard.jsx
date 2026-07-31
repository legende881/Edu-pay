import React from 'react';
import { DollarSign, AlertCircle, Users, Activity, TrendingUp, Bell, Search } from 'lucide-react';

const Dashboard = () => {
  const stats = {
    totalPaid: 15450000,
    totalRemaining: 4500000,
    totalStudents: 125,
    collectionRate: 77
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Latérale (Mock pour l'esthétique globale) */}
      <aside className="premium-sidebar">
        <div className="sidebar-logo">
           <div className="logo-icon">E</div>
           <h2>EduPay</h2>
        </div>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <span className="nav-icon">📊</span> Tableau de bord
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">👥</span> Liste des élèves
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">💳</span> Paiements
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">⚙️</span> Paramètres
          </a>
        </nav>
      </aside>

      {/* Contenu Principal */}
      <main className="dashboard-main">
        {/* Barre de navigation supérieure */}
        <header className="dashboard-header">
           <div className="search-bar">
             <Search size={18} color="#94A3B8" />
             <input type="text" placeholder="Rechercher un élève, un paiement..." />
           </div>
           <div className="header-actions">
             <button className="icon-btn">
               <Bell size={20} />
               <span className="notification-dot"></span>
             </button>
             <div className="user-profile">
               <img src="https://i.pravatar.cc/150?u=director" alt="Profil Directeur" />
               <div className="user-info">
                 <span className="name">M. le Directeur</span>
                 <span className="role">Administrateur</span>
               </div>
             </div>
           </div>
        </header>

        {/* Cœur du Tableau de bord */}
        <div className="dashboard-content">
          <div className="welcome-section animate-fade-in-up">
            <h1>Bonjour, Directeur 👋</h1>
            <p>Voici un aperçu financier élégant et en temps réel de votre établissement.</p>
          </div>

          {/* Grandes Cartes Financières (Design Premium) */}
          <div className="premium-financial-grid stagger-children">
            {/* Carte Versement Total */}
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

            {/* Carte Argent Restant */}
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

          {/* Statistiques Secondaires (Glassmorphism) */}
          <div className="secondary-grid stagger-children" style={{ animationDelay: '200ms' }}>
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
          
          {/* Tableau des Transactions (Pour un look complet d'application) */}
          <div className="recent-transactions animate-fade-in-up" style={{ animationDelay: '400ms' }}>
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
                   </tr>
                 </thead>
                 <tbody>
                   <tr>
                     <td>
                       <div className="student-cell">
                         <div className="avatar-sm">A</div>
                         <span>Amadou Diallo</span>
                       </div>
                     </td>
                     <td>CM2</td>
                     <td>Aujourd'hui, 10:45</td>
                     <td className="amount-cell">50 000 FCFA</td>
                     <td><span className="badge badge-success">Validé</span></td>
                   </tr>
                   <tr>
                     <td>
                       <div className="student-cell">
                         <div className="avatar-sm" style={{background: '#8B5CF6'}}>S</div>
                         <span>Saran Kourouma</span>
                       </div>
                     </td>
                     <td>CE1</td>
                     <td>Hier, 15:30</td>
                     <td className="amount-cell">25 000 FCFA</td>
                     <td><span className="badge badge-success">Validé</span></td>
                   </tr>
                   <tr>
                     <td>
                       <div className="student-cell">
                         <div className="avatar-sm" style={{background: '#F59E0B'}}>K</div>
                         <span>Kofi Annan</span>
                       </div>
                     </td>
                     <td>6ème</td>
                     <td>Hier, 11:15</td>
                     <td className="amount-cell">75 000 FCFA</td>
                     <td><span className="badge badge-success">Validé</span></td>
                   </tr>
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
