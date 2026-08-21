import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMonitorById, selectSelectedMonitor, selectSelectedMonitorLoading, clearSelectedMonitor } from "../../redux/reducers/monitorsSlice.jsx";
import {
  fetchZones,
  fetchPlacesByZone,
  addSelectedLocation,
  removeSelectedLocation,
  setSelectedLocationsBulk,
  selectZones,
  selectZonesStatus,
  selectPlacesForZone,
  selectPlacesStatusForZone,
  selectSelectedLocations,
  clearSelectedLocations
} from "../../redux/reducers/locationSlice.jsx";

import { updateMonitor } from "../../redux/reducers/monitorsSlice.jsx";

import { useParams } from "react-router-dom";


const BASE_URL = import.meta.env.VITE_API_URL;

function getMonitorImageUrl(media) {
  const path = typeof media === "string"
    ? media
    : media?.path ?? media?.url ?? media?.storage_media?.path ?? media?.storageMedia?.path;
  if (!path) return null;
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path;
  if (path.startsWith("/storage/")) return `${BASE_URL}${path}`;
  if (path.startsWith("storage/")) return `${BASE_URL}/${path}`;
  return `${BASE_URL}/storage/${path.replace(/^\/+/, "")}`;
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}
import "../candidates/Info.css";
import "./AddMonitor.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useMonitors } from "./MonitorsContext.jsx";
import FileManager from "../shared/FileManeger.jsx";
import TabInfo from "../candidates/Tabinfo.jsx";
import Document from "../shared/Document.jsx";
import Attatchments from "../shared/Attatchments.jsx";
import EditFieldModal from "../shared/EditFieldModal.jsx";
import ActionToast from "../shared/ActionToast.jsx";


const BLANK = {
  first_name: "", last_name: "", email: "", phone: "",
  sexe: "", date_naissance: "", ville: "", postal: "", adresse: "",
  password: "", password_confirmation: "",
  status: "", cpf: true, boxType: "Manuel",
  iban: "", bic: "",
  departement: "", numero_autorisation: "",
  tarif_car: "", tarif_enseignement: "",
  lieux: [],
};

// backend ke naye monitor shape se form state banata hai
// monitor = { id, status, details: {...}, lieux: [...], user: {...} }
function monitorToForm(monitor) {
  if (!monitor) return BLANK;
  const user = monitor.user || {};
  const details = monitor.details || {};
  const account = monitor.account || {};

  return {
    ...BLANK,
    first_name: user.first_name ?? "",
    last_name: user.last_name ?? "",
    email: user.email ?? "",
    phone: user.phone ?? "",
    sexe: user.sexe ?? "",
    date_naissance: user.date_naissance ?? "",
    ville: user.ville ?? "",
    postal: user.postal ?? "",
    adresse: user.adresse ?? "",
    password: "",
    password_confirmation: "",
    // status: monitor.status ?? "",
     status:    user.status,
    boxType: details.is_manual === "1" || details.is_manual === true ? "Manuel" : (details.is_auto ? "Auto" : "Manuel"),
    departement: details.departement ?? "",
    numero_autorisation: details.numero_autorisation ?? "",
    tarif_car: details.tarif_car ?? "",
    tarif_enseignement: details.tarif_enseignement ?? "",
    iban:account.iban ?? "",
    bic:account.bic ?? "",

    lieux: [], // selectedLocations (Redux) is asal source of truth hai, yeh sirf placeholder
  };
}

const TABS = [
  { id: "info", label: "Informations et documents" },
  { id: "invoices", label: "Factures et paiements" },
  { id: "attachments", label: "Pièces jointes" },
];
const FULL_WIDTH_TABS = ["invoices", "attachments"];

export default function MonitorsInfo({ monitor: monitorProp = null, onBack, autoConnect = false }) {
  
  // const { updateMonitor } = useMonitors();
  const location = useLocation();
  const navigate = useNavigate();
  const routeAutoConnect = location.state?.autoConnect ?? autoConnect;
  const dispatch = useDispatch();
  const { id } = useParams();

  const selectedSchool = useSelector((state) => state.schools.selected); 
  const [selectedZone, setSelectedZone] = useState(selectedSchool?.id ?? "");

  // ---- Monitor data Redux se ----
  const monitor = useSelector(selectSelectedMonitor);
  const monitorLoading = useSelector(selectSelectedMonitorLoading);

  // ---- Zones & Places Redux se ----
  const zones = useSelector(selectZones);
  const zonesStatus = useSelector(selectZonesStatus);
  const selectedLocations = useSelector(selectSelectedLocations);

  // const [selectedZone, setSelectedZone] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState("");

  const places = useSelector(selectPlacesForZone(selectedZone));
  const placesStatus = useSelector(selectPlacesStatusForZone(selectedZone));

  const [form, setForm] = useState(BLANK);
  const [committed, setCommitted] = useState(BLANK);
  const [media, setMedia] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [toastMessage, setToastMessage] = useState("");
  const [nameModal, setNameModal] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
  if (selectedSchool?.id) {
    setSelectedZone(selectedSchool.id);
    setSelectedPlaceId("");
  }
}, [selectedSchool?.id]);


useEffect(() => {
  if (selectedZone && placesStatus === "idle") {
    dispatch(fetchPlacesByZone(selectedZone));
  }
}, [selectedZone, placesStatus, dispatch]);



  // 1) monitor ka data fetch karo route id se
  useEffect(() => {
    if (id) dispatch(fetchMonitorById(id));
    return () => {
      dispatch(clearSelectedMonitor());
       dispatch(clearSelectedLocations()); 
    };
  }, [id, dispatch]);

  // 2) zones fetch karo (agar idle hain)
  useEffect(() => {
    if (zonesStatus === "idle") {
      dispatch(fetchZones());
    }
  }, [zonesStatus, dispatch]);

  // 3) jab zones load ho jayen, monitor ke "lieux" mein jo zone_ids hain
  //    unke places fetch karo (background mein) - taake match ho sake
  useEffect(() => {
    if (!monitor?.lieux?.length || zonesStatus !== "succeeded") return;
    const uniqueZoneIds = [...new Set(monitor.lieux.map((l) => l.zone_id))];
    uniqueZoneIds.forEach((zoneId) => {
      dispatch(fetchPlacesByZone(zoneId));
    });
  }, [monitor, zonesStatus, dispatch]);

  // 4) monitor data aane par form ko populate karo
  useEffect(() => {
    if (!monitor) return;
    const next = monitorToForm(monitor);
    setForm(next);
    setCommitted(next);
    setMedia(getMonitorImageUrl(monitor.user?.media));
    setMediaFile(null);
  }, [monitor]);

  // 5) monitor.lieux + zones se selectedLocations (Redux) ko bulk pre-fill karo
  //    zone_id se zones list mein zoneName dhoondte hain
  useEffect(() => {
    if (!monitor?.lieux?.length || !zones.length) return;

    const prefilled = monitor.lieux.map((lieu) => {
      const zone = zones.find((z) => String(z.id) === String(lieu.zone_id));
      return {
        zoneId: lieu.zone_id,
        zoneName: zone ? zone.name : "—",
        placeId: lieu.id,
        place: lieu.name,
      };
    });

    dispatch(setSelectedLocationsBulk(prefilled));
  }, [monitor, zones, dispatch]);

  useEffect(() => {
    // Wait until the monitor profile has loaded; otherwise the dashboard is
    // opened with a null monitor_id and the availability store request fails.
    if (routeAutoConnect && monitor?.id) {
      navigate("/monitor-dashboard", {
        state: {
          fromMonitorProfile: true,
          fromSecretaryDashboard: Boolean(location.state?.fromSecretaryDashboard),
          returnTo: location.pathname,
          monitor_id: monitor?.id ?? null,
        },
        replace: true,
      });
    }
  }, [location.pathname, location.state, monitor?.id, navigate, routeAutoConnect]);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  function handleZoneChange(zoneId) {
    setSelectedZone(zoneId);
    setSelectedPlaceId("");
  }

  function handleAddLocation() {
    if (!selectedZone || !selectedPlaceId) return;
    const zone = zones.find(item => String(item.id) === String(selectedZone));
    const place = places.find(item => String(item.id) === String(selectedPlaceId));
    if (!zone || !place) return;

    dispatch(
      addSelectedLocation({
        zoneId: zone.id,
        zoneName: zone.name,
        placeId: place.id,
        place: place.name,
      })
    );
    setSelectedPlaceId("");
  }

  function handleRemoveLocation(locId) {
    dispatch(removeSelectedLocation(locId));
  }

  const handleSave = async () => {
  const formData = new FormData();

  formData.append('first_name', form.first_name);
  formData.append('last_name', form.last_name);
  formData.append('email', form.email);
  formData.append('phone', form.phone);
  formData.append('sexe', form.sexe);
  formData.append('date_naissance', form.date_naissance);
  formData.append('postal', form.postal || '');
  formData.append('ville', form.ville || '');
  formData.append('adresse', form.adresse);
  formData.append('status', form.status);

  formData.append('departement', form.departement || '');
  formData.append('numero_autorisation', form.numero_autorisation || '');
  formData.append('tarif_car', form.tarif_car || '');
  formData.append('tarif_enseignement', form.tarif_enseignement || '');

  formData.append('iban', form.iban || '');
  formData.append('bic', form.bic || '');

  formData.append('is_manual', form.boxType === 'Manuel' ? 1 : 0);
  formData.append('is_auto', form.boxType === 'Auto' ? 1 : 0);

  if (form.password) {
    formData.append('password', form.password);
    formData.append('password_confirmation', form.password_confirmation);
  }

  // lieux -> selectedLocations (Redux) se placeId nikal ke bhejte hain
  selectedLocations.forEach((item) => {
    formData.append('lieux[]', item.placeId);
  });

  // ✅ Sirf nayi File ho tabhi append karo, purani URL/base64 nahi
  if (mediaFile && mediaFile instanceof File) {
    formData.append('media', mediaFile);
  }

  // Laravel method spoofing - route PUT hai, lekin multipart POST se bhejna hoga
  formData.append('_method', 'PUT');

  try {
    const response = await dispatch(updateMonitor({ id, formData })).unwrap();
    const updatedMonitor = response?.data ?? response;
    const savedImage = getMonitorImageUrl(updatedMonitor?.user?.media);
    if (savedImage) setMedia(savedImage);
    setMediaFile(null);
    setToastMessage("Les informations ont été modifiées avec succès.");
    setErrors({});
  } catch (err) {
    if (err?.errors) {
      setErrors(err.errors);
      setToastMessage("Veuillez corriger les erreurs.");
    } else {
      setToastMessage(err?.message || "Une erreur est survenue.");
    }
  }
};

  // const handleSave = () => {
  //   // selectedLocations (Redux) mein zone+place dikhne wala data hai,
  //   // form.lieux ko bas display-consistency ke liye sync kar dete hain.
  //   // Asal payload banate waqt (FormData) selectedLocations se "placeId" use karna hai,
  //   // jaisa AddMonitor.jsx mein ho raha hai.
  //   const nextForm = {
  //     ...form,
  //     lieux: selectedLocations.map(({ zoneId, zoneName, placeId, place }) => ({ zoneId, zoneName, placeId, place })),
  //   };
  //   setCommitted(nextForm);
  //   setForm(nextForm);
  //   setToastMessage("Les informations ont été modifiées avec succès.");

  //   // 👇 Yahan se aagay tum apna updateMonitor (Redux thunk) dispatch karoge,
  //   // jaisa AddMonitor.jsx mein addMonitor + FormData banaya tha:
  //   //
  //   // const formData = new FormData();
  //   // Object.entries(form).forEach(([key, value]) => {
  //   //   if (key === "lieux") {
  //   //     selectedLocations.forEach((item) => formData.append("lieux[]", item.placeId));
  //   //   } else if (value !== null && value !== undefined) {
  //   //     formData.append(key, value);
  //   //   }
  //   // });
  //   // if (mediaFile) formData.append("media", mediaFile);
  //   // dispatch(updateMonitor({ id, formData })).unwrap()...
  // };

  const handleCancel = () => setForm(committed);
  const fullName = `${committed.first_name} ${committed.last_name}`.trim();
  const saveProps = {
    form,
    set,
    onSave: handleSave,
    onCancel: handleCancel,
    onOpenNameModal: () => setNameModal(true),
    showRapport: false,
    onConnect: () => navigate("/monitor-dashboard", {
      state: {
        fromMonitorProfile: true,
        fromSecretaryDashboard: Boolean(location.state?.fromSecretaryDashboard),
        returnTo: location.pathname,
        monitor_id: monitor?.id ?? null,
      },
    }),
    showBalanceSection: false,
    showPasswordSection: false,
  };
  const isFullWidth = FULL_WIDTH_TABS.includes(activeTab);

  if (monitorLoading) {
    return <div className="cp-page">Chargement...</div>;
  }

  return (
    <div className="cp-page">
      {toastMessage && <ActionToast message={toastMessage} onClose={() => setToastMessage("")} />}
      <div className="cp-header">
        <button
          className="cp-back"
          onClick={() => {
            if (onBack) {
              onBack();
              return;
            }
            navigate(-1);
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
          </svg>
        </button>
        <h1 className="cp-title">{fullName || "—"}</h1>
      </div>

      <div className="cp-tabs-bar">
        <div className="cp-tabs-pill">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`cp-tab-btn${activeTab === tab.id ? " active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isFullWidth && (
        <div className="cp-fullwidth-tab">
          {activeTab === "invoices" && <Document />}
          {activeTab === "attachments" && <Attatchments />}
        </div>
      )}

      {activeTab === "info" && (
        <div className="cp-body">
          <div className="cp-form-card">
            <TabInfo
              {...saveProps}
              disableFetch={true}
              committed={committed}
              beforeActions={
                <>
            <div className="nc-card" style={{ marginTop: 20 }}>
              <h2 className="nc-card-title">Informations bancaires</h2>
              <div className="nc-field">
                <input className="nc-input nc-placeholder-input" placeholder="IBAN" value={form.iban} onChange={e => set("iban", e.target.value)} />
              </div>
              <div className="nc-field">
                <input className="nc-input nc-placeholder-input" placeholder="BIC" value={form.bic} onChange={e => set("bic", e.target.value)} />
              </div>
            </div>

            <div className="nc-card" style={{ marginTop: 20 }}>
              <h2 className="nc-card-title">Autres informations</h2>
              <div className="nc-grid-2">
                <div className="nc-field">
                  <input className="nc-input nc-placeholder-input" placeholder="Département" value={form.departement} onChange={e => set("departement", e.target.value)} />
                </div>
                <div className="nc-field">
                  <input className="nc-input nc-placeholder-input" placeholder="Numéro d'autorisation" value={form.numero_autorisation} onChange={e => set("numero_autorisation", e.target.value)} />
                </div>
              </div>
              <div className="nc-grid-2">
                <div className="nc-field">
                  <div className="nc-euro-wrap">
                    <input className="nc-input nc-placeholder-input" placeholder="Tarif véhicule" type="number" min="0" value={form.tarif_car} onChange={e => set("tarif_car", e.target.value)} />
                    <span className="nc-euro-symbol">€</span>
                  </div>
                </div>
                <div className="nc-field">
                  <div className="nc-euro-wrap">
                    <input className="nc-input nc-placeholder-input" placeholder="Frais de formation" type="number" min="0" value={form.tarif_enseignement} onChange={e => set("tarif_enseignement", e.target.value)} />
                    <span className="nc-euro-symbol">€</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="nc-card" style={{ marginTop: 20 }}>
              <h2 className="nc-card-title">Zones et lieux</h2>

              {zonesStatus === "failed" && (
                <p className="nc-field-error">Impossible de charger les zones.</p>
              )}

              <div className="nc-area-row">
                <select
                  className="nc-input nc-select nc-zone-select"
                  value={selectedZone}
                  onChange={e => handleZoneChange(e.target.value)}
                  disabled={true} // zonesStatus === "loading"}
                >
                  <option value="">{zonesStatus === "loading" ? "Chargement..." : "Zone"}</option>
                  {zones.map(zone => (
                    <option key={zone.id} value={zone.id}>{zone.name}</option>
                  ))}
                </select>
                <select
                  className="nc-input nc-select nc-place-select"
                  value={selectedPlaceId}
                  disabled={!selectedZone || placesStatus === "loading"}
                  onChange={e => setSelectedPlaceId(e.target.value)}
                >
                  <option value="">
                    {!selectedZone ? "Sélectionnez une zone" : placesStatus === "loading" ? "Chargement..." : "Lieu"}
                  </option>
                  {places.map(place => (
                    <option key={place.id} value={place.id}>{place.name}</option>
                  ))}
                </select>
                <button className="nc-add-place-btn" type="button" onClick={handleAddLocation} disabled={!selectedZone || !selectedPlaceId}>Ajouter</button>
              </div>
              {selectedLocations.length > 0 && (
                <div className="nc-places-list">
                  {selectedLocations.map((item) => (
                    <div key={item.id} className="nc-place-tag">
                      <span className="nc-place-zone">{item.zoneName}</span>
                      <span>{item.place}</span>
                      <button className="nc-place-remove" type="button" onClick={() => handleRemoveLocation(item.id)} aria-label="Supprimer la localisation">-</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="nc-card" style={{ marginTop: 20 }}>
              <h2 className="nc-card-title">Modifier le mot de passe</h2>
              <div className="nc-field">
                <label>Mot de passe</label>
                <div className="nc-pwd-wrapper">
                  <input className="nc-input nc-pwd-input" type={showPwd ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)} />
                  <button className="nc-eye-btn" type="button" onClick={() => setShowPwd(v => !v)}><EyeIcon open={showPwd} /></button>
                </div>
                {form.password && form.password.length < 8 && <span className="nc-field-hint">8 caractères minimum</span>}
              </div>
              <div className={`nc-field ${errors.password_confirmation ? "error" : ""}`}>
                <label>Confirmer le mot de passe</label>
                <div className="nc-pwd-wrapper">
                  <input className="nc-input nc-pwd-input" type={showConfirm ? "text" : "password"} value={form.password_confirmation} onChange={e => set("password_confirmation", e.target.value)} />
                  <button className="nc-eye-btn" type="button" onClick={() => setShowConfirm(v => !v)}><EyeIcon open={showConfirm} /></button>
                </div>
                {errors.password_confirmation && <span className="nc-field-error">Les mots de passe ne correspondent pas</span>}
              </div>
            </div>
                </>
              }
            />
          </div>

          <aside className="cp-right">
            <div className="cp-admin-card">
              <h3 className="cp-admin-title">Informations administratives</h3>
              <div className="cp-admin-row">
                <span className="cp-admin-label">E-mail</span>
                <span className="cp-admin-val">{committed.email || "—"}</span>
              </div>
              <div className="cp-admin-row">
                <span className="cp-admin-label">Téléphone</span>
                <span className="cp-admin-val">
                  {committed.phone ? `+33${committed.phone.replace(/^0/, "")}` : "—"}
                </span>
              </div>
              <div className="cp-admin-row">
                <span className="cp-admin-label">Code postal / Ville</span>
                <span className="cp-admin-val">{committed.postal || "—"}</span>
              </div>
            </div>

            <div className="cp-right-card">
              <div className="cp-right-row">
                <span className="cp-right-label">Statut</span>
              <select className="cp-input" value={form.status} onChange={e => set("status", e.target.value)}>
              <option value="1">Actif</option>
              <option value="2">Inactif</option>
              <option value="3">En attente</option>
            </select>
              </div>
            </div>

            <FileManager
              selectedSrc={media}
              onSelect={(src, file) => {
                setMedia(src);
                setMediaFile(file.file);
              }}
            />

            {/* <div className="cp-right-card">
              <div className="cp-right-row">
                <span className="cp-right-label">CPF</span>
                <label className="cp-toggle">
                  <input type="checkbox" checked={form.cpf} onChange={e => set("cpf", e.target.checked)} />
                  <span className="cp-toggle-track" />
                </label>
              </div>
              <div className="cp-right-row" style={{ marginTop: 16 }}>
                <span className="cp-right-label">Type de boîte</span>
                <div className="cp-box-toggle">
                  {["Manuel", "Auto"].map(opt => (
                    <button key={opt} className={`cp-box-opt${form.boxType === opt ? " sel" : ""}`} onClick={() => set("boxType", opt)}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div> */}

            <button className="nc-add-btn" type="button" onClick={handleSave}>
              Modifier le moniteur
            </button>
            <button className="cp-action-btn cp-action-giveup" type="button" onClick={handleCancel}>Abandonner</button>
          </aside>
        </div>
      )}

      {nameModal && (
        <EditFieldModal
          title="Modifier le nom"
          fields={[
             { key: "first_name", label: "Nom", placeholder: "Nom de famille" },
            { key: "last_name", label: "Prénom", placeholder: "Prénom" },
          ]}
          values={{ last_name: form.last_name, first_name: form.first_name }}
          onSave={(updated) => {
            set("last_name",  updated.last_name);
            set("first_name", updated.first_name);
            setCommitted(prev => ({ ...prev, last_name: updated.last_name, first_name: updated.first_name }));
          }}
          onClose={() => setNameModal(false)}
        />
      )}
      {/* {nameModal && (
        <EditFieldModal
          title="Modifier le nom"
          fields={[
            { key: "first_name", label: "Nom", placeholder: "Nom de famille" },
            { key: "last_name", label: "Prénom", placeholder: "Prénom" },
          ]}
         values={{ lastName: form.last_name, first_name: form.first_name }}
          onSave={(updated) => {
            set("last_name",  updated.last_name);
            set("first_name", updated.first_name);
            setCommitted(prev => ({ ...prev, last_name: updated.last_name, first_name: updated.first_name }));
          }}
          onClose={() => setNameModal(false)}
         
        />
      )} */}
    </div>
  );
}
