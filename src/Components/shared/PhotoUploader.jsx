import { useRef, useState } from "react";
import "./PhotoUploader.css";
import upload from "../../assets/upload.jpg";
import upload1 from "../../assets/upload1.jpg";
import upload2 from "../../assets/upload2.jpg";
import upload3 from "../../assets/upload3.jpg";

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const UploadIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

const INITIAL_IMAGES = [upload, upload1, upload2, upload3];

export default function PhotoUploader({
  variant = "gallery",
  selectedImage = "",
  onSelect,
  title = "Vos Photos",
  subtitle = "De bonnes photos valorisent votre auto-ecole. Ajoutez-en pour booster votre visibilite.",
  actionLabel = "Televerser votre photo",
}) {
  const [images, setImages] = useState(() => (
    selectedImage ? [selectedImage, ...INITIAL_IMAGES.filter((src) => src !== selectedImage)] : INITIAL_IMAGES
  ));
  const dragIndex = useRef(null);
  const fileInputRef = useRef(null);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const nextSrc = ev.target.result;
      setImages((prev) => [nextSrc, ...prev.filter((src) => src !== nextSrc)]);
      if (onSelect) onSelect(nextSrc);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemove = (e, index) => {
    e.stopPropagation();
    const removedSrc = images[index];
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (selectedImage === removedSrc && onSelect) onSelect("");
  };

  const handleDragStart = (e, index) => {
    dragIndex.current = index;
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => e.currentTarget.classList.add("dragging"), 0);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex.current !== index) e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e) => e.currentTarget.classList.remove("drag-over");

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
    const from = dragIndex.current;
    if (from === null || from === dropIndex) return;

    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(dropIndex, 0, moved);
      return next;
    });
    dragIndex.current = null;
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove("dragging");
    dragIndex.current = null;
    document.querySelectorAll(".pu-img-card").forEach((el) => el.classList.remove("drag-over"));
  };

  if (variant === "compact") {
    return (
      <div className="pu-compact-card">
        <div className="pu-compact-preview" onClick={handleUploadClick}>
          {selectedImage ? (
            <img src={selectedImage} alt="Selected upload" className="pu-compact-img" />
          ) : (
            <div className="pu-compact-empty">
              <UploadIcon />
              <span>{actionLabel}</span>
            </div>
          )}
        </div>

        <div className="pu-compact-content">
          <div className="pu-compact-title">{title}</div>
          <div className="pu-compact-subtitle">{subtitle}</div>
        </div>

        <button type="button" className="pu-compact-btn" onClick={handleUploadClick}>
          {selectedImage ? "Changer" : "Ouvrir"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    );
  }

  return (
    <div className="pu-wrapper">
      <h2 className="pu-title">{title}</h2>
      <p className="pu-subtitle">{subtitle}</p>

      <div className="pu-grid">
        {images.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className={`pu-img-card${selectedImage === src ? " pu-img-card--selected" : ""}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onClick={() => onSelect && onSelect(src)}
          >
            <img src={src} alt="" className="pu-img" draggable={false} />
            <button className="pu-remove" onClick={(e) => handleRemove(e, index)}>
              <CloseIcon />
            </button>
            {selectedImage === src ? <div className="pu-selected-badge">Selected</div> : null}
          </div>
        ))}

        <div className="pu-upload" onClick={handleUploadClick}>
          <UploadIcon />
          <span className="pu-upload-text">{actionLabel}</span>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}
