export type AccessShellFlowKey = "login" | "register";
export type AccessShellFieldKey = "name" | "email" | "password";
export type AccessShellPresentation = "modal" | "bottomModal" | "screen";
export type AccessShellProviderKey = "apple" | "google";

export interface AccessShellFlowConfig {
  fieldKeys: AccessShellFieldKey[];
  key: AccessShellFlowKey;
}

export interface AccessShellConfig {
  header?: {
    logo?: string;
    name: string;
    showClose?: boolean;
  };
  /** @deprecated Use header so the whole modal header stays declarative. */
  brand?: {
    logo?: string;
    name: string;
  };
  defaultFlow: AccessShellFlowKey;
  flows: AccessShellFlowConfig[];
  presentation: {
    desktop: AccessShellPresentation;
    mobile: AccessShellPresentation;
    native: AccessShellPresentation;
  };
  visual: {
    flowSwitcher?: "footerLink" | "tabs";
    formSurface?: "flat" | "soft";
    modalDensity?: "compact" | "roomy";
    showFieldLabels?: boolean;
    showCallout: boolean;
    showForgotPassword: boolean;
    showLegal: boolean;
  };
  providers?: AccessShellProviderKey[];
}

export interface AccessShellFlowStrings {
  description: string;
  submit: string;
  title: string;
}

export interface AccessShellStrings {
  callout?: {
    badge: string;
    description: string;
    title: string;
  };
  close: string;
  fields: Record<AccessShellFieldKey, string>;
  flows: Record<AccessShellFlowKey, AccessShellFlowStrings>;
  forgotPassword?: string;
  legal?: string;
  placeholders: Record<AccessShellFieldKey, string>;
  registerHint?: string;
  tabs: Record<AccessShellFlowKey, string>;
  switcher?: Partial<Record<AccessShellFlowKey, {
    action: string;
    hint: string;
  }>>;
  providers?: {
    apple: string;
    divider: string;
    google: string;
  };
}

export type AccessShellValues = Partial<Record<AccessShellFieldKey, string>>;
