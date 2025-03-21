"use client";
import React, { useState, useRef, useEffect } from "react";

/**
 * Composant pour afficher le contenu des cellules avec gestion intelligente de l'espace
 * et tooltips pour les valeurs tronquées
 *
 * @param {Object} props
 * @param {any} props.value - La valeur à afficher
 * @param {string} props.type - Type de contenu ('text', 'number', 'date', 'status', etc.)
 * @param {number} props.maxChars - Nombre maximal de caractères avant troncature
 * @param {Object} props.style - Styles supplémentaires
 * @param {boolean} props.showTooltip - Afficher un tooltip sur survol (défaut: true)
 */
export default function CellContent({
  value,
  type = "text",
  maxChars = 30,
  style = {},
  showTooltip = true,
  ...props
}) {
  const [isTruncated, setIsTruncated] = useState(false);
  const contentRef = useRef(null);

  // Vérifier si le contenu est tronqué lors du rendu
  useEffect(() => {
    if (contentRef.current) {
      const isOverflowing =
        contentRef.current.scrollWidth > contentRef.current.clientWidth;
      setIsTruncated(isOverflowing);
    }
  }, [value]);

  // Formatter la valeur selon son type
  const formatValue = () => {
    if (value === null || value === undefined) return "—";

    switch (type) {
      case "number":
        return typeof value === "number" ? value.toLocaleString() : value;
      case "date":
        try {
          return new Date(value).toLocaleDateString();
        } catch (e) {
          return value;
        }
      case "status":
        return (
          <span className={`status-badge ${value.toLowerCase()}`}>{value}</span>
        );
      case "currency":
        return typeof value === "number"
          ? `${value.toLocaleString()} MAD`
          : value;
      case "boolean":
        return value ? "Oui" : "Non";
      default:
        return value;
    }
  };

  // Déterminer si on doit tronquer le texte
  const shouldTruncate =
    type === "text" && typeof value === "string" && value.length > maxChars;

  // Texte tronqué ou formaté
  const displayValue = shouldTruncate
    ? `${value.substring(0, maxChars)}...`
    : formatValue();

  // Classes CSS
  const cellClasses = [
    type === "number" || type === "currency" ? "numeric" : "",
    isTruncated && showTooltip ? "cell-tooltip" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={contentRef}
      className={cellClasses}
      style={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        ...style,
      }}
      data-tooltip={
        showTooltip && (isTruncated || shouldTruncate) ? value : undefined
      }
      {...props}
    >
      {displayValue}
    </div>
  );
}
