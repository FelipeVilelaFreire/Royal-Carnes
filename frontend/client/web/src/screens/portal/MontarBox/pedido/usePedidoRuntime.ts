"use client";

import { useEffect, useState } from "react";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";
import type { ClientCheckoutStepKey } from "@/manifest/checkout.config";

type ThemeMode = "dark" | "light";
const THEME_STORAGE_KEY = "royal_prime_theme";

const readThemeMode = (): ThemeMode => {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "light" ? "light" : "dark";
};

export const usePedidoRuntime = ({
  isAuthenticated,
  onRequestAccess,
}: {
  isAuthenticated: boolean;
  onRequestAccess: () => void;
}) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");

  useEffect(() => {
    const handleThemeChange = () => setThemeMode(readThemeMode());
    handleThemeChange();
    window.addEventListener("royal_theme_changed", handleThemeChange);
    return () => {
      window.removeEventListener("royal_theme_changed", handleThemeChange);
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
    if (isAuthenticated) {
      setCurrentStep(step);
      return;
    }
    onRequestAccess();
  };

  return {
    requestProtectedStep,
    themeMode,
    toggleTheme,
    tokens: themeMode === "dark" ? themeColorsDefault.dark : themeColorsDefault.light,
  };
};
