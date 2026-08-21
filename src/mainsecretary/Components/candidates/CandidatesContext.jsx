import { createContext, useContext, useState } from "react";

const INITIAL_CANDIDATES = [
  { id:1, nom:"AISSATA",         prenom:"Sow",        permis:"Voiture",              codeRoute:false, date:"2025-05-15", balance:"0h", place:"CREIL Agency", status:"active",  photo:null },
  { id:2, nom:"ELMACIOGLU",      prenom:"Elif",       permis:"Moto",                 codeRoute:true,  date:"2025-05-15", balance:"0h", place:"CREIL Agency", status:"active",  photo:null },
  { id:3, nom:"COUCH GRASS",     prenom:"Jennyfer's", permis:"AM",                   codeRoute:false, date:"2025-05-15", balance:"0h", place:"CREIL Agency", status:"active",  photo:null },
  { id:4, nom:"HEAVENIE",        prenom:"Kamara",     permis:"Voiture",              codeRoute:true,  date:"2025-05-15", balance:"6h", place:"CREIL Agency", status:"active",  photo:null },
  { id:5, nom:"MARIA-MANUELA",   prenom:"Virlan",     permis:"Conduite accompagnée", codeRoute:false, date:"2025-05-15", balance:"0h", place:"CREIL Agency", status:"active",  photo:null },
  { id:6, nom:"MASSALA THYFENE", prenom:"Ngoma",      permis:"Voiture",              codeRoute:false, date:"2025-05-15", balance:"0h", place:"CREIL Agency", status:"new",     photo:null },
];

const CandidatesContext = createContext(null);

export function CandidatesProvider({ children }) {
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId) ?? null;

  function addCandidate(formData, photo) {
    const newCandidate = {
      id:         Date.now(),
      nom:        formData.lastName  || "",
      prenom:     formData.firstName || "",
      permis:     formData.would     || "Voiture",
      codeRoute:  false,
      date:       new Date().toISOString().split("T")[0],
      balance:    "0h",
      place:      formData.postal    || "—",
      status:     (formData.status || "active").toLowerCase(),
      photo:      photo || null,
    };
    setCandidates(prev => [...prev, newCandidate]);
  }

  function updateCandidate(id, updatedForm, updatedPhoto) {
    setCandidates(prev => prev.map(c =>
      c.id === id
        ? {
            ...c,
            nom:    updatedForm.firstName ?? c.nom,
            prenom: updatedForm.lastName  ?? c.prenom,
            permis: updatedForm.would     ?? c.permis,
            status: (updatedForm.status   ?? c.status).toLowerCase(),
            photo:  updatedPhoto !== undefined ? updatedPhoto : c.photo,
          }
        : c
    ));
  }

  function archiveCandidate(id)   { setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: "archived" } : c)); }
  function unarchiveCandidate(id) { setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: "active"   } : c)); }

  return (
    <CandidatesContext.Provider value={{ candidates, setCandidates, selectedCandidateId, setSelectedCandidateId, selectedCandidate, addCandidate, updateCandidate, archiveCandidate, unarchiveCandidate }}>
      {children}
    </CandidatesContext.Provider>
  );
}

export function useCandidates() {
  const ctx = useContext(CandidatesContext);
  if (!ctx) throw new Error("useCandidates must be used inside CandidatesProvider");
  return ctx;
}
