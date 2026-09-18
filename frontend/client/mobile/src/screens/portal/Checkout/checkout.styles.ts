export const createCheckoutStyles = (theme: any) => {
  const colors = theme.colors || theme;
  const spacing = theme.tokens?.spacing || {};
  const radius = theme.tokens?.radius || {};
  const borders = theme.tokens?.borders || {};
  const spaceSm = spacing.spaceSm ?? 8;
  const spaceMd = spacing.spaceMd ?? 12;
  const spaceLg = spacing.spaceLg ?? 16;
  const spaceXl = spacing.spaceXl ?? spaceLg;
  const space2xl = spacing.space2xl ?? spaceXl;
  const space3xl = spacing.space3xl ?? space2xl;
  const radiusMd = radius.md ?? 12;
  const radiusLg = radius.lg ?? 16;
  const stroke = borders.xs ?? 1;

  return {
    stack: {
      gap: spaceLg,
    },
    compactStack: {
      gap: spaceSm,
    },
    page: {
      gap: spaceLg,
      paddingBottom: spaceLg,
      paddingHorizontal: spaceLg,
    },
    panel: {
      backgroundColor: colors.surfaceContainer,
      borderColor: colors.border,
      borderRadius: radiusLg,
      borderWidth: stroke,
      gap: spaceMd,
      padding: spaceLg,
    },
    option: {
      backgroundColor: colors.surfaceContainer,
      borderColor: colors.border,
      borderRadius: radiusMd,
      borderWidth: stroke,
      gap: spaceSm,
      padding: spaceMd,
    },
    optionActive: {
      borderColor: colors.copper,
    },
    modeRail: {
      marginHorizontal: -spaceLg,
      paddingHorizontal: spaceLg,
    },
    modeCard: {
      borderColor: colors.border,
      borderRadius: radiusLg,
      borderWidth: stroke,
      minHeight: space3xl + spaceXl,
      minWidth: space3xl + space2xl,
      padding: spaceMd,
    },
    modeCardActive: {
      backgroundColor: colors.surfaceContainer,
      borderColor: colors.copper,
      borderRadius: radiusLg,
      borderWidth: stroke,
      minHeight: space3xl + spaceXl,
      minWidth: space3xl + space2xl,
      padding: spaceMd,
    },
    modeCardCompact: {
      borderColor: colors.border,
      borderRadius: radiusLg,
      borderWidth: stroke,
      minWidth: space3xl + space2xl,
      padding: spaceSm,
    },
    modeCardCompactActive: {
      backgroundColor: colors.surfaceContainer,
      borderColor: colors.copper,
      borderRadius: radiusLg,
      borderWidth: stroke,
      minWidth: space3xl + space2xl,
      padding: spaceSm,
    },
    modeCardContent: {
      gap: spaceSm,
    },
    tracker: {
      backgroundColor: colors.surfaceContainer,
      borderColor: colors.border,
      borderRadius: radiusMd,
      borderWidth: stroke,
      padding: spaceSm,
    },
    trackerRail: {
      marginHorizontal: -spaceSm,
      paddingHorizontal: spaceSm,
    },
    trackerStep: {
      borderColor: colors.border,
      borderRadius: radiusMd,
      borderWidth: stroke,
      minWidth: space3xl,
      padding: spaceSm,
    },
    trackerStepCurrent: {
      backgroundColor: colors.surfaceContainer,
      borderColor: colors.copper,
      borderRadius: radiusMd,
      borderWidth: stroke,
      minWidth: space3xl,
      padding: spaceSm,
    },
    summaryRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    action: {
      backgroundColor: colors.text,
      borderColor: colors.text,
    },
    muted: {
      color: colors.textMuted,
    },
    title: {
      color: colors.text,
      fontWeight: "700",
    },
    accent: {
      color: colors.copper,
      fontWeight: "700",
    },
  };
};
