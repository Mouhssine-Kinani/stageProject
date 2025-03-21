import React, { useState, useEffect } from "react";
import { User } from "lucide-react";

/**
 * Composant de prévisualisation de profil qui affiche une image de profil
 * avec une taille contrôlée et gestion des erreurs de chargement.
 *
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.src - URL de l'image
 * @param {string} props.alt - Texte alternatif pour l'image
 * @param {number} props.size - Taille en pixels (défaut: 40)
 * @param {string} props.className - Classes CSS additionnelles
 * @param {boolean} props.noCache - Si true, ajoute un paramètre timestamp pour éviter le cache
 * @returns {JSX.Element} - Le composant de prévisualisation de profil
 */
export default function ProfilePreview({
  src,
  alt = "Profile",
  size = 40,
  className = "",
  noCache = true,
}) {
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  // Appliquer le cache-busting si nécessaire
  useEffect(() => {
    if (src) {
      let finalSrc = src;
      if (noCache && src.startsWith("http")) {
        const timestamp = new Date().getTime();
        finalSrc = src.includes("?")
          ? `${src}&t=${timestamp}`
          : `${src}?t=${timestamp}`;
      }
      setImageSrc(finalSrc);
    } else {
      setImageSrc(null);
    }
  }, [src, noCache]);

  // Définir les styles de taille fixes
  const containerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    minWidth: `${size}px`,
    minHeight: `${size}px`,
    maxWidth: `${size}px`,
    maxHeight: `${size}px`,
  };

  const handleError = () => {
    console.log("Image load error for:", src);
    setError(true);
  };

  // Reset error state when source changes
  useEffect(() => {
    setError(false);
  }, [src]);

  return (
    <div
      className={`relative flex-shrink-0 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border border-gray-300 ${className}`}
      style={containerStyle}
    >
      {imageSrc && !error ? (
        <div className="w-full h-full overflow-hidden">
          <img
            src={imageSrc}
            alt={alt}
            className="w-full h-full object-cover"
            onError={handleError}
            loading="lazy"
          />
        </div>
      ) : (
        <User className="w-1/2 h-1/2 text-gray-400" />
      )}
    </div>
  );
}
