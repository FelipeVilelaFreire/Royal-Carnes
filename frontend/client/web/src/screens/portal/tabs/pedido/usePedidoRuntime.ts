"use client";

import { useEffect, useState } from "react";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";
import type { ClientCheckoutStepKey } from "@/manifest/checkout.config";

type ThemeMode = "dark" | "light";
const THEME_STORAGE_KEY = "royal_prime_theme";
const DEMO_AUTH_STORAGE_KEY = "royal_prime_mock_authenticated";

const readThemeMode = (): ThemeMode => {
  if (typeof window === "undefined") return "dark";
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark" || attr === "light") return attr;
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "dark" || stored === "light" ? stored : "dark";
};

const readDemoAuth = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(DEMO_AUTH_STORAGE_KEY) === "true";
};

export const usePedidoRuntime = () => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(readThemeMode);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDemoAuthenticated, setIsDemoAuthenticated] = useState(readDemoAuth);
  const [pendingStepAfterAuth, setPendingStepAfterAuth] = useState<ClientCheckoutStepKey | null>(null);

  useEffect(() => {
    const handleThemeChange = () => setThemeMode(readThemeMode());
    const handleAuthChange = () => setIsDemoAuthenticated(readDemoAuth());

    window.addEventListener("royal_theme_changed", handleThemeChange);
    window.addEventListener("royal_auth_changed", handleAuthChange);
    return () => {
      window.removeEventListener("royal_theme_changed", handleThemeChange);
      window.removeEventListener("royal_auth_changed", handleAuthChange);
    };
  }, []);

  const toggleTheme = () => {
    const next = themeMode === "dark" ? "light" : "dark";
    setThemeMode(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
    document.documentElement.setAttribute("data-theme", next);
    window.dispatchEvent(new Event("royal_theme_changed"));
  };

  const requestProtectedStep = (step: ClientCheckoutStepKey, setCurrentStep: (step: ClientCheckoutStepKey) => void) => {
    if (isDemoAuthenticated) {
      setCurrentStep(step);
      return;
    }
    setPendingStepAfterAuth(step);
    setIsAuthModalOpen(true);
  };

  const handleAuthenticatedCheckout = (setCurrentStep: (step: ClientCheckoutStepKey) => void) => {
    setIsDemoAuthenticated(true);
    if (pendingStepAfterAuth) {
      setCurrentStep(pendingStepAfterAuth);
      setPendingStepAfterAuth(null);
    }
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingStepAfterAuth(null);
  };

  return {
    closeAuthModal,
    handleAuthenticatedCheckout,
    isAuthModalOpen,
    isDark: themeMode === "dark",
    isDemoAuthenticated,
    pendingStepAfterAuth,
    requestProtectedStep,
    themeMode,
    toggleTheme,
    tokens: themeMode === "dark" ? themeColorsDefault.dark : themeColorsDefault.light,
  };
};
