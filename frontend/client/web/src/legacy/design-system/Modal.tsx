"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export interface ModalProps {
  open: boolean;
  title?: string;
  description?: string;
  children: React.ReactNode;
  onClose: () => void;
  isDark?: boolean;
  maxWidth?: number;
  ariaLabel?: string;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  title,
  description,
  children,
  onClose,
  isDark = false,
  maxWidth = 520,
  ariaLabel
}) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open || typeof document === "undefined") return null;

  const surface = isDark ? "#221F1E" : "#FCFBF7";
  const text = isDark ? "#F5F3EF" : "#1A1A1A";
  const textMuted = isDark ? "#A09A92" : "#5D554E";
  const border = isDark ? "rgba(232, 225, 222, 0.14)" : "rgba(80, 69, 53, 0.22)";

  return createPortal(
    <div
      role="presentation"
      onMouseDown={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: isDark ? "rgba(0, 0, 0, 0.64)" : "rgba(26, 20, 16, 0.32)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        animation: "royalModalBackdropEnter 180ms ease both"
      }}
    >
      <style>{`
        @keyframes royalModalBackdropEnter {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes royalModalPanelEnter {
          from { opacity: 0; transform: translateY(18px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <section
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || title}
        onMouseDown={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth,
          maxHeight: "calc(100vh - 48px)",
          overflowY: "auto",
          background: surface,
          color: text,
          border: `1px solid ${border}`,
          borderRadius: "20px",
          boxShadow: isDark ? "0 28px 80px rgba(0, 0, 0, 0.56)" : "0 28px 80px rgba(47, 31, 18, 0.18)",
          padding: "28px",
          boxSizing: "border-box",
          animation: "royalModalPanelEnter 240ms cubic-bezier(0.2, 0.8, 0.2, 1) both"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", alignItems: "flex-start" }}>
          <div>
            {title ? (
              <h2
                style={{
                  margin: 0,
                  color: text,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "32px",
                  lineHeight: 1.1
                }}
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p style={{ margin: "10px 0 0", color: textMuted, fontSize: "14px", lineHeight: 1.5 }}>
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            style={{
              width: "36px",
              height: "36px",
              flexShrink: 0,
              borderRadius: "999px",
              border: `1px solid ${border}`,
              background: "transparent",
              color: text,
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              fontSize: "18px",
              lineHeight: 1
            }}
          >
            x
          </button>
        </div>

        <div style={{ marginTop: "24px" }}>{children}</div>
      </section>
    </div>,
    document.body
  );
};

export const BottomModal: React.FC<ModalProps> = ({
  open,
  title,
  description,
  children,
  onClose,
  isDark = false,
  ariaLabel
}) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open || typeof document === "undefined") return null;

  const surface = isDark ? "#221F1E" : "#FCFBF7";
  const text = isDark ? "#F5F3EF" : "#1A1A1A";
  const textMuted = isDark ? "#A09A92" : "#5D554E";
  const border = isDark ? "rgba(232, 225, 222, 0.14)" : "rgba(80, 69, 53, 0.22)";

  return createPortal(
    <div
      role="presentation"
      onMouseDown={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "flex-end",
        background: isDark ? "rgba(0, 0, 0, 0.64)" : "rgba(26, 20, 16, 0.32)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        animation: "royalBottomModalBackdropEnter 180ms ease both"
      }}
    >
      <style>{`
        @keyframes royalBottomModalBackdropEnter {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes royalBottomModalPanelEnter {
          from { opacity: 0; transform: translateY(34px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <section
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || title}
        onMouseDown={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxHeight: "calc(100vh - 28px)",
          overflowY: "auto",
          background: surface,
          color: text,
          borderTop: `1px solid ${border}`,
          borderTopLeftRadius: "22px",
          borderTopRightRadius: "22px",
          boxShadow: "0 -24px 72px rgba(0, 0, 0, 0.38)",
          padding: "12px 20px 24px",
          boxSizing: "border-box",
          animation: "royalBottomModalPanelEnter 260ms cubic-bezier(0.2, 0.8, 0.2, 1) both"
        }}
      >
        <div style={{ width: "42px", height: "4px", borderRadius: "999px", background: border, margin: "0 auto 18px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "flex-start" }}>
          <div>
            {title ? (
              <h2
                style={{
                  margin: 0,
                  color: text,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "28px",
                  lineHeight: 1.1
                }}
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p style={{ margin: "8px 0 0", color: textMuted, fontSize: "14px", lineHeight: 1.5 }}>
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            style={{
              width: "34px",
              height: "34px",
              flexShrink: 0,
              borderRadius: "999px",
              border: `1px solid ${border}`,
              background: "transparent",
              color: text,
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              fontSize: "18px",
              lineHeight: 1
            }}
          >
            x
          </button>
        </div>

        <div style={{ marginTop: "22px" }}>{children}</div>
      </section>
    </div>,
    document.body
  );
};
