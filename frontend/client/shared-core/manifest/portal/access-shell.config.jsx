export const clientPortalAccessShellConfig = {
  defaultFlow: "login",
  flows: [
    { key: "login", fieldKeys: ["email", "password"] },
    { key: "register", fieldKeys: ["name", "email", "password"] },
  ],
  presentation: {
    desktop: "modal",
    mobile: "bottomModal",
    native: "screen",
  },
  visual: {
    showCallout: true,
    showForgotPassword: true,
    showLegal: true,
  },
};
