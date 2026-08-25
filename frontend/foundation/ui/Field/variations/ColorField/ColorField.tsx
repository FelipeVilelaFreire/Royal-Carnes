"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  resolveColorFieldConfig,
  resolveColorFieldRecipe,
  type ColorFieldConfig,
  type ColorFieldLevel,
  type ColorFieldPreview,
  type ColorFieldWidth,
} from "../../../core";
import { Field } from "../../Field";
import { Surface } from "../../../Surface";
import { useUiConfig } from "../../../UiProvider";
import styles from "./ColorField.module.css";

export type ColorFieldProps = {
  description?: ReactNode;
  error?: ReactNode;
  id?: string;
  label?: ReactNode;
  level?: ColorFieldLevel;
  onValueChange?: (value: string) => void;
  preview?: ColorFieldPreview;
  required?: boolean;
  value: string;
  width?: ColorFieldWidth;
};

const resolveManifestColorFieldConfig = (colorField: unknown): Partial<ColorFieldConfig> | undefined => {
  if (!colorField || typeof colorField !== "object") return undefined;
  const candidate = colorField as Partial<ColorFieldConfig>;
  return candidate.defaults || candidate.recipes ? candidate : undefined;
};

export function ColorField({
  description,
  error,
  id,
  label,
  level,
  onValueChange,
  preview,
  required,
  value,
  width,
}: ColorFieldProps) {
  const ui = useUiConfig();
  const theme = ui.theme as NonNullable<typeof ui.theme>;
  const config = resolveColorFieldConfig(resolveManifestColorFieldConfig(ui.colorField));
  const resolved = resolveColorFieldRecipe(theme, undefined, config, { level, preview, width });
  const pickerValue = /^#[0-9a-f]{6}$/i.test(value) ? value : undefined;
  const feedback = description ?? value;

  return (
    <Field
      description={feedback}
      error={error}
      htmlFor={id}
      label={label}
      level={resolved.fieldLevel}
      required={required}
      width={resolved.width}
    >
      <div
        className={styles.content}
        style={{
          "--ui-color-field-content-gap": `${resolved.contentGap}px`,
          "--ui-color-field-preview-height": `${resolved.previewHeight}px`,
          "--ui-color-field-value": value,
        } as CSSProperties}
      >
        <Surface
          appearance={resolved.preview.appearance}
          className={styles.swatch}
          data-preview={resolved.previewMode}
          recipe={resolved.previewSurfaceRecipe}
          surfaceOpacity={100}
          tone={resolved.preview.tone}
        >
          <div className={styles.tracker} />
          <input
            aria-label={typeof label === "string" ? label : undefined}
            className={styles.picker}
            id={id}
            onChange={(event) => onValueChange?.(event.currentTarget.value)}
            type="color"
            value={pickerValue}
          />
        </Surface>
      </div>
    </Field>
  );
}
