import { useRef, useState } from "react";

// Bonus: drag-and-drop file upload (used for post images and profile
// pictures), with a regular file picker as the accessible fallback.
export default function DropZone({ onFile, preview, label = "Drag an image here, or click to choose one" }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  }

  function handleChange(e) {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
        dragging ? "border-rust bg-rust/10" : "border-border dark:border-borderdark"
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
    >
      {preview ? (
        <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded object-cover" />
      ) : (
        <p className="text-sm text-inksoft dark:text-inksoftdark">{label}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
