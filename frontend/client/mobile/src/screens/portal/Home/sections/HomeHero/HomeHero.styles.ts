export const createHomeHeroStyles = (theme: any) => {
  const colors = theme.colors || theme;
  const spacing = theme.tokens?.spacing || {};
  const dimensions = theme.tokens?.dimensions || {};
  const spaceMd = spacing.spaceMd ?? 12;
  const spaceLg = spacing.spaceLg ?? 16;
  const spaceXl = spacing.spaceXl ?? spaceLg;
  const space3xl = spacing.space3xl ?? spaceXl;
  const heroMinHeight = dimensions.minHeight?.xl ?? dimensions.height?.["3xl"] ?? 480;

  return {
    root: {
      backgroundColor: colors.background,
      minHeight: heroMinHeight,
      overflow: "hidden",
      position: "relative",
    },
    image: {
      bottom: 0,
      height: "100%",
      left: 0,
      position: "absolute",
      right: 0,
      top: 0,
      width: "100%",
    },
    overlay: {
      backgroundColor: colors.background,
      bottom: 0,
      left: 0,
      opacity: 0.65,
      position: "absolute",
      right: 0,
      top: 0,
    },
    content: {
      flex: 1,
      gap: spaceMd,
      justifyContent: "flex-end",
      minHeight: heroMinHeight,
      padding: space3xl,
    },
    actions: {
      gap: spaceMd,
      marginTop: spaceMd,
    },
    action: {
      width: "100%",
    },
    eyebrow: {
      color: colors.primary,
      fontWeight: "700",
    },
    title: {
      color: colors.text,
    },
    description: {
      color: colors.text,
    },
    membership: {
      color: colors.text,
      marginTop: spaceLg,
    },
  };
};
