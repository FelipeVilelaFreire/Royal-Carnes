export type ScreenHeaderMobileMode = "collapsible" | "compact" | "full";
export type ScreenHeaderMobileGutter = "none" | "page";

export interface ScreenHeaderContent {
  description?: string;
  eyebrow?: string;
  mobileTitle?: string;
  title: string;
}

export const resolveScreenHeaderMobileTitle = ({ mobileTitle, title }: ScreenHeaderContent) => mobileTitle || title;

/**
 * A compact header is intentionally title-only. The other modes preserve the
 * route context: `full` keeps it static and `collapsible` progressively folds
 * it away while the user begins reading the screen content.
 */
export const shouldRenderScreenHeaderDescription = (mode: ScreenHeaderMobileMode) => mode !== "compact";

export const normalizeScreenHeaderScrollProgress = (value?: number) => Math.min(Math.max(value || 0, 0), 1);
