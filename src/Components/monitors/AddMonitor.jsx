import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./AddMonitor.css";
import { useNavigate } from "react-router-dom";
import { useMonitors } from "./MonitorsContext.jsx";
import FileManager from "../shared/FileManeger.jsx";


import { fetchZones, fetchPlacesByZone, addSelectedLocation,removeSelectedLocation,selectZones,selectZonesStatus,selectPlacesForZone,selectPlacesStatusForZone,selectSelectedLocations,clearSelectedLocations } from "../../redux/reducers/locationSlice.jsx";
import { addMonitor } from "../../redux/reducers/monitorsSlice.jsx";




const EyeIcon = ({ open }) => open ? (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
);

export default function MonitorForm({ onBack }) {
  const { addMonitor1 } = useMonitors();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const selectedSchool = useSelector((state) => state.schools.selected);
  

  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "",
    sexe: "", date_naissance: "", ville: "", postal: "", adresse: "",
    password: "",  password_confirmation: "",
    status: "", cpf: true, boxType: "Manuel",
    iban: "", bic: "",
    	departement: "", numero_autorisation: "",
    tarif_car: "", tarif_enseignement: "",
    lieux: [], 
  });

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  // const [photo, setPhoto] = useState(null);
    const [media,       setMedia]       = useState(null);
     const [mediaFile, setMediaFile] = useState(null);

  const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState(null);
  
    const [submitting,  setSubmitting]  = useState(false);


  // ---- Zones & Places ab Redux se aate hain ----
  const zones = useSelector(selectZones);
  const zonesStatus = useSelector(selectZonesStatus);
  const selectedLocations = useSelector(selectSelectedLocations);

  const [selectedZone, setSelectedZone] =  useState(selectedSchool?.id ?? "");      // zone UUID
  const [selectedPlaceId, setSelectedPlaceId] = useState("");  // place UUID

  const places = useSelector(selectPlacesForZone(selectedZone));
  const placesStatus = useSelector(selectPlacesStatusForZone(selectedZone));

    // zone select hote hi uske places fetch (agar cache mein nahi)
  useEffect(() => {
    if (selectedZone && placesStatus === "idle") {
      dispatch(fetchPlacesByZone(selectedZone));
    }
  }, [selectedZone, placesStatus, dispatch]);

  useEffect(() => {
  if (selectedZone && placesStatus === "idle") {
    dispatch(fetchPlacesByZone(selectedZone));
  }
}, [selectedZone, placesStatus, dispatch]);

useEffect(() => {
  if (selectedSchool?.id) {
    setSelectedZone(selectedSchool.id);
    setSelectedPlaceId("");
    dispatch(clearSelectedLocations());
  }
}, [selectedSchool?.id]);


  // mount par zones fetch (sirf ek dafa)
  useEffect(() => {
    if (zonesStatus === "idle") {
      dispatch(fetchZones());
    }
  }, [zonesStatus, dispatch]);

  // zone select hote hi uske places fetch (agar cache mein nahi)
  useEffect(() => {
    if (selectedZone && placesStatus === "idle") {
      dispatch(fetchPlacesByZone(selectedZone));
    }
  }, [selectedZone, placesStatus, dispatch]);

  useEffect(() => {
  dispatch(clearSelectedLocations());
}, []);



  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  function handleMedia(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  }

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
    // Note: zone reset nahi kiya - user same zone se multiple places jaldi add kar sake
  }

  function handleRemoveLocation(id) {
    dispatch(removeSelectedLocation(id));
  }

  function validate() {
      console.log("FORM AT VALIDATE TIME:", form);
    const nextErrors = {};
    if (!form.first_name.trim()) nextErrors.first_name = true;
    if (!form.last_name.trim()) nextErrors.last_name = true;
    if (!form.email.trim()) nextErrors.email = true;
    if (!form.phone.trim()) nextErrors.phone = true;
    if (!form.ville) nextErrors.ville = true;
    if (!form.postal) nextErrors.postal = true;
    if (!form.adresse.trim()) nextErrors.adresse = true;
    if (form.password && form.password !== form.password_confirmation) nextErrors.password_confirmation = true;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  // function handleSave() {
  //   if (!validate()) return;
  //   const locationsPayload = selectedLocations.map(
  //     ({ zoneId, zoneName, placeId, place }) => ({ zoneId, zoneName, placeId, place })
  //   );
  //   addMonitor({ ...form, zone_souhaitee: locationsPayload }, photo);
  //   navigate("/monitors");
  // }

 async function  handleSave (){
     if (!validate()) return;
    

     const formData = new FormData();


  Object.entries(form).forEach(([key, value]) => {
    if (key === "lieux") {
      // backend sirf place (string) chahta hai, zone nahi
      // selectedLocations se sirf "place" nikal ke array bana rahe hain
      selectedLocations.forEach((item) => {
        formData.append("lieux[]", item.placeId);
      });
    } else if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  if (mediaFile) {
    formData.append('media', mediaFile.file || mediaFile); // ✅ sirf local upload pe lagega
}


if (!mediaFile && media ) {
    formData.append('media_url', mediaFile); // File object
}

    setSubmitting(true);

    try{
      await dispatch(addMonitor(formData)).unwrap();
        navigate("/monitors");
    }catch(err){
       if (err?.errors) {
        const backendErrors = {};
        Object.keys(err.errors).forEach(field => {
          backendErrors[field] = err.errors[field][0]; // pehla message
        });

        setErrors(prev => ({ ...prev, ...backendErrors }));
        setServerError("Veuillez corriger les erreurs ci-dessous.");
      }else{
          setServerError(err?.message || "Une erreur est survenue.");
      }}
      finally{
        setSubmitting(false);
      }

    }



  

  function handleReturn() {
    if (onBack) {
      onBack();
      return;
    }
    navigate("/monitors", { state: { fromSecretaryDashboard: true } });
  }

  return (
    <div className="nc-root">
      <div className="nc-left">
        <div className="nc-header">
          <button className="nc-back-btn" onClick={handleReturn}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          </button>
          <h1 className="nc-title">Nouveau moniteur</h1>
        </div>

        <div className="nc-card">
          <h2 className="nc-card-title">Informations générales</h2>
          <div className="nc-grid-2">
            <div className={`nc-field ${errors.first_name ? "error" : ""}`}>
              <label>Prénom <span className="nc-req">*</span></label>
              <input className="nc-input" value={form.first_name} onChange={e => set("first_name", e.target.value)} />
            </div>
            <div className={`nc-field ${errors.last_name ? "error" : ""}`}>
              <label>Nom <span className="nc-req">*</span></label>
              <input className="nc-input" value={form.last_name} onChange={e => set("last_name", e.target.value)} />
            </div>
          </div>
          <div className="nc-grid-2">
            <div className={`nc-field ${errors.email ? "error" : ""}`}>
              <label>E-mail <span className="nc-req">*</span></label>
              <input className="nc-input" type="email" value={form.email} onChange={e => set("email", e.target.value)} />
            </div>
            <div className={`nc-field ${errors.phone ? "error" : ""}`}>
              <label>Téléphone <span className="nc-req">*</span></label>
              <input className="nc-input" type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} />
            </div>
          </div>
          <div className="nc-grid-2">
            <div className="nc-field">
              <label>Genre</label>
              <select className="nc-input nc-select" value={form.sexe} onChange={e => set("sexe", e.target.value)}>
                <option value="">Genre</option>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div className="nc-field">
              <label>Date de naissance</label>
              <input className="nc-input" type="date" value={form.date_naissance} onChange={e => set("date_naissance", e.target.value)} />
            </div>
          </div>
          <div className="nc-grid-2">
            <div className={`nc-field ${errors.ville ? "error" : ""}`}>
              <label>Ville <span className="nc-req">*</span></label>
             
                 <input className="nc-input nc-placeholder-input" placeholder="Vile" value={form.ville} onChange={e => set("ville", e.target.value)} />

                {/* <option value="">Ville</option>
                {WOULD_OPTIONS.map(option => <option key={option}>{option}</option>)} */}
           
            </div>
            <div className={`nc-field ${errors.postal ? "error" : ""}`}>
              <label>Code postal <span className="nc-req">*</span></label>
              <input className="nc-input" value={form.postal} onChange={e => set("postal", e.target.value)} type="tel" />
            </div>
          </div>
          <div className={`nc-field ${errors.adresse ? "error" : ""}`}>
            <label>Adresse <span className="nc-req">*</span></label>
            <textarea className="nc-input nc-textarea" rows={3} value={form.adresse} onChange={e => set("adresse", e.target.value)} />
          </div>
        </div>

        <div className="nc-card">
          <h2 className="nc-card-title">Informations bancaires</h2>
          <div className="nc-field">
            <input className="nc-input nc-placeholder-input" placeholder="IBAN" value={form.iban} onChange={e => set("iban", e.target.value)} />
          </div>
          <div className="nc-field">
            <input className="nc-input nc-placeholder-input" placeholder="BIC" value={form.bic} onChange={e => set("bic", e.target.value)} />
          </div>
        </div>

        <div className="nc-card">
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

        <div className="nc-card">
          <h2 className="nc-card-title">Zones et lieux</h2>

          {zonesStatus === "failed" && (
            <p className="nc-field-error">Impossible de charger les zones.</p>
          )}

          <div className="nc-area-row">
            <select
              className="nc-input nc-select nc-zone-select"
              value={selectedZone}
              onChange={e => handleZoneChange(e.target.value)}
              // disabled={zonesStatus === "loading"}
              disabled={true}

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

            <button className="nc-add-place-btn" onClick={handleAddLocation} disabled={!selectedZone || !selectedPlaceId}>Ajouter</button>
          </div>

          {selectedLocations.length > 0 && (
            <div className="nc-places-list">
              {selectedLocations.map((item) => (
                <div key={item.id} className="nc-place-tag">
                  <span className="nc-place-zone">{item.zoneName}</span>
                  <span>{item.place}</span>
                  <button className="nc-place-remove" onClick={() => handleRemoveLocation(item.id)} aria-label="Supprimer la localisation">-</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="nc-card">
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
      </div>

      <aside className="nc-right">
        <div className="nc-right-card">
          <select className="nc-input nc-select nc-status-select" value={form.status} onChange={e => set("status", e.target.value)}>
             <option value="">Statut</option>
            <option value="1">Actif</option>
            <option value="2">Inactif</option>
            <option value="0">En attente</option>
          </select>
        </div>

        <FileManager selectedSrc={media}    onSelect={(src, file) => {
              setMedia(src);       // preview ke liye
              setMediaFile(file.file);  // upload ke liye
              }} />

        <div className="nc-right-card nc-right-row">
          <span className="nc-right-label">CPF</span>
          <label className="nc-toggle">
            <input type="checkbox" checked={form.cpf} onChange={e => set("cpf", e.target.checked)} />
            <span className="nc-toggle-track" />
          </label>
        </div>

        <div className="nc-right-card nc-right-row">
          <span className="nc-right-label">Type de boîte</span>
          <div className="nc-box-toggle">
            {["Manuel", "Auto"].map(option => (
              <button key={option} className={`nc-box-opt ${form.boxType === option ? "sel" : ""}`} onClick={() => set("boxType", option)}>{option}</button>
            ))}
          </div>
        </div>

        <button className="nc-add-btn" type="button" onClick={handleSave}>Ajouter le moniteur</button>
        <button
          className="cp-action-btn cp-action-giveup"
          type="button"
          style={{ marginTop: 10 }}
          onClick={handleReturn}
        >
          Abandonner
        </button>
      </aside>
    </div>
  );
}
