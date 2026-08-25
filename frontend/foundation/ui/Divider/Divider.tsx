"use client";

import { forwardRef, type HTMLAttributes } from "react";
import {
  resolveDividerConfig,
  resolveDividerRecipe,
  type DividerConfig,
  type DividerLevel,
} from "../core";
import { Surface } from "../Surface";
import { useUiConfig } from "../UiProvider";
import styles from "./Divider.module.css";

export type DividerProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
  size?: DividerLevel;
};

const resolveManifestDividerConfig = (divider: unknown): Partial<DividerConfig> | undefined => {
  if (!divider || typeof divider !== "object") return undefined;
  const candidate = divider as Partial<DividerConfig>;
  return candidate.defaults || candidate.recipes ? candidate : undefined;
};

export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { className, orientation = "horizontal", size, style, ...props },
  ref
) {
  const ui = useUiConfig();
  const theme = (ui.theme || {}) as any;
  const dividerConfig = resolveDividerConfig(resolveManifestDividerConfig(ui.divider));
  const resolved = resolveDividerRecipe(theme, undefined, dividerConfig, { level: size as any, orientation });

  return (
    <Surface
      {...props}
      ref={ref}
      className={[styles.divider, className].filter(Boolean).join(" ")}
      data-orientation={orientation}
      data-size={resolved.level}
      style={style}
    />
  );
});
