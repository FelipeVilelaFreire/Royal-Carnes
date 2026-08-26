"use client";

import React, { useEffect, useState } from "react";
import { BottomModal, Button, Input, Modal } from "../design-system";
import { UserIcon } from "../design-system/Icons";
import { clientPtBR } from "@/locales/pt-BR";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";

export interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onAuthenticated?: () => void;
  isDark?: boolean;
  context?: "landing" | "portal";
}

type AuthMode = "login" | "register";

const GoogleBrandIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.13 4.13 0 0 1-1.8 2.71v2.25h2.92c1.7-1.57 2.68-3.88 2.68-6.6z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.2l-2.92-2.25c-.8.54-1.84.86-3.04.86-2.34 0-4.33-1.58-5.04-3.71H.94v2.32A9 9 0 0 0 9 18z" />
    <path fill="#FBBC05" d="M3.96 10.7A5.41 5.41 0 0 1 3.68 9c0-.59.1-1.16.28-1.7V4.98H.94A9 9 0 0 0 0 9c0 1.45.34 2.82.94 4.02l3.02-2.32z" />
    <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58A8.65 8.65 0 0 0 9 0 9 9 0 0 0 .94 4.98L3.96 7.3C4.67 5.16 6.66 3.58 9 3.58z" />
  </svg>
);

const FacebookBrandIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#1877F2" d="M18 9a9 9 0 1 0-10.4 8.9v-6.3H5.3V9h2.3V7c0-2.25 1.34-3.5 3.4-3.5.98 0 2 .18 2 .18v2.2h-1.13c-1.11 0-1.46.69-1.46 1.4V9h2.49l-.4 2.6h-2.09v6.3A9 9 0 0 0 18 9z" />
    <path fill="#FFFFFF" d="M12.5 11.6l.4-2.6h-2.49V7.28c0-.71.35-1.4 1.46-1.4H13v-2.2s-1.02-.18-2-.18c-2.06 0-3.4 1.25-3.4 3.5v2H5.3v2.6h2.3v6.3a9.22 9.22 0 0 0 2.81 0v-6.3h2.09z" />
  </svg>
);

const AppleBrandIcon = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path
      fill={color}
      d="M13.4 9.45c-.02-1.8 1.47-2.66 1.54-2.7-.84-1.23-2.15-1.4-2.61-1.42-1.11-.11-2.17.65-2.74.65-.56 0-1.44-.63-2.37-.61-1.22.02-2.34.71-2.97 1.8-1.27 2.2-.33 5.46.91 7.24.61.88 1.33 1.87 2.28 1.83.91-.04 1.26-.59 2.36-.59 1.1 0 1.41.59 2.37.57.98-.02 1.6-.89 2.2-1.77.7-1.02.99-2.01 1-2.06-.02-.01-1.94-.74-1.97-2.94zM11.6 4.17c.5-.61.84-1.46.75-2.31-.72.03-1.59.48-2.1 1.09-.47.54-.87 1.41-.76 2.24.8.06 1.61-.41 2.11-1.02z"
    />
  </svg>
);

export const AuthModal: React.FC<AuthModalProps> = ({
  open,
  onClose,
  onAuthenticated,
  isDark = false,
  context = "portal"
}) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isMobile, setIsMobile] = useState(false);
  const strings = clientPtBR.authModal;
  const tokens = isDark ? themeColorsDefault.dark : themeColorsDefault.light;
  const contextCopy = context === "landing" ? strings.landing : strings.portal;
  const activeCopy = mode === "login" ? contextCopy.login : contextCopy.register;

  useEffect(() => {
    const updateViewportMode = () => setIsMobile(window.innerWidth <= 768);
    updateViewportMode();
    window.addEventListener("resize", updateViewportMode);
    return () => window.removeEventListener("resize", updateViewportMode);
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    localStorage.setItem("royal_prime_mock_authenticated", "true");
    window.dispatchEvent(new Event("royal_auth_changed"));
    onAuthenticated?.();
    onClose();
  };

  const content = (
    <div style={{ display: "grid", gap: "22px" }}>
      <style>{`
        @keyframes royalAuthContentEnter {
          from { opacity: 0; transform: translateY(14px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes royalAuthPanelEnter {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .royal-auth-panel {
          animation: royalAuthContentEnter 280ms ease both;
        }

        .royal-auth-provider {
          animation: royalAuthPanelEnter 320ms ease both;
        }

        .royal-auth-provider:hover {
          transform: translateY(-2px);
        }

        @media (max-width: 520px) {
          .royal-auth-provider-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
        }
      `}</style>

      <div
        className="royal-auth-panel"
        style={{
          display: "grid",
          gap: "8px",
          padding: "16px",
          border: `1px solid ${tokens.border}`,
          borderRadius: "16px",
          background: isDark ? "rgba(255, 255, 255, 0.035)" : "rgba(47, 31, 18, 0.04)"
        }}
      >
        <span style={{ color: tokens.copper, fontSize: "11px", fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {contextCopy.badge}
        </span>
        <strong style={{ color: tokens.text, fontFamily: "'Playfair Display', serif", fontSize: isMobile ? "22px" : "26px", lineHeight: 1.12 }}>
          {contextCopy.calloutTitle}
        </strong>
        <span style={{ color: tokens.textMuted, fontSize: "13px", lineHeight: 1.45 }}>
          {contextCopy.calloutDescription}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          padding: "5px",
          border: `1px solid ${tokens.border}`,
          borderRadius: "999px",
          background: isDark ? "rgba(255, 255, 255, 0.035)" : "rgba(47, 31, 18, 0.04)"
        }}
      >
        {(["login", "register"] as const).map((item) => {
          const active = mode === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              style={{
                border: "none",
                borderRadius: "999px",
                padding: "10px 12px",
                background: active ? tokens.copper : "transparent",
                color: active ? "#FFFFFF" : tokens.textMuted,
                fontFamily: "'Inter', sans-serif",
                fontSize: "12px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                cursor: "pointer"
              }}
            >
              {strings.tabs[item]}
            </button>
          );
        })}
      </div>

      <form
        className="royal-auth-panel"
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "16px",
          padding: isMobile ? "18px" : "22px",
          border: `1px solid ${tokens.copper}`,
          borderRadius: "18px",
          background: isDark ? "rgba(184, 115, 51, 0.1)" : "rgba(184, 115, 51, 0.07)",
          boxShadow: isDark ? "0 18px 48px rgba(0, 0, 0, 0.28)" : "0 18px 48px rgba(184, 115, 51, 0.12)"
        }}
      >
        {mode === "register" ? (
          <label style={{ display: "grid", gap: "7px", color: tokens.text, fontSize: "13px", fontWeight: 700 }}>
            {strings.fields.name}
            <Input isDark={isDark} rounded={false} placeholder={strings.placeholders.name} />
          </label>
        ) : null}

        <label style={{ display: "grid", gap: "7px", color: tokens.text, fontSize: "13px", fontWeight: 700 }}>
          {strings.fields.email}
          <Input
            isDark={isDark}
            rounded={false}
            type="email"
            defaultValue={mode === "login" ? strings.demo.email : undefined}
            placeholder={strings.placeholders.email}
            style={{ minHeight: "48px", borderRadius: "10px", fontSize: "15px" }}
          />
        </label>

        <label style={{ display: "grid", gap: "7px", color: tokens.text, fontSize: "13px", fontWeight: 700 }}>
          {strings.fields.password}
          <Input
            isDark={isDark}
            rounded={false}
            type="password"
            defaultValue={mode === "login" ? strings.demo.password : undefined}
            placeholder={strings.placeholders.password}
            style={{ minHeight: "48px", borderRadius: "10px", fontSize: "15px" }}
          />
        </label>

        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: tokens.textMuted, fontSize: "12px", fontWeight: 700 }}>
            {mode === "login" ? strings.demo.hint : strings.registerHint}
          </span>
          {mode === "login" ? (
            <button
              type="button"
              style={{
                border: "none",
                background: "transparent",
                color: tokens.copper,
                padding: 0,
                fontSize: "12px",
                fontWeight: 800,
                cursor: "pointer"
              }}
            >
              {strings.forgotPassword}
            </button>
          ) : null}
        </div>

        <Button variant="accent" size="md" fullWidth type="submit" style={{ minHeight: "52px", borderRadius: "10px" }}>
          <UserIcon size={16} />
          {activeCopy.submit}
        </Button>
      </form>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "12px" }}>
        <span style={{ height: "1px", background: tokens.border }} />
        <span style={{ color: tokens.textMuted, fontSize: "11px", fontWeight: 800, textTransform: "uppercase" }}>
          {strings.separator}
        </span>
        <span style={{ height: "1px", background: tokens.border }} />
      </div>

      <div className="royal-auth-provider-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px" }}>
        {strings.providers.map((provider, index) => (
          <button
            className="royal-auth-provider"
            key={provider.key}
            type="button"
            style={{
              aspectRatio: "1 / 1",
              minHeight: isMobile ? "88px" : "104px",
              border: `1px solid ${tokens.border}`,
              borderRadius: "14px",
              background: isDark ? "rgba(255, 255, 255, 0.035)" : "#FFFFFF",
              color: tokens.text,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              fontFamily: "'Inter', sans-serif",
              fontSize: isMobile ? "11px" : "12px",
              lineHeight: 1.25,
              fontWeight: 800,
              cursor: "pointer",
              transition: "transform 180ms ease, border-color 180ms ease, background 180ms ease",
              animationDelay: `${80 + index * 45}ms`,
              textAlign: "center",
              padding: "12px"
            }}
          >
            <span
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "999px",
                display: "grid",
                placeItems: "center",
                background: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(47, 31, 18, 0.05)"
              }}
            >
              {provider.key === "google" ? <GoogleBrandIcon /> : provider.key === "facebook" ? <FacebookBrandIcon /> : <AppleBrandIcon color={tokens.text} />}
            </span>
            {provider.shortLabel}
          </button>
        ))}
      </div>

      <p style={{ margin: 0, color: tokens.textMuted, fontSize: "12px", lineHeight: 1.5, textAlign: "center" }}>
        {strings.legal}
      </p>
    </div>
  );

  const modalProps = {
    open,
    onClose,
    isDark,
    title: activeCopy.title,
    description: activeCopy.description,
    ariaLabel: activeCopy.title
  };

  return isMobile ? (
    <BottomModal {...modalProps}>{content}</BottomModal>
  ) : (
    <Modal {...modalProps} maxWidth={540}>
      {content}
    </Modal>
  );
};
