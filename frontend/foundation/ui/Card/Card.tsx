"use client";

import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import {
  resolveCardConfig,
  resolveCardRecipe,
  type CardConfig,
  type CardLevel,
} from "../core";
import { Surface } from "../Surface";
import { useUiConfig } from "../UiProvider";
import styles from "./Card.module.css";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  size?: CardLevel;
};

const resolveManifestCardConfig = (card: unknown): Partial<CardConfig> | undefined => {
  if (!card || typeof card !== "object") return undefined;
  const candidate = card as Partial<CardConfig>;
  return candidate.defaults || candidate.recipes ? candidate : undefined;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { children, className, size, style, ...props },
  ref
) {
  const ui = useUiConfig();
  const theme = (ui.theme || {}) as any;
  const cardConfig = resolveCardConfig(resolveManifestCardConfig(ui.card));
  const resolved = resolveCardRecipe(theme, undefined, cardConfig, { level: size as any });
  const cardStyle = {
    "--ui-card-gap": `${resolved.gap}px`,
    "--ui-card-padding-x": `${resolved.padding}px`,
    "--ui-card-padding-y": `${resolved.padding}px`,
    ...style,
  } as CSSProperties;

  return (
    <Surface
      {...props}
      ref={ref}
      className={[styles.card, className].filter(Boolean).join(" ")}
      data-size={resolved.level}
      geometry={{
        borderWidth: resolved.surfaceRecipe.stroke.width,
        paddingX: resolved.padding,
        paddingY: resolved.padding,
        radius: resolved.surfaceRecipe.radius,
      }}
      recipe={resolved.surfaceRecipe}
      shadowMode="outer"
      style={cardStyle}
    >
      {children}
    </Surface>
  );
});
