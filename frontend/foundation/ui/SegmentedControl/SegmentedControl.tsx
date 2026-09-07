"use client";

import React, { type CSSProperties } from "react";
import {
  resolveSegmentedControlConfig,
  resolveSegmentedControlRecipe,
  type SegmentedControlLevel,
  type SegmentedControlOption,
  type SegmentedControlVariant,
  type SegmentedControlWidth,
} from "../core";
import { Button } from "../Button";
import { Surface } from "../Surface";
import { useUiConfig } from "../UiProvider";
import styles from "./SegmentedControl.module.css";

export interface SegmentedControlProps {
  items: SegmentedControlOption[];
  level?: SegmentedControlLevel;
  value?: string;
  variant?: SegmentedControlVariant;
  width?: SegmentedControlWidth;
  onChange?: (key: string) => void;
}

type SegmentedControlCssProperties = CSSProperties & Record<`--${string}`, string | number | undefined>;

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  items = [],
  level,
  value,
  variant,
  width,
  onChange
}) => {
  const ui = useUiConfig();
  const theme = (ui.theme || {}) as any;
  const config = resolveSegmentedControlConfig(ui.segmentedControl as any);
  const resolved = resolveSegmentedControlRecipe(theme, undefined, config, { level, variant, width });
  const trackStyle = {
    "--ui-segmented-control-gap": `${resolved.gap}px`,
    "--ui-segmented-control-padding": `${resolved.padding}px`,
  } as SegmentedControlCssProperties;

  return (
    <Surface
      appearance={resolved.track.appearance as any}
      className={styles.root}
      data-level={resolved.level}
      data-variant={resolved.variant}
      data-width={resolved.width}
      geometry={{ paddingX: resolved.padding, paddingY: resolved.padding, radius: resolved.trackSurfaceRecipe.radius }}
      recipe={resolved.trackSurfaceRecipe}
      style={trackStyle}
      tone={resolved.track.tone}
    >
      {items.map((item) => {
        const isActive = value === item.key;
        const option = isActive ? resolved.activeOption : resolved.option;
        return (
          <Button
            appearance={option.appearance}
            className={styles.option}
            disabled={item.disabled}
            key={item.key}
            onClick={() => onChange?.(item.key)}
            size={option.level}
            style={option.minWidth ? { minWidth: option.minWidth } : undefined}
            tone={option.tone}
          >
            {item.label}
          </Button>
        );
      })}
    </Surface>
  );
};
