import React from 'react'
import './Profile.css'
import svg1 from '../../assets/crown.svg'
import PhotoUploader from '../shared/PhotoUploader.jsx'

const Profile = () => {

  const items = [
    {
      id: 1,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>,
      title: "Je souhaite un accompagnement personnalisé pour optimiser mon profil PermiFast",
      subtitle: "Service inclus pour les partenaires PermiFast",
      button: "Nous contacter",
    },
    {
      id: 2,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>,
      title: "Disponibilité de l'auto-école",
      checkbox: true,
    },
    {
      id: 3,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>,
      title: "Planning PermiFast",
      toggle: true,
    },
    {
      id: 4,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg>,
      title: "Code de la route exigé avant de commencer la conduite",
      toggle: true,
    },
  ];

  return (
    <>
      <div className="profile-container">

        <div className="head-img-wrapper">
          <h1 className="license-heading">PASSPERMIS FACILE</h1>
          <img src={svg1} alt="" />
        </div>

        {items.map((item) => (
          <div key={item.id} className="card-row">

            <div className="left">
              <span className="icon">{item.icon}</span>
              <div>
                <div className="title">{item.title}</div>
                <div className="info-badge1">i</div>
                {item.subtitle && (
                  <div className="subtitle">{item.subtitle}</div>
                )}
              </div>
            </div>

            <div className="right">
              {item.checkbox && (
                <label>
                  <input type="checkbox" className="check-box check-box-1" /> Disponible
                  <input type="checkbox" className="check-box check-box-2" /> Terminé
                </label>
              )}
              {item.status && (
                <span className="status">{item.status}</span>
              )}
              {item.toggle && (
                <input type="checkbox" className="toggle" />
              )}
              {item.button && (
                <button className="btn">{item.button}</button>
              )}
            </div>

          </div>
        ))}

        <div className="news-section">

          <div className="news-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>
            <h2 className="news-heading">Vos actualités</h2>
            <div className="info-badge2">i</div>
            <button className="btn news-btn">+ Ajouter une actualité</button>
          </div>

          <PhotoUploader />

          <div className="news-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
            <h2 className="news-heading">Mes points forts</h2>
            <div className="info-badge2">i</div>
            <button className="btn news-btn recommand-btn">
              <svg style={{ marginRight: '10px', paddingTop: '6px' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"></path><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"></path></svg>
              + Recommandez-nous un badge !
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default Profile;