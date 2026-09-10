import React from "react";
import type { NativeAppShellHostComponents } from "../../../../foundation/shells/app-shell/native";
import type { ApiClientConfig } from "../../../../shared-core";
import type { ClientAuthStorage } from "../../../shared-core/types/auth.types";
import type { useClientStrings } from "../../../shared-core/hooks/useClientStrings";
import { PortalView } from "../screens/portal";
import type { AppThemeMode } from "../shell/AppShell/config";

export interface AppProps {
  authApiConfig?: ApiClientConfig;
  authStorage?: ClientAuthStorage;
  hosts: NativeAppShellHostComponents;
  strings: ReturnType<typeof useClientStrings>;
  themeMode?: AppThemeMode;
}

export const App: React.FC<AppProps> = ({ authApiConfig, authStorage, hosts, strings, themeMode = "dark" }) => (
  <PortalView authApiConfig={authApiConfig} authStorage={authStorage} hosts={hosts} strings={strings} themeMode={themeMode} />
);
