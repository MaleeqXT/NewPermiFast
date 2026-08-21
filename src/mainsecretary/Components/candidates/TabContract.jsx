import "./TabContract.css";

const ContractIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#c0c4cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
    <rect x="5" y="14" width="4" height="4" rx="0.5" fill="#c0c4cc" stroke="none"/>
  </svg>
);

const EvalIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#c0c4cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <path d="M17 2l-2 2 2 2" stroke="#c0c4cc" strokeWidth="1.5"/>
  </svg>
);

export default function ContractEvaluation() {
  return (
    <div className="ce-wrapper">

      {/* Carte 1 : Contrat */}
      <a
        className="ce-card ce-card--link"
        href="https://staging2.passpermisfacile.fr/admin/users/students/9eeb7af7-031f-467c-a863-dd2eea04abd1/contract"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="ce-icon-wrap">
          <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#b0b5bf" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="3" width="12" height="16" rx="1.5" ry="1.5"/>
            <path d="M8 3v2M12 3v2"/>
            <line x1="7" y1="9" x2="13" y2="9"/>
            <line x1="7" y1="12" x2="13" y2="12"/>
            <line x1="7" y1="15" x2="10" y2="15"/>
            <rect x="9" y="11" width="9" height="9" rx="1" fill="#f0f1f3" stroke="#b0b5bf" strokeWidth="1.4"/>
            <line x1="11" y1="15" x2="16" y2="15"/>
            <line x1="11" y1="17" x2="14" y2="17"/>
          </svg>
        </div>
        <div className="ce-card-title">Contrat entre l'élève et Passpermisfacile</div>
        <div className="ce-card-dot">·</div>
      </a>

      {/* Carte 2 : Évaluation */}
      <div className="ce-card">
        <div className="ce-icon-wrap">
          <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#b0b5bf" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 2H5a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 5 20h14a1.5 1.5 0 0 0 1.5-1.5V8L15 2H9z"/>
            <polyline points="15 2 15 8 20.5 8"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="8" y1="15.5" x2="13" y2="15.5"/>
            <path d="M18 16l1.5 1.5L22 14" stroke="#b0b5bf" strokeWidth="1.4"/>
          </svg>
        </div>
        <div className="ce-card-title">Aucun formulaire d'évaluation disponible</div>
        <div className="ce-card-sub">Vous n'avez pas encore d'évaluation pour ce candidat.</div>
      </div>

    </div>
  );
}
