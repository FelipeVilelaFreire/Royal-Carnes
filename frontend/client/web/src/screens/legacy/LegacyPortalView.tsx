"use client";

import React from "react";
import { AppShell } from "@foundation/shells/appshell";
import { clientAppShellConfig } from "@/manifests/landing/appshell.config";
import { clientNavigation } from "@/navigation/client.navigation";
import { HomeView } from "../portal/tabs/HomeView";
import { MinhaCaixaView } from "../portal/tabs/MinhaCaixaView";
import { MeuClubeView } from "../portal/tabs/MeuClubeView";

export interface LegacyPortalViewProps {
  initialTab?: "home" | "minha-caixa" | "meu-clube" | "minha-assinatura";
  onNavigate?: (path: string) => void;
}

export const LegacyPortalView: React.FC<LegacyPortalViewProps> = ({ initialTab = "home", onNavigate }) => {
  const renderTabContent = () => {
    switch (initialTab) {
      case "minha-caixa":
        return <MinhaCaixaView onNavigate={onNavigate} />;
      case "meu-clube":
        return <MeuClubeView onNavigate={onNavigate} />;
      default:
        return <HomeView onNavigate={onNavigate} />;
    }
  };

  return (
    <AppShell
      config={clientAppShellConfig}
      navItems={clientNavigation as any}
      activePath={`/${initialTab}`}
      onNavigate={onNavigate}
    >
      <div style={{ padding: "20px 0" }}>{renderTabContent()}</div>
    </AppShell>
  );
};
