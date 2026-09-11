"use client";

import React, { type CSSProperties } from "react";
import { resolveFieldConfig, resolveFieldRecipe, type FieldLevel, type FieldWidth } from "../../shared/core";
import { Text } from "../Text";
import { useUiConfig } from "../UiProvider";
import styles from "./Field.module.css";

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  children?: React.ReactNode;
  htmlFor?: string;
  level?: FieldLevel;
  required?: boolean;
  width?: FieldWidth;
}

type FieldCssProperties = CSSProperties & Record<`--${string}`, string | number | undefined>;

export const Field: React.FC<FieldProps> = ({
  className,
  label,
  description,
  error,
  children,
  htmlFor,
  level,
  required,
  width,
  style,
  ...props
}) => {
  const ui = useUiConfig();
  const theme = (ui.theme || {}) as any;
  const fieldConfig = resolveFieldConfig(ui.field as any);
  const resolved = resolveFieldRecipe(theme, undefined, fieldConfig, { level, width });
  const fieldStyle = {
    "--ui-field-control-gap": `${resolved.controlGap}px`,
    "--ui-field-text-gap": `${resolved.textGap}px`,
    ...style,
  } as FieldCssProperties;
  const LabelComponent = htmlFor ? "label" : "span";

  return (
    <div
      {...props}
      className={[styles.field, className].filter(Boolean).join(" ")}
      data-level={resolved.level}
      data-width={resolved.width}
      style={fieldStyle}
    >
      {label ? (
        <div className={styles.header}>
          <Text as={LabelComponent} htmlFor={htmlFor} tone={String(resolved.label.toneToken)} variant="caption" weight="var(--theme--typography-semibold)">
            {label}
            {required ? " *" : null}
          </Text>
        </div>
      ) : null}
      <div className={styles.controlSlot}>{children}</div>
      {description || error ? (
        <div className={styles.feedback}>
          {description ? <Text tone={String(resolved.description.toneToken)} variant="caption">{description}</Text> : null}
          {error ? <Text tone={String(resolved.error.toneToken)} variant="caption">{error}</Text> : null}
        </div>
      ) : null}
    </div>
  );
};
