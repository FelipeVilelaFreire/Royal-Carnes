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
/** `theme` means the page grid configured in Theme > Layout for this company. */
export type UiLayoutGridColumns = "theme" | number;
export type UiLayoutContainerGutter = "none" | "page";

/**
 * Global layout recipe. The actual pixels always come from the active
 * company's Theme tokens; this object only selects their semantic role.
 */
export type UiLayoutConfig = {
  containerGutter: UiLayoutContainerGutter;
  containerWidth: UiLayoutContainerWidth;
  gridColumns: UiLayoutGridColumns;
  gridGap: UiLayoutGap;
  inlineGap: UiLayoutGap;
  stackGap: UiLayoutGap;
};

export const DEFAULT_UI_LAYOUT_CONFIG: UiLayoutConfig = {
  containerGutter: "page",
  containerWidth: "comfortable",
  gridColumns: "theme",
  gridGap: "grid",
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

export const resolveLayoutViewport = (tokens: UiLayoutTokens, viewportWidth: number | undefined): UiLayoutViewport => viewportWidth === undefined || viewportWidth > tokens.layout.breakpointLg
  ? "desktop"
  : viewportWidth > tokens.layout.breakpointMd ? "tablet" : "mobile";

export const resolveLayoutGridGap = (tokens: UiLayoutTokens, viewportWidth?: number) => {
  const viewport = resolveLayoutViewport(tokens, viewportWidth);
  return viewport === "desktop" ? tokens.layout.gridGapDesktop : viewport === "tablet" ? tokens.layout.gridGapTablet : tokens.layout.gridGapMobile;
};

export const resolveLayoutGap = (tokens: UiLayoutTokens, gap: UiLayoutGap, viewportWidth?: number) => gap === "grid" ? resolveLayoutGridGap(tokens, viewportWidth) : tokens.spacing[SPACING_KEY_BY_LAYOUT_GAP[gap]];
export const resolveLayoutSpace = (tokens: UiLayoutTokens, space: UiLayoutSpace | undefined) => !space || space === "none" ? 0 : resolveLayoutGap(tokens, space);

export const resolveLayoutContainerWidth = (tokens: UiLayoutTokens, width: UiLayoutContainerWidth) => width === "full" ? undefined : width === "compact" ? tokens.layout.contentCompact : width === "wide" ? tokens.layout.contentWide : tokens.layout.contentComfortable;

export const resolveLayoutGridColumns = (tokens: UiLayoutTokens, columns: UiLayoutGridColumns, viewportWidth?: number) => {
  const viewport = resolveLayoutViewport(tokens, viewportWidth);
  const themeColumns = viewport === "desktop" ? tokens.layout.gridColumnsDesktop : viewport === "tablet" ? tokens.layout.gridColumnsTablet : tokens.layout.gridColumnsMobile;
  const value = columns === "theme" ? themeColumns : columns;
  return Math.max(1, Math.min(themeColumns, Math.round(Number(value) || 1)));
};

export const resolveLayoutGridItemSpan = (tokens: UiLayoutTokens, span: "full" | number | undefined, viewportWidth?: number) => {
  const columns = resolveLayoutGridColumns(tokens, "theme", viewportWidth);
  return span === "full" ? columns : Math.max(1, Math.min(columns, Math.round(Number(span ?? 1) || 1)));
};

export const resolveLayoutPageGutter = (tokens: UiLayoutTokens, viewportWidth: number | undefined) => {
  const viewport = resolveLayoutViewport(tokens, viewportWidth);
  return viewport === "desktop" ? tokens.layout.pagePaddingDesktop : viewport === "tablet" ? tokens.layout.pagePaddingTablet : tokens.layout.pagePaddingMobile;
};
