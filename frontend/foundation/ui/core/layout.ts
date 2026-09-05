import type { UiSpacingTokens, UiThemePhysicalTokens } from "../../tokens";

export type UiLayoutTokens = Pick<UiThemePhysicalTokens, "layout" | "spacing">;

/** Semantic spacing choices shared by every Layout primitive. */
export type UiLayoutGap = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "control" | "field" | "section" | "grid";
/** `none` is intentionally explicit; every other value resolves through company spacing tokens. */
export type UiLayoutSpace = UiLayoutGap | "none";
export type UiBoxOverflow = "auto" | "hidden" | "scroll" | "visible";
export type UiBoxPosition = "absolute" | "relative" | "static";
export type UiBoxWidth = "auto" | "content" | "full";
export type UiFlexAlign = "center" | "end" | "start" | "stretch";
export type UiFlexDirection = "column" | "column-reverse" | "row" | "row-reverse";
export type UiFlexJustify = "around" | "between" | "center" | "end" | "evenly" | "start";
export type UiLayoutContainerWidth = "compact" | "comfortable" | "wide" | "full";
export type UiLayoutContainerSpanRecipe = Record<UiLayoutViewport, number>;
/** `theme` means the page grid configured in Theme > Layout for this company. */
export type UiLayoutGridColumns = "theme" | number;
export type UiLayoutContainerGutter = "none" | "page";
export type UiLayoutGridTemplate = "asidePrimary" | "halves" | "primaryAside" | "quarters" | "single" | "thirds";
export type UiLayoutGridTemplateSlots = {
  first: number;
  fourth: number;
  second: number;
  third: number;
};
export type UiLayoutGridTemplateRecipe = Record<UiLayoutViewport, UiLayoutGridTemplateSlots>;

/**
 * Global layout recipe. The actual pixels always come from the active
 * company's Theme tokens; this object only selects their semantic role.
 */
export type UiLayoutConfig = {
  containerGutter: UiLayoutContainerGutter;
  containerSpans: Record<UiLayoutContainerWidth, UiLayoutContainerSpanRecipe>;
  containerWidth: UiLayoutContainerWidth;
  gridColumns: UiLayoutGridColumns;
  gridGap: UiLayoutGap;
  gridTemplate: UiLayoutGridTemplate;
  gridTemplates: Record<UiLayoutGridTemplate, UiLayoutGridTemplateRecipe>;
  inlineGap: UiLayoutGap;
  stackGap: UiLayoutGap;
};

export type UiLayoutConfigInput = Partial<Omit<UiLayoutConfig, "containerSpans" | "gridTemplates">> & {
  containerSpans?: Partial<Record<UiLayoutContainerWidth, Partial<UiLayoutContainerSpanRecipe>>>;
  gridTemplates?: Partial<Record<UiLayoutGridTemplate, Partial<Record<UiLayoutViewport, Partial<UiLayoutGridTemplateSlots>>>>>;
};

export const DEFAULT_UI_LAYOUT_CONFIG: UiLayoutConfig = {
  containerGutter: "page",
  containerSpans: {
    compact: { desktop: 12, mobile: 4, tablet: 6 },
    comfortable: { desktop: 16, mobile: 4, tablet: 8 },
    wide: { desktop: 18, mobile: 4, tablet: 8 },
    full: { desktop: 20, mobile: 4, tablet: 8 },
  },
  containerWidth: "full",
  gridColumns: "theme",
  gridGap: "grid",
  gridTemplate: "single",
  gridTemplates: {
    asidePrimary: {
      desktop: { first: 6, fourth: 0, second: 12, third: 0 },
      mobile: { first: 4, fourth: 0, second: 4, third: 0 },
      tablet: { first: 3, fourth: 0, second: 5, third: 0 },
    },
    halves: {
      desktop: { first: 10, fourth: 0, second: 10, third: 0 },
      mobile: { first: 4, fourth: 0, second: 4, third: 0 },
      tablet: { first: 4, fourth: 0, second: 4, third: 0 },
    },
    primaryAside: {
      desktop: { first: 12, fourth: 0, second: 6, third: 0 },
      mobile: { first: 4, fourth: 0, second: 4, third: 0 },
      tablet: { first: 5, fourth: 0, second: 3, third: 0 },
    },
    quarters: {
      desktop: { first: 5, fourth: 5, second: 5, third: 5 },
      mobile: { first: 4, fourth: 4, second: 4, third: 4 },
      tablet: { first: 4, fourth: 4, second: 4, third: 4 },
    },
    single: {
      desktop: { first: 20, fourth: 0, second: 0, third: 0 },
      mobile: { first: 4, fourth: 0, second: 0, third: 0 },
      tablet: { first: 8, fourth: 0, second: 0, third: 0 },
    },
    thirds: {
      desktop: { first: 6, fourth: 0, second: 6, third: 6 },
      mobile: { first: 4, fourth: 0, second: 4, third: 4 },
      tablet: { first: 4, fourth: 0, second: 4, third: 4 },
    },
  },
  inlineGap: "sm",
  stackGap: "md",
};

const SPACING_KEY_BY_LAYOUT_GAP: Record<Exclude<UiLayoutGap, "grid">, keyof UiSpacingTokens> = {
  "2xs": "space2xs",
  xs: "spaceXs",
  sm: "spaceSm",
  md: "spaceMd",
  lg: "spaceLg",
  xl: "spaceXl",
  "2xl": "space2xl",
  "3xl": "space3xl",
  control: "controlGap",
  field: "fieldGap",
  section: "sectionGap",
};

export type UiLayoutViewport = "desktop" | "mobile" | "tablet";

const layoutTokens = (tokens: UiLayoutTokens) => tokens.layout || {};
const spacingTokens = (tokens: UiLayoutTokens) => tokens.spacing || {};
const numberToken = (value: unknown, fallback: number) => Number.isFinite(Number(value)) ? Number(value) : fallback;

export const resolveLayoutConfig = (config?: UiLayoutConfigInput): UiLayoutConfig => ({
  ...DEFAULT_UI_LAYOUT_CONFIG,
  ...config,
  containerSpans: {
    compact: { ...DEFAULT_UI_LAYOUT_CONFIG.containerSpans.compact, ...config?.containerSpans?.compact },
    comfortable: { ...DEFAULT_UI_LAYOUT_CONFIG.containerSpans.comfortable, ...config?.containerSpans?.comfortable },
    wide: { ...DEFAULT_UI_LAYOUT_CONFIG.containerSpans.wide, ...config?.containerSpans?.wide },
    full: { ...DEFAULT_UI_LAYOUT_CONFIG.containerSpans.full, ...config?.containerSpans?.full },
  },
  gridTemplates: {
    asidePrimary: {
      desktop: { ...DEFAULT_UI_LAYOUT_CONFIG.gridTemplates.asidePrimary.desktop, ...config?.gridTemplates?.asidePrimary?.desktop },
      mobile: { ...DEFAULT_UI_LAYOUT_CONFIG.gridTemplates.asidePrimary.mobile, ...config?.gridTemplates?.asidePrimary?.mobile },
      tablet: { ...DEFAULT_UI_LAYOUT_CONFIG.gridTemplates.asidePrimary.tablet, ...config?.gridTemplates?.asidePrimary?.tablet },
    },
    halves: {
      desktop: { ...DEFAULT_UI_LAYOUT_CONFIG.gridTemplates.halves.desktop, ...config?.gridTemplates?.halves?.desktop },
      mobile: { ...DEFAULT_UI_LAYOUT_CONFIG.gridTemplates.halves.mobile, ...config?.gridTemplates?.halves?.mobile },
      tablet: { ...DEFAULT_UI_LAYOUT_CONFIG.gridTemplates.halves.tablet, ...config?.gridTemplates?.halves?.tablet },
    },
    primaryAside: {
      desktop: { ...DEFAULT_UI_LAYOUT_CONFIG.gridTemplates.primaryAside.desktop, ...config?.gridTemplates?.primaryAside?.desktop },
      mobile: { ...DEFAULT_UI_LAYOUT_CONFIG.gridTemplates.primaryAside.mobile, ...config?.gridTemplates?.primaryAside?.mobile },
      tablet: { ...DEFAULT_UI_LAYOUT_CONFIG.gridTemplates.primaryAside.tablet, ...config?.gridTemplates?.primaryAside?.tablet },
    },
    quarters: {
      desktop: { ...DEFAULT_UI_LAYOUT_CONFIG.gridTemplates.quarters.desktop, ...config?.gridTemplates?.quarters?.desktop },
      mobile: { ...DEFAULT_UI_LAYOUT_CONFIG.gridTemplates.quarters.mobile, ...config?.gridTemplates?.quarters?.mobile },
      tablet: { ...DEFAULT_UI_LAYOUT_CONFIG.gridTemplates.quarters.tablet, ...config?.gridTemplates?.quarters?.tablet },
    },
    single: {
      desktop: { ...DEFAULT_UI_LAYOUT_CONFIG.gridTemplates.single.desktop, ...config?.gridTemplates?.single?.desktop },
      mobile: { ...DEFAULT_UI_LAYOUT_CONFIG.gridTemplates.single.mobile, ...config?.gridTemplates?.single?.mobile },
      tablet: { ...DEFAULT_UI_LAYOUT_CONFIG.gridTemplates.single.tablet, ...config?.gridTemplates?.single?.tablet },
    },
    thirds: {
      desktop: { ...DEFAULT_UI_LAYOUT_CONFIG.gridTemplates.thirds.desktop, ...config?.gridTemplates?.thirds?.desktop },
      mobile: { ...DEFAULT_UI_LAYOUT_CONFIG.gridTemplates.thirds.mobile, ...config?.gridTemplates?.thirds?.mobile },
      tablet: { ...DEFAULT_UI_LAYOUT_CONFIG.gridTemplates.thirds.tablet, ...config?.gridTemplates?.thirds?.tablet },
    },
  },
});

export const resolveLayoutViewport = (tokens: UiLayoutTokens, viewportWidth: number | undefined): UiLayoutViewport => viewportWidth === undefined || viewportWidth > numberToken(layoutTokens(tokens).breakpointLg, 1024)
  ? "desktop"
  : viewportWidth > numberToken(layoutTokens(tokens).breakpointMd, 768) ? "tablet" : "mobile";

export const resolveLayoutGridGap = (tokens: UiLayoutTokens, viewportWidth?: number) => {
  const layout = layoutTokens(tokens);
  const spacing = spacingTokens(tokens);
  const viewport = resolveLayoutViewport(tokens, viewportWidth);
  return viewport === "desktop"
    ? numberToken(layout.gridGapDesktop ?? layout.gutterDesktop, numberToken(spacing.spaceLg, 24))
    : viewport === "tablet"
      ? numberToken(layout.gridGapTablet ?? layout.gutterTablet, numberToken(spacing.spaceMd, 16))
      : numberToken(layout.gridGapMobile ?? layout.gutterMobile, numberToken(spacing.spaceSm, 12));
};

export const resolveLayoutGap = (tokens: UiLayoutTokens, gap: UiLayoutGap, viewportWidth?: number) =>
  gap === "grid" ? resolveLayoutGridGap(tokens, viewportWidth) : numberToken(spacingTokens(tokens)[SPACING_KEY_BY_LAYOUT_GAP[gap]], 0);
export const resolveLayoutSpace = (tokens: UiLayoutTokens, space: UiLayoutSpace | undefined) => !space || space === "none" ? 0 : resolveLayoutGap(tokens, space);

const containerContentLimit = (tokens: UiLayoutTokens, width: Exclude<UiLayoutContainerWidth, "full">) => {
  const layout = layoutTokens(tokens);
  if (width === "compact") return numberToken(layout.contentCompact ?? layout.containerSm, 720);
  if (width === "wide") return numberToken(layout.contentWide ?? layout.containerXl, 1280);
  return numberToken(layout.contentComfortable ?? layout.containerLg, 1180);
};

export const resolveLayoutGridColumns = (tokens: UiLayoutTokens, columns: UiLayoutGridColumns, viewportWidth?: number) => {
  const layout = layoutTokens(tokens);
  const viewport = resolveLayoutViewport(tokens, viewportWidth);
  const themeColumns = viewport === "desktop"
    ? numberToken(layout.gridColumnsDesktop ?? layout.desktopCols, 20)
    : viewport === "tablet"
      ? numberToken(layout.gridColumnsTablet ?? layout.tabletCols, 8)
      : numberToken(layout.gridColumnsMobile ?? layout.mobileCols, 4);
  const value = columns === "theme" ? themeColumns : columns;
  return Math.max(1, Math.min(themeColumns, Math.round(Number(value) || 1)));
};

export const resolveLayoutContainerSpan = (tokens: UiLayoutTokens, width: UiLayoutContainerWidth, viewportWidth?: number, config?: UiLayoutConfigInput) => {
  const layout = resolveLayoutConfig(config);
  const viewport = resolveLayoutViewport(tokens, viewportWidth);
  const columns = resolveLayoutGridColumns(tokens, "theme", viewportWidth);
  const span = layout.containerSpans[width][viewport];
  return Math.max(1, Math.min(columns, Math.round(Number(span) || columns)));
};

export const resolveLayoutContainerWidth = (tokens: UiLayoutTokens, width: UiLayoutContainerWidth, viewportWidth?: number, config?: UiLayoutConfigInput) => {
  if (viewportWidth === undefined) return width === "full" ? undefined : containerContentLimit(tokens, width);

  const columns = resolveLayoutGridColumns(tokens, "theme", viewportWidth);
  const span = resolveLayoutContainerSpan(tokens, width, viewportWidth, config);
  const gutter = resolveLayoutPageGutter(tokens, viewportWidth);
  const gap = resolveLayoutGridGap(tokens, viewportWidth);
  const availableWidth = Math.max(0, viewportWidth - gutter * 2);
  const columnsGapWidth = Math.max(0, columns - 1) * gap;
  const columnWidth = Math.max(0, (availableWidth - columnsGapWidth) / columns);
  const spanWidth = span * columnWidth + Math.max(0, span - 1) * gap;
  return width === "full" ? spanWidth : Math.min(containerContentLimit(tokens, width), spanWidth);
};

export const resolveLayoutGridItemSpan = (tokens: UiLayoutTokens, span: "full" | number | undefined, viewportWidth?: number) => {
  const columns = resolveLayoutGridColumns(tokens, "theme", viewportWidth);
  return span === "full" ? columns : Math.max(1, Math.min(columns, Math.round(Number(span ?? 1) || 1)));
};

export const resolveLayoutGridTemplateSpans = (tokens: UiLayoutTokens, template: UiLayoutGridTemplate, viewportWidth?: number, config?: UiLayoutConfigInput) => {
  const layout = resolveLayoutConfig(config);
  const viewport = resolveLayoutViewport(tokens, viewportWidth);
  const columns = resolveLayoutGridColumns(tokens, "theme", viewportWidth);
  const slots = layout.gridTemplates[template][viewport];
  return [slots.first, slots.second, slots.third, slots.fourth]
    .map((span) => Math.max(0, Math.min(columns, Math.round(Number(span) || 0))))
    .filter((span) => span > 0);
};

export const resolveLayoutPageGutter = (tokens: UiLayoutTokens, viewportWidth: number | undefined) => {
  const layout = layoutTokens(tokens);
  const spacing = spacingTokens(tokens);
  const viewport = resolveLayoutViewport(tokens, viewportWidth);
  return viewport === "desktop"
    ? numberToken(layout.pagePaddingDesktop ?? layout.gutterDesktop, numberToken(spacing.spaceLg, 24))
    : viewport === "tablet"
      ? numberToken(layout.pagePaddingTablet ?? layout.gutterTablet, numberToken(spacing.spaceMd, 16))
      : numberToken(layout.pagePaddingMobile ?? layout.gutterMobile, numberToken(spacing.spaceSm, 12));
};
