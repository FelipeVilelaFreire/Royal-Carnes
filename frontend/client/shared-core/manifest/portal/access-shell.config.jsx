export const clientPortalAccessShellConfig = {
  header: {
    logo: "/assets/brand/royal-prime-logo.jpg",
    name: "RoyalPrime",
    showClose: true,
  },
  defaultFlow: "login",
  flows: [
    { key: "login", fieldKeys: ["email", "password"] },
    { key: "register", fieldKeys: ["name", "email", "password"] },
  ],
  providers: ["google", "apple"],
  presentation: {
    desktop: "modal",
    mobile: "bottomModal",
    native: "screen",
  },
  visual: {
    flowSwitcher: "footerLink",
    formSurface: "flat",
    modalDensity: "roomy",
    showCallout: false,
    showFieldLabels: false,
    showForgotPassword: true,
    showLegal: false,
  },
};
