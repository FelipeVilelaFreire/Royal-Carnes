export const createPedidoStyles = (theme: any) => {
  const colors = theme.colors || theme;
  const spacing = theme.tokens?.spacing || {};
  const radius = theme.tokens?.radius || {};
  const borders = theme.tokens?.borders || {};
  const spaceSm = spacing.spaceSm ?? 8;
  const spaceMd = spacing.spaceMd ?? 12;
  const spaceLg = spacing.spaceLg ?? 16;
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
      padding: spaceLg,
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
