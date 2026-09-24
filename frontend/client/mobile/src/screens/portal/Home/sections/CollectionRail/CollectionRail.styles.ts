export const createCollectionRailStyles = (theme: any) => {
  const colors = theme.colors || theme;
  const spacing = theme.tokens?.spacing || {};
  const dimensions = theme.tokens?.dimensions || {};
  const spaceXs = spacing.spaceXs ?? 8;
  const spaceLg = spacing.spaceLg ?? 24;
  const spaceXl = spacing.spaceXl ?? 32;
  const featuredHeight = dimensions.minHeight?.lg ?? dimensions.height?.["3xl"] ?? 320;
  const secondaryHeight = dimensions.minHeight?.md ?? dimensions.height?.["2xl"] ?? 224;

  return {
    root: {
      paddingBottom: spaceXl,
      paddingTop: spaceXl,
    },
    cards: {
      gap: spaceXl,
      paddingHorizontal: spaceLg,
    },
    secondaryCards: {
      gap: spaceLg,
    },
    card: {
      backgroundColor: colors.background,
      borderColor: colors.primary,
      borderWidth: dimensions.border?.hairline ?? 1,
      justifyContent: "flex-end" as const,
      overflow: "hidden" as const,
      padding: spaceLg,
      position: "relative" as const,
    },
    featuredCard: {
      height: featuredHeight,
      width: "100%",
    },
    secondaryCard: {
      height: secondaryHeight,
      width: "100%",
    },
    image: {
      bottom: 0,
      height: "100%",
      left: 0,
      position: "absolute" as const,
      right: 0,
      top: 0,
      width: "100%",
    },
    scrim: {
      backgroundColor: colors.background,
      bottom: 0,
      left: 0,
      opacity: 0.72,
      position: "absolute" as const,
      right: 0,
      top: 0,
    },
    cardContent: {
      gap: spaceXs,
      position: "relative" as const,
    },
    name: {
      color: colors.text,
    },
    description: {
      color: colors.textMuted,
    },
  };
};
