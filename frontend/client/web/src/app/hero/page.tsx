"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@foundation/shells/app-shell";
import { landingAppShellConfig } from "@royalprime/client/manifest/landing/appshell.config";
import { landingNavigation } from "@royalprime/client/navigation/landing.navigation";
import { LandingView } from "../../screens/landing/LandingView";

export default function HeroPage() {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <AppShell
      activePath="/hero"
      config={landingAppShellConfig}
      navItems={landingNavigation as any}
      onNavigate={handleNavigate}
    >
      <LandingView onNavigate={handleNavigate} />
    </AppShell>
  );
}
