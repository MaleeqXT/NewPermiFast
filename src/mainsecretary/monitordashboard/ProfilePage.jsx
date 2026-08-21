import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./ProfilePage.css";
import FileManager from "../Components/shared/FileManeger.jsx";
import {
  addSelectedLocation,
  clearSelectedLocations,
  fetchPlacesByZone,
  fetchZones,
  removeSelectedLocation,
  selectPlacesForZone,
  selectPlacesStatusForZone,
  selectSelectedLocations,
  selectZones,
  selectZonesStatus,
  setSelectedLocationsBulk,
} from "../../redux/reducers/locationSlice.jsx";
import {
  clearMonitorProfile,
  fetchMonitorProfile,
  selectMonitorProfile,
  selectMonitorProfileError,
  selectMonitorProfileLoading,
  selectMonitorProfileSaveError,
  selectMonitorProfileSaving,
  updateMonitorProfile,
} from "../../redux/reducers/monitorProfileSlice.jsx";

const BASE_URL = import.meta.env.VITE_API_URL;

function resolveAvatarSrc(user) {
  if (!user) return null;
  return user.media
    ? `${BASE_URL}/storage/${user.media}`
    : user.profile_photo_url || null;
}

function resolveDisplayName(user, fallback = "") {
  if (!user) return fallback;
  return [user.first_name, user.last_name].filter(Boolean).join(" ").trim() || user.name || fallback;
}

const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const EyeIcon = ({ open }) => (
  open ? (
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
  )
);

const BLANK = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  sexe: "",
  date_naissance: "",
  adresse: "",
  postal: "",
  ville: "",
  status: "1",
  iban: "",
  bic: "",
  departement: "",
  numero_autorisation: "",
  tarif_car: "",
  tarif_enseignement: "",
  password: "",
  password_confirmation: "",
  boxType: "Manuel",
};

function profileToForm(profile) {
  if (!profile) return BLANK;

  const monitor = profile.monitor || {};
  const details = monitor.details || {};

  return {
    ...BLANK,
    first_name: profile.first_name ?? "",
    last_name: profile.last_name ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    sexe: profile.sexe ?? "",
    date_naissance: profile.date_naissance ?? "",
    adresse: profile.adresse ?? "",
    postal: profile.postal ?? "",
    ville: profile.ville ?? "",
    status: String(profile.status ?? "1"),
    iban: details.iban ?? "",
    bic: details.bic ?? "",
    departement: details.departement ?? "",
    numero_autorisation: details.numero_autorisation ?? "",
    tarif_car: details.tarif_car ?? "",
    tarif_enseignement: details.tarif_enseignement ?? "",
    boxType: details.is_auto ? "Auto" : "Manuel",
  };
}

function getInitials(firstName, lastName) {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "M";
}

function Field({ label, type = "text", value, onChange, half, textarea, eye }) {
  const [show, setShow] = useState(false);

  return (
    <div className={`pf-field${half ? " pf-field--half" : ""}${textarea ? " pf-field--area" : ""}`}>
      <label className="pf-label">{label}</label>
      {textarea ? (
        <textarea className="pf-input pf-textarea" value={value} onChange={onChange} rows={4} />
      ) : (
        <div className="pf-input-wrap">
          <input
            className="pf-input"
            type={eye ? (show ? "text" : "password") : type}
            value={value}
            onChange={onChange}
          />
          {eye && (
            <button type="button" className="pf-eye" onClick={() => setShow((prev) => !prev)} tabIndex={-1}>
              <EyeIcon open={show} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProfilePage({ onBack }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const profile = useSelector(selectMonitorProfile);
  const loading = useSelector(selectMonitorProfileLoading);
  const saving = useSelector(selectMonitorProfileSaving);
  const loadError = useSelector(selectMonitorProfileError);
  const saveError = useSelector(selectMonitorProfileSaveError);
  const selectedSchool = useSelector((state) => state.schools.selected);

  const zones = useSelector(selectZones);
  const zonesStatus = useSelector(selectZonesStatus);
  const selectedLocations = useSelector(selectSelectedLocations);

  const [form, setForm] = useState(BLANK);
  const [committed, setCommitted] = useState(BLANK);
  const [committedLocations, setCommittedLocations] = useState([]);
  const [resolvedMonitorId, setResolvedMonitorId] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const places = useSelector(selectPlacesForZone(selectedZone));
  const placesStatus = useSelector(selectPlacesStatusForZone(selectedZone));
  const displayName = resolveDisplayName(currentUser, `${form.first_name} ${form.last_name}`.trim() || "—");
  const avatarSrc = media || resolveAvatarSrc(currentUser) || (profile ? resolveAvatarSrc(profile) : null);

  const monitorId = resolvedMonitorId || profile?.monitor?.id || profile?.monitor_id || "";

  useEffect(() => {
    dispatch(fetchMonitorProfile());

    return () => {
      dispatch(clearMonitorProfile());
      dispatch(clearSelectedLocations());
    };
  }, [dispatch]);

  useEffect(() => {
    if (zonesStatus === "idle") {
      dispatch(fetchZones());
    }
  }, [dispatch, zonesStatus]);

  useEffect(() => {
    if (profile?.first_name || profile?.last_name) {
      const next = profileToForm(profile);
      const initialLocations = (profile.monitor?.lieux || []).map((lieu) => ({
        zoneId: lieu.zone_id,
        zoneName: "",
        placeId: lieu.id,
        place: lieu.name,
      }));
      setForm(next);
      setCommitted(next);
      setMedia(resolveAvatarSrc(profile));
      setMediaFile(null);
      setErrors({});
      setToastMessage("");
      setCommittedLocations(initialLocations);
      dispatch(setSelectedLocationsBulk(initialLocations));
      setResolvedMonitorId(String(profile.monitor?.id || profile.monitor_id || ""));
    }
  }, [dispatch, profile]);

  useEffect(() => {
    if (selectedZone) {
      setSelectedPlaceId("");
      if (placesStatus === "idle") {
        dispatch(fetchPlacesByZone(selectedZone));
      }
    }
  }, [dispatch, placesStatus, selectedZone]);

  useEffect(() => {
    if (!profile?.monitor?.lieux?.length || !zones.length) return;

    const prefilled = profile.monitor.lieux.map((lieu) => {
      const zone = zones.find((item) => String(item.id) === String(lieu.zone_id));
      return {
        zoneId: lieu.zone_id,
        zoneName: zone?.name || "—",
        placeId: lieu.id,
        place: lieu.name,
      };
    });

    dispatch(setSelectedLocationsBulk(prefilled));
    setCommittedLocations(prefilled.map((item) => ({ ...item })));

    if (!selectedZone && prefilled[0]?.zoneId) {
      setSelectedZone(String(prefilled[0].zoneId));
    }
  }, [dispatch, profile, zones]);

  useEffect(() => {
    if (selectedZone) return;
    if (selectedSchool?.id) {
      setSelectedZone(String(selectedSchool.id));
      return;
    }
    if (profile?.monitor?.lieux?.[0]?.zone_id) {
      setSelectedZone(String(profile.monitor.lieux[0].zone_id));
      return;
    }
    if (zones[0]?.id) {
      setSelectedZone(String(zones[0].id));
    }
  }, [profile, selectedSchool?.id, selectedZone, zones]);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleZoneChange = (zoneId) => {
    setSelectedZone(zoneId);
    setSelectedPlaceId("");
    if (zoneId && placesStatus === "idle") {
      dispatch(fetchPlacesByZone(zoneId));
    }
  };

  const handleAddLocation = () => {
    if (!selectedZone || !selectedPlaceId) return;
    const zone = zones.find((item) => String(item.id) === String(selectedZone));
    const place = places.find((item) => String(item.id) === String(selectedPlaceId));
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
  };

  const handleRemoveLocation = (locId) => {
    dispatch(removeSelectedLocation(locId));
  };

  const isDirty =
    JSON.stringify(form) !== JSON.stringify(committed) ||
    JSON.stringify(selectedLocations.map((item) => ({
      zoneId: item.zoneId,
      zoneName: item.zoneName,
      placeId: item.placeId,
      place: item.place,
    }))) !== JSON.stringify(committedLocations) ||
    Boolean(mediaFile);

  const handleSave = async () => {
    if (!monitorId) {
      setToastMessage("Le moniteur n'a pas été chargé.");
      return;
    }

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("first_name", form.first_name);
    formData.append("last_name", form.last_name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("sexe", form.sexe || "");
    formData.append("date_naissance", form.date_naissance || "");
    formData.append("adresse", form.adresse || "");
    formData.append("postal", form.postal || "");
    formData.append("ville", form.ville || "");
    formData.append("status", form.status || "1");
    formData.append("iban", form.iban || "");
    formData.append("bic", form.bic || "");
    formData.append("departement", form.departement || "");
    formData.append("numero_autorisation", form.numero_autorisation || "");
    formData.append("tarif_car", form.tarif_car || "");
    formData.append("tarif_enseignement", form.tarif_enseignement || "");
    formData.append("is_manual", form.boxType === "Manuel" ? "1" : "0");
    formData.append("is_auto", form.boxType === "Auto" ? "1" : "0");

    if (form.password) {
      formData.append("password", form.password);
      formData.append("password_confirmation", form.password_confirmation);
    }

    selectedLocations.forEach((item) => {
      formData.append("lieux[]", item.placeId);
    });

    if (mediaFile instanceof File) {
      formData.append("media", mediaFile);
    }

    try {
      await dispatch(updateMonitorProfile({ monitorId, formData })).unwrap();
      setCommitted({ ...form });
      setCommittedLocations(
        selectedLocations.map((item) => ({
          zoneId: item.zoneId,
          zoneName: item.zoneName,
          placeId: item.placeId,
          place: item.place,
        }))
      );
      setMediaFile(null);
      setToastMessage("Les informations ont été modifiées avec succès.");
      setErrors({});
    } catch (error) {
      if (error?.errors) {
        setErrors(error.errors);
        setToastMessage("Veuillez corriger les erreurs.");
      } else {
        setToastMessage(error?.message || "Une erreur est survenue.");
      }
    }
  };

  const handleCancel = () => {
    setForm(committed);
    dispatch(setSelectedLocationsBulk(committedLocations));
    setMediaFile(null);
  };

  return (
    <div className="pf-page">
      {toastMessage && (
        <div className="pf-toast" role="status">
          <span>{toastMessage}</span>
          <button type="button" className="pf-toast-close" onClick={() => setToastMessage("")}>×</button>
        </div>
      )}

      <header className="pf-topbar">
        <button className="pf-back" onClick={onBack}>
          <IconArrowLeft />
          <span>Paramètres</span>
        </button>
      </header>

      <div className="pf-profile-strip">
        <div className="pf-avatar">
          {avatarSrc ? <img src={avatarSrc} alt={displayName} className="pf-avatar-img" /> : getInitials(currentUser?.first_name || form.first_name, currentUser?.last_name || form.last_name)}
        </div>
        <span className="pf-profile-name">{displayName}</span>
        <button className="pf-change-btn" onClick={() => setIsFileManagerOpen(true)}>
          Modifier
        </button>
      </div>

      <FileManager
        variant="hidden"
        selectedSrc={media}
        onSelect={(src, file) => {
          setMedia(src);
          setMediaFile(file?.file instanceof File ? file.file : null);
        }}
        openOverride={isFileManagerOpen}
        onRequestClose={() => setIsFileManagerOpen(false)}
      />

      <main className="pf-main">
        {loading && <div className="pf-helper">Chargement du profil...</div>}
        {loadError && <div className="pf-helper pf-helper--error">{typeof loadError === "string" ? loadError : loadError?.message || "Impossible de charger le profil."}</div>}
        {saveError && <div className="pf-helper pf-helper--error">{typeof saveError === "string" ? saveError : saveError?.message || "Impossible d'enregistrer les modifications."}</div>}

        <section className="pf-section">
          <p className="pf-section-title">Informations personnelles</p>
          <div className="pf-grid">
            <Field label="Prénom" value={form.first_name} onChange={(e) => set("first_name", e.target.value)} half />
            <Field label="Nom" value={form.last_name} onChange={(e) => set("last_name", e.target.value)} half />
            <Field label="E-mail" value={form.email} onChange={(e) => set("email", e.target.value)} />
            <Field label="Téléphone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            <Field label="Adresse" value={form.adresse} onChange={(e) => set("adresse", e.target.value)} textarea />
            <Field label="Code postal" value={form.postal} onChange={(e) => set("postal", e.target.value)} half />
            <Field label="Ville" value={form.ville} onChange={(e) => set("ville", e.target.value)} half />
            <Field label="Date de naissance" type="date" value={form.date_naissance} onChange={(e) => set("date_naissance", e.target.value)} />
          </div>
        </section>

        <section className="pf-section">
          <p className="pf-section-title">Informations bancaires</p>
          <div className="pf-grid">
            <Field label="IBAN" value={form.iban} onChange={(e) => set("iban", e.target.value)} />
            <Field label="BIC" value={form.bic} onChange={(e) => set("bic", e.target.value)} />
          </div>
        </section>

        <section className="pf-section">
          <p className="pf-section-title">Autres informations</p>
          <div className="pf-grid">
            <Field label="Département" value={form.departement} onChange={(e) => set("departement", e.target.value)} half />
            <Field label="Numéro d'autorisation" value={form.numero_autorisation} onChange={(e) => set("numero_autorisation", e.target.value)} half />
            <Field label="Tarif véhicule" value={form.tarif_car} onChange={(e) => set("tarif_car", e.target.value)} half />
            <Field label="Tarif enseignement" value={form.tarif_enseignement} onChange={(e) => set("tarif_enseignement", e.target.value)} half />
          </div>
        </section>

        <section className="pf-section">
          <p className="pf-section-title">Zones et lieux</p>
          {zonesStatus === "failed" && <p className="pf-helper pf-helper--error">Impossible de charger les zones.</p>}
          <div className="pf-location-row">
            <select className="pf-input pf-select" value={selectedZone} onChange={(e) => handleZoneChange(e.target.value)}>
              <option value="">Zone</option>
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>{zone.name}</option>
              ))}
            </select>
            <select className="pf-input pf-select" value={selectedPlaceId} disabled={!selectedZone || placesStatus === "loading"} onChange={(e) => setSelectedPlaceId(e.target.value)}>
              <option value="">{!selectedZone ? "Sélectionnez une zone" : placesStatus === "loading" ? "Chargement..." : "Lieu"}</option>
              {places.map((place) => (
                <option key={place.id} value={place.id}>{place.name}</option>
              ))}
            </select>
            <button type="button" className="pf-location-add" onClick={handleAddLocation} disabled={!selectedZone || !selectedPlaceId}>
              Ajouter
            </button>
          </div>

          {selectedLocations.length > 0 && (
            <div className="pf-location-tags">
              {selectedLocations.map((item) => (
                <div key={item.id} className="pf-location-tag">
                  <span className="pf-location-zone">{item.zoneName}</span>
                  <span>{item.place}</span>
                  <button type="button" className="pf-location-remove" onClick={() => handleRemoveLocation(item.id)} aria-label="Supprimer le lieu">-</button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="pf-section">
          <p className="pf-section-title">Modifier votre mot de passe</p>
          <div className="pf-grid">
            <Field label="Mot de passe" value={form.password} onChange={(e) => set("password", e.target.value)} eye />
            <Field label="Confirmation du mot de passe" value={form.password_confirmation} onChange={(e) => set("password_confirmation", e.target.value)} eye />
          </div>
        </section>

        <section className="pf-section">
          <p className="pf-section-title">Statut</p>
          <select className="pf-input pf-select" value={form.status} onChange={(e) => set("status", e.target.value)}>
            <option value="1">Actif</option>
            <option value="2">Inactif</option>
            <option value="0">En attente</option>
          </select>
        </section>

        <section className="pf-section">
          <p className="pf-section-title">Photo de profil</p>
          <button type="button" className="pf-photo-trigger" onClick={() => setIsFileManagerOpen(true)}>
            Changer la photo
          </button>
        </section>

        <div className="pf-actions">
          <button className={`pf-save${isDirty ? " pf-save--active" : ""}`} onClick={handleSave} disabled={!isDirty || saving}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
          <button className="pf-cancel" type="button" onClick={handleCancel}>
            Annuler
          </button>
        </div>
      </main>
    </div>
  );
}
