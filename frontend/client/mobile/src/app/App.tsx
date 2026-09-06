import React from "react";
import type { NativeAppShellHostComponents } from "../../../../foundation/shells/app-shell/native";
import { PortalView } from "../screens/portal";
import type { AppThemeMode } from "../shell/AppShell/config";

export interface AppProps {
  hosts: NativeAppShellHostComponents;
  themeMode?: AppThemeMode;
}

export const App: React.FC<AppProps> = ({ hosts, themeMode = "dark" }) => (
  <PortalView hosts={hosts} themeMode={themeMode} />
);
