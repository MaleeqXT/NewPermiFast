import { createContext, useContext, useState } from "react";

const AVATAR_COLORS = [
  "#6c8ebf","#d79b00","#82b366","#ae4132","#9673a6",
  "#23445d","#e07a5f","#3d405b","#81b29a","#f2cc8f"
];

const INITIAL_MONITORS = [
  { id:1, nom:"Llinas",     prenom:"Marianne",      would:"Toulouse", sector:"",                                                   status:"active",   photo:null },
  { id:2, nom:"Amouri",     prenom:"Abdelhak",      would:"Toulouse", sector:"",                                                   status:"active",   photo:null },
  { id:3, nom:"Elodie",     prenom:"Hellmuth",      would:"",         sector:"Fontaine Lestang and Mermoz (metro line A) - 31100", status:"onhold",   photo:null },
  { id:4, nom:"Hamdi",      prenom:"Mohamed-Amine", would:"Creil",    sector:"",                                                   status:"active",   photo:null },
  { id:5, nom:"Zayed",      prenom:"MESSAOUDENE",   would:"",         sector:"Creil",                                              status:"onhold",   photo:null },
  { id:6, nom:"MEGNOUCHE",  prenom:"MOHAMED",       would:"TOULOUSE", sector:"",                                                   status:"active",   photo:null },
  { id:7, nom:"Soula",      prenom:"Marie",         would:"BLAGNAC",  sector:"",                                                   status:"inactive", photo:null },
  { id:8, nom:"test",       prenom:"male",          would:"CREIL",    sector:"",                                                   status:"active",   photo:null },
  { id:9, nom:"Ali",        prenom:"Hasnain",       would:"CREIL",    sector:"",                                                   status:"active",   photo:null },
];

const MonitorsContext = createContext(null);

export function MonitorsProvider({ children }) {
  const [monitors, setMonitors] = useState(INITIAL_MONITORS);

  function addMonitor(formData, photo) {
    const locations = Array.isArray(formData.locations) ? formData.locations : [];
    const sector = locations.length
      ? locations.map(location => `${location.zoneName}: ${location.place}`).join(" | ")
      : formData.address || "";
    const newMonitor = {
      id: Date.now(),
      nom:    formData.lastName  || "",
      prenom: formData.firstName || "",
      would:  formData.would     || "",
      sector,
      status: (formData.status || "active").toLowerCase().replace(" ", ""),
      photo:  photo || null,
      email:  formData.email     || "",
      tel:    formData.telephone || "",
      postal: formData.postal    || "",
      iban:   formData.iban      || "",
      bic:    formData.bic       || "",
      department: formData.department || "",
      authorizationNumber: formData.authorizationNumber || "",
      carRates: formData.carRates || "",
      tuitionFees: formData.tuitionFees || "",
      locations,
    };
    setMonitors(prev => [...prev, newMonitor]);
  }

  function updateMonitor(id, updatedForm, updatedPhoto) {
    setMonitors(prev => prev.map(m =>
      m.id === id
        ? {
            ...m,
            nom:    updatedForm.lastName  ?? m.nom,
            prenom: updatedForm.firstName ?? m.prenom,
            would:  updatedForm.would     ?? m.would,
            status: (updatedForm.status || m.status).toLowerCase().replace(" ", ""),
            photo:  updatedPhoto !== undefined ? updatedPhoto : m.photo,
            email:  updatedForm.email  ?? m.email,
            tel:    updatedForm.tel    ?? m.tel,
            postal: updatedForm.postal ?? m.postal,
            iban: updatedForm.iban ?? m.iban,
            bic: updatedForm.bic ?? m.bic,
            department: updatedForm.department ?? m.department,
            authorizationNumber: updatedForm.authorizationNumber ?? m.authorizationNumber,
            carRates: updatedForm.carRates ?? m.carRates,
            tuitionFees: updatedForm.tuitionFees ?? m.tuitionFees,
            locations: Array.isArray(updatedForm.locations) ? updatedForm.locations : m.locations,
            sector: Array.isArray(updatedForm.locations) && updatedForm.locations.length
              ? updatedForm.locations.map(location => `${location.zoneName}: ${location.place}`).join(" | ")
              : updatedForm.address ?? m.sector,
          }
        : m
    ));
  }

  function archiveMonitor(id) {
    setMonitors(prev => prev.map(m => m.id === id ? { ...m, status: "archived" } : m));
  }

  function unarchiveMonitor(id) {
    setMonitors(prev => prev.map(m => m.id === id ? { ...m, status: "active" } : m));
  }

  return (
    <MonitorsContext.Provider value={{ monitors, addMonitor, updateMonitor, archiveMonitor, unarchiveMonitor, AVATAR_COLORS }}>
      {children}
    </MonitorsContext.Provider>
  );
}

export function useMonitors() {
  const ctx = useContext(MonitorsContext);
  if (!ctx) throw new Error("useMonitors must be used inside MonitorsProvider");
  return ctx;
}
