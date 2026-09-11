import React from "react";
import type { NativeAppShellHostComponents } from "../../../../foundation/shells/app-shell/native";
import type { ApiClientConfig } from "../../../../shared-core";
import type { ClientAuthStorage } from "../../../shared-core/types/auth.types";
import { ClientStringsProvider, resolveClientStrings, type ClientLocale, type ClientStrings } from "../../../shared-core";
import { PortalView } from "../screens/portal";
import type { AppThemeMode } from "@royalprime/client/manifest/portal/native-appshell.config";

export interface AppProps {
  authApiConfig?: ApiClientConfig;
  authStorage?: ClientAuthStorage;
  hosts: NativeAppShellHostComponents;
  locale?: ClientLocale;
  strings?: ClientStrings;
  themeMode?: AppThemeMode;
}

export const App: React.FC<AppProps> = ({ authApiConfig, authStorage, hosts, locale = "pt-BR", strings, themeMode = "dark" }) => (
  <ClientStringsProvider locale={locale}>
    <PortalView
      authApiConfig={authApiConfig}
      authStorage={authStorage}
      hosts={hosts}
      strings={strings || resolveClientStrings(locale)}
      themeMode={themeMode}
    />
  </ClientStringsProvider>
);
