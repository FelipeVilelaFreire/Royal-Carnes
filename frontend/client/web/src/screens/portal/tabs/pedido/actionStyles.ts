import type { CSSProperties } from "react";

type CheckoutActionTokens = {
  background?: string;
  border: string;
  surfaceContainer: string;
  text: string;
  textMuted: string;
};

export const getCheckoutPrimaryActionStyle = (tokens: CheckoutActionTokens, extra?: CSSProperties) => ({
  "--ui-surface-bg": tokens.text,
  "--ui-surface-border": tokens.text,
  "--ui-surface-color": tokens.background || tokens.surfaceContainer,
  ...extra,
}) as CSSProperties;

export const getCheckoutSubtleActionStyle = (tokens: CheckoutActionTokens, extra?: CSSProperties) => ({
  "--ui-surface-bg": "transparent",
  "--ui-surface-border": tokens.border,
  "--ui-surface-color": tokens.text,
  ...extra,
}) as CSSProperties;
