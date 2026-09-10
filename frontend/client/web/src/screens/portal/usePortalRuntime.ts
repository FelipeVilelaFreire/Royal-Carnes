"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { portalAppShellConfig } from "@/manifest/portal/appshell.config";
import { clientRoutes } from "@/manifest/routes";
import { portalNavigation } from "@/navigation/client.navigation";
import {
  resolvePortalScreenKeyFromPath,
  type PortalScreenKey,
} from "@royalprime/client/manifest/portal/routes.config";

const themeStorageKey = "royal_prime_theme";
const themeChangedEvent = "royal_theme_changed";

type PortalThemeMode = "dark" | "light";

const resolveStoredTheme = (): PortalThemeMode => {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(themeStorageKey);
  return stored === "light" ? "light" : "dark";
};

const syncDocumentTheme = (themeMode: PortalThemeMode) => {
  if (typeof document === "undefined") return;
  const nextThemeColors =
    portalAppShellConfig.theme?.modes?.[themeMode] ||
    portalAppShellConfig.theme?.colors;

  document.documentElement.setAttribute("data-theme", themeMode);
  document.documentElement.setAttribute("data-theme-mode", themeMode);
  if (nextThemeColors) {
    document.documentElement.style.backgroundColor = nextThemeColors.background;
    document.documentElement.style.color = nextThemeColors.text;
  }
};

export function usePortalRuntime(initialTab: PortalScreenKey = "home", isAuthenticated = false) {
  const router = useRouter();
  const pathname = usePathname();
  const [themeMode, setThemeMode] = useState<PortalThemeMode>("dark");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeScreenKey, setActiveScreenKey] = useState<PortalScreenKey>(
    resolvePortalScreenKeyFromPath(pathname, initialTab),
  );

  useEffect(() => {
    setActiveScreenKey(resolvePortalScreenKeyFromPath(pathname, initialTab));
  }, [initialTab, pathname]);

  useEffect(() => {
    setThemeMode(resolveStoredTheme());
  }, []);

  useEffect(() => {
    syncDocumentTheme(themeMode);
  }, [themeMode]);

  const activeRoutePath = clientRoutes[activeScreenKey] || clientRoutes.home;
  const protectedNavKeys = portalAppShellConfig.auth?.protectedNavKeys || [];
  const publicNavKeys = portalAppShellConfig.auth?.publicNavKeys || [];
  const isProtectedScreen = protectedNavKeys.includes(activeScreenKey);
  const visiblePortalNavigation = isAuthenticated
    ? portalNavigation
    : portalNavigation.filter(
      (item) =>
        publicNavKeys.includes(item.key) ||
        item.key === "meusPedidos" ||
        item.key === "minhaConta",
    );
  const activeThemeColors =
    portalAppShellConfig.theme?.modes?.[themeMode] ||
    portalAppShellConfig.theme?.colors;

  const portalShellConfig = useMemo(() => ({
    ...portalAppShellConfig,
    theme: {
      ...portalAppShellConfig.theme,
      defaultMode: themeMode,
      colors: activeThemeColors,
    },
  }), [activeThemeColors, themeMode]);

  const navigate = (routePath: string) => {
    if (typeof window !== "undefined" && window.location.pathname !== routePath) {
      router.push(routePath);
      return;
    }

    setActiveScreenKey(resolvePortalScreenKeyFromPath(routePath, activeScreenKey));
  };

  const toggleTheme = () => {
    const next = themeMode === "dark" ? "light" : "dark";
    setThemeMode(next);
    syncDocumentTheme(next);
    localStorage.setItem(themeStorageKey, next);
    window.dispatchEvent(new Event(themeChangedEvent));
  };

  return {
    activeRoutePath,
    activeScreenKey,
    isAuthModalOpen,
    isAuthenticated,
    isProtectedScreen,
    navigate,
    portalShellConfig,
    setIsAuthModalOpen,
    themeMode,
    toggleTheme,
    visiblePortalNavigation,
  };
}
