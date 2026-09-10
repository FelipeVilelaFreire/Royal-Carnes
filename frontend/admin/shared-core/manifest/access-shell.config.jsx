export const adminAccessShellConfig = {
  defaultFlow: "login",
  flows: [
    { key: "login", fieldKeys: ["email", "password"] },
  ],
  presentation: {
    desktop: "screen",
    mobile: "screen",
    native: "screen",
  },
  visual: {
    showCallout: false,
    showForgotPassword: false,
    showLegal: true,
  },
};
