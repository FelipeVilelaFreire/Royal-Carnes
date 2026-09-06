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
const authStorageKey = "royal_prime_mock_authenticated";
const authChangedEvent = "royal_auth_changed";
const themeChangedEvent = "royal_theme_changed";

type PortalThemeMode = "dark" | "light";

const resolveStoredTheme = (): PortalThemeMode => {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(themeStorageKey);
  return stored === "light" ? "light" : "dark";
};

const resolveStoredAuth = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(authStorageKey) === "true";
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

export function usePortalRuntime(initialTab: PortalScreenKey = "home") {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [themeMode, setThemeMode] = useState<PortalThemeMode>(resolveStoredTheme);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mockAuthenticatedOverride, setMockAuthenticatedOverride] = useState(resolveStoredAuth);
  const [activeScreenKey, setActiveScreenKey] = useState<PortalScreenKey>(
    resolvePortalScreenKeyFromPath(pathname, initialTab),
  );

  useEffect(() => {
    const handleResize = () => setIsMobileScreen(window.innerWidth <= 768);
    const handleAuthChange = () => setMockAuthenticatedOverride(resolveStoredAuth());

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener(authChangedEvent, handleAuthChange);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener(authChangedEvent, handleAuthChange);
    };
  }, []);

  useEffect(() => {
    setActiveScreenKey(resolvePortalScreenKeyFromPath(pathname, initialTab));
  }, [initialTab, pathname]);

  useEffect(() => {
    syncDocumentTheme(themeMode);
  }, [themeMode]);

  const activeRoutePath = clientRoutes[activeScreenKey] || clientRoutes.home;
  const isMockAuthenticated = isMobileScreen
    ? Boolean(portalAppShellConfig.auth?.mobileMockAuthenticated) || mockAuthenticatedOverride
    : Boolean(portalAppShellConfig.auth?.mockAuthenticated) || mockAuthenticatedOverride;
  const protectedNavKeys = portalAppShellConfig.auth?.protectedNavKeys || [];
  const publicNavKeys = portalAppShellConfig.auth?.publicNavKeys || [];
  const isProtectedScreen = protectedNavKeys.includes(activeScreenKey);
  const visiblePortalNavigation = isMockAuthenticated
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
    const found = portalNavigation.find(
      (item) => item.routeKey && clientRoutes[item.routeKey] === routePath,
    );
    const nextScreenKey = found?.key
      ? (found.key as PortalScreenKey)
      : resolvePortalScreenKeyFromPath(routePath, activeScreenKey);

    setActiveScreenKey(nextScreenKey);
    if (typeof window !== "undefined" && window.location.pathname !== routePath) {
      router.push(routePath);
    }
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
    isMockAuthenticated,
    isProtectedScreen,
    navigate,
    portalShellConfig,
    setIsAuthModalOpen,
    setMockAuthenticatedOverride,
    themeMode,
    toggleTheme,
    visiblePortalNavigation,
  };
}
