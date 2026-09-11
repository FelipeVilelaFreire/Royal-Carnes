"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@foundation/shells/app-shell";
import { landingAppShellConfig } from "@royalprime/client/manifest/landing/appshell.config";
import { landingNavigation } from "@royalprime/client/navigation/landing.navigation";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import { LandingView } from "../screens/landing/LandingView";

export default function RootPage() {
  const router = useRouter();
  const strings = useClientStrings();
  return (
    <AppShell
      activePath="/"
      config={{ ...landingAppShellConfig, strings: strings.appShell }}
      navItems={landingNavigation as any}
      onNavigate={(path) => router.push(path)}
    >
      <LandingView onNavigate={(path) => router.push(path)} />
    </AppShell>
  );
}
