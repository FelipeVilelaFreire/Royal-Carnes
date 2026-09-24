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
    deliveryDayPicker: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spaceSm,
    },
    deliveryDayButton: {
      alignItems: "center",
      justifyContent: "center",
      minHeight: spaceLg + spaceSm,
      minWidth: spaceLg + spaceSm,
      padding: spaceSm,
    },
    deliveryDayInput: {
      minHeight: spaceLg + spaceSm,
      minWidth: spaceLg + spaceSm,
      padding: spaceSm,
      textAlign: "center",
      width: spaceLg + spaceSm,
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
    summaryBadge: {
      color: colors.copper,
      fontWeight: "700",
      textAlign: "right",
    },
    summaryProgress: {
      flexDirection: "row",
      gap: spaceSm,
      justifyContent: "flex-end",
    },
    summaryStep: {
      borderColor: colors.border,
      borderRadius: radiusMd,
      borderWidth: stroke,
      color: colors.textMuted,
      minWidth: spaceLg + spaceSm,
      paddingHorizontal: spaceSm,
      paddingVertical: spaceSm,
      textAlign: "center",
    },
    summaryStepCurrent: {
      backgroundColor: colors.copper,
      borderColor: colors.copper,
      color: colors.surface,
    },
    summaryCapacity: {
      borderColor: colors.border,
      borderRadius: radiusMd,
      borderWidth: stroke,
      gap: spaceSm,
      padding: spaceMd,
    },
    summaryProduct: {
      borderColor: colors.border,
      borderRadius: radiusMd,
      borderWidth: stroke,
      padding: spaceMd,
    },
    summaryQuantityControl: {
      alignItems: "center",
      flexDirection: "row",
      gap: spaceSm,
    },
    summaryQuantityButton: {
      alignItems: "center",
      justifyContent: "center",
      minHeight: spaceLg + spaceSm,
      minWidth: spaceLg + spaceSm,
      padding: spaceSm,
    },
    summaryQuantity: {
      color: colors.text,
      fontWeight: "700",
      minWidth: spaceLg,
      textAlign: "center",
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
