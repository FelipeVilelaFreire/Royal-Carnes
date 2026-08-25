export const adminAppShellConfig = {
  header: {
    enabled: true,
    layoutMode: "attached", // Acoplado no topo do Admin
    surfaceStyle: "solid",
    maxWidthToken: "FULL",
    floatingTopOffsetToken: "NONE",
    paddingXToken: "LG",
    paddingYToken: "SM",
    gapLateralToken: "SM",
    navGapToken: "MD",
    buttonAppearance: "outline",
    buttonToneToken: "neutral",
    buttonSizeToken: "SM",
    rightSlotType: "profileAvatar"
  },
  drawer: {
    enabled: false // Desativado no Admin (usa Sidebar)
  },
  bottomTabBar: {
    enabled: false // Desativado no Admin
  },
  sidebarMenu: {
    enabled: true, // Ativado no Admin
    widthExpandedToken: "XL",
    widthCollapsedToken: "XS",
    itemGapToken: "XS",
    itemPaddingXToken: "MD",
    itemRadiusToken: "MD",
    activeItemBackgroundToken: "surfaceElevated"
  },
  screenContent: {
    paddingXToken: "XL",
    paddingYToken: "XL",
    maxWidthToken: "FULL"
  }
};
