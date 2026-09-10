export type AccessShellFlowKey = "login" | "register";
export type AccessShellFieldKey = "name" | "email" | "password";
export type AccessShellPresentation = "modal" | "bottomModal" | "screen";

export interface AccessShellFlowConfig {
  fieldKeys: AccessShellFieldKey[];
  key: AccessShellFlowKey;
}

export interface AccessShellConfig {
  defaultFlow: AccessShellFlowKey;
  flows: AccessShellFlowConfig[];
  presentation: {
    desktop: AccessShellPresentation;
    mobile: AccessShellPresentation;
    native: AccessShellPresentation;
  };
  visual: {
    showCallout: boolean;
    showForgotPassword: boolean;
    showLegal: boolean;
  };
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
}

export type AccessShellValues = Partial<Record<AccessShellFieldKey, string>>;
