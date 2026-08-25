export const clientAppShellConfig = {
  header: {
    enabled: true,
    layoutMode: "floating", // "floating" | "attached"
    surfaceStyle: "glassBlur", // "glassBlur" | "solid"
    maxWidthToken: "CONTAINED",
    floatingTopOffsetToken: "MD", // theme.spacing.MD
    paddingXToken: "LG", // theme.spacing.LG
    paddingYToken: "SM", // theme.spacing.SM
    gapLateralToken: "SM", // theme.spacing.SM (logo/hambúrguer)
    navGapToken: "XL", // theme.spacing.XL (gap entre links)
    buttonAppearance: "solid",
    buttonToneToken: "primary",
    buttonSizeToken: "SM",
    rightSlotType: "ctaButton"
  },
  drawer: {
    enabled: true,
    widthToken: "MD", // theme.dimensions.width.MD
    surfaceStyle: "solid",
    paddingToken: "LG",
    itemGapToken: "MD",
    itemPaddingXToken: "MD",
    itemRadiusToken: "MD",
    activeItemBackgroundToken: "primarySoft"
  },
  bottomTabBar: {
    enabled: true,
    heightToken: "XL",
    surfaceStyle: "glassBlur",
    borderToneToken: "border",
    itemGapToken: "2XS",
    iconSizeToken: "LG",
    fontSizeToken: "XS"
  },
  sidebarMenu: {
    enabled: false // Desativado na surface do cliente
  },
  screenContent: {
    paddingXToken: "LG",
    paddingYToken: "XL",
    maxWidthToken: "CONTAINED"
  }
};
