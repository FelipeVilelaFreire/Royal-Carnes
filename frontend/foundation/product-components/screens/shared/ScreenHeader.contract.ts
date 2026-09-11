export type ScreenHeaderMobileMode = "collapsible" | "compact" | "full";
export type ScreenHeaderMobileGutter = "none" | "page";

export interface ScreenHeaderContent {
  description?: string;
  eyebrow?: string;
  mobileTitle?: string;
  title: string;
}

export const resolveScreenHeaderMobileTitle = ({ mobileTitle, title }: ScreenHeaderContent) => mobileTitle || title;

export const shouldRenderScreenHeaderDescription = (mode: ScreenHeaderMobileMode) => mode === "full";

export const normalizeScreenHeaderScrollProgress = (value?: number) => Math.min(Math.max(value || 0, 0), 1);
