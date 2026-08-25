import type { UiTypographyTokens } from "../../semi-composed/core";

export type UiTextSize = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type UiTextWeight = "thin" | "extraLight" | "light" | "regular" | "book" | "medium" | "semibold" | "bold" | "extraBold" | "black";
/**
 * A textual slot may keep the size/weight owned by its parent family while
 * still receiving font and color from the active company's Text primitive.
 * This is deliberately render-only: global Text recipes remain semantic.
 */
export type UiTextRenderSize = UiTextSize | "inherit";
export type UiTextRenderWeight = UiTextWeight | "inherit";
export type UiTextRenderTone = UiTextTone | "inherit";
export type UiTextTone = "accent" | "default" | "subtle" | "muted" | "inverse" | "primary" | "success" | "warning" | "danger";
export type UiTextFont = "body" | "heading" | "mono" | "dmSans" | "firaCode" | "ibmPlexSans" | "inter" | "jetbrainsMono" | "lora" | "manrope" | "merriweather" | "montserrat" | "nunito" | "playfairDisplay" | "poppins" | "serif" | "systemSans" | "systemSerif" | "workSans";
export type UiTextConfig = {
  bodyFont?: UiTextFont;
  bodyLetterSpacing?: UiTextSize;
  bodyLineHeight?: UiTextSize;
  bodySize: UiTextSize;
  bodyTone?: UiTextTone;
  bodyWeight: UiTextWeight;
  captionSize: UiTextSize;
  captionFont?: UiTextFont;
  captionLetterSpacing?: UiTextSize;
  captionLineHeight?: UiTextSize;
  captionTone?: UiTextTone;
  captionWeight?: UiTextWeight;
  heading1Font?: UiTextFont;
  heading1LetterSpacing?: UiTextSize;
  heading1LineHeight?: UiTextSize;
  heading1Size: UiTextSize;
  heading1Tone?: UiTextTone;
  heading1Weight?: UiTextWeight;
  heading2Font?: UiTextFont;
  heading2LetterSpacing?: UiTextSize;
  heading2LineHeight?: UiTextSize;
  heading2Size: UiTextSize;
  heading2Tone?: UiTextTone;
  heading2Weight?: UiTextWeight;
  heading3Font?: UiTextFont;
  heading3LetterSpacing?: UiTextSize;
  heading3LineHeight?: UiTextSize;
  heading3Size: UiTextSize;
  heading3Tone?: UiTextTone;
  heading3Weight?: UiTextWeight;
  heading4Font?: UiTextFont;
  heading4LetterSpacing?: UiTextSize;
  heading4LineHeight?: UiTextSize;
  heading4Size: UiTextSize;
  heading4Tone?: UiTextTone;
  heading4Weight?: UiTextWeight;
  heading5Font?: UiTextFont;
  heading5LetterSpacing?: UiTextSize;
  heading5LineHeight?: UiTextSize;
  heading5Size: UiTextSize;
  heading5Tone?: UiTextTone;
  heading5Weight?: UiTextWeight;
  heading6Font?: UiTextFont;
  heading6LetterSpacing?: UiTextSize;
  heading6LineHeight?: UiTextSize;
  heading6Size: UiTextSize;
  heading6Tone?: UiTextTone;
  heading6Weight?: UiTextWeight;
  labelFont?: UiTextFont;
  labelLetterSpacing?: UiTextSize;
  labelLineHeight?: UiTextSize;
  labelSize: UiTextSize;
  labelTone?: UiTextTone;
  labelWeight: UiTextWeight;
};

export const DEFAULT_UI_TEXT_CONFIG: UiTextConfig = {
  bodySize: "md", bodyWeight: "regular", captionSize: "xs", heading1Size: "3xl", heading2Size: "2xl", heading3Size: "xl", heading4Size: "lg", heading5Size: "md", heading6Size: "sm", labelSize: "sm", labelWeight: "semibold",
};

/** Known portable families. Named fonts resolve when bundled by the surface. */
export const TEXT_FONT_OPTIONS = [
  { label: "Inter", value: "Inter, ui-sans-serif, system-ui, sans-serif" },
  { label: "Sans do sistema", value: "ui-sans-serif, system-ui, sans-serif" },
  { label: "Montserrat", value: "Montserrat, ui-sans-serif, system-ui, sans-serif" },
  { label: "IBM Plex Sans", value: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif" },
  { label: "Manrope", value: "Manrope, ui-sans-serif, system-ui, sans-serif" },
  { label: "DM Sans", value: "DM Sans, ui-sans-serif, system-ui, sans-serif" },
  { label: "Poppins", value: "Poppins, ui-sans-serif, system-ui, sans-serif" },
  { label: "Nunito", value: "Nunito, ui-sans-serif, system-ui, sans-serif" },
  { label: "Work Sans", value: "Work Sans, ui-sans-serif, system-ui, sans-serif" },
  { label: "Playfair Display", value: "Playfair Display, ui-serif, Georgia, serif" },
  { label: "Lora", value: "Lora, ui-serif, Georgia, serif" },
  { label: "Merriweather", value: "Merriweather, ui-serif, Georgia, serif" },
  { label: "Serif editorial", value: "ui-serif, Georgia, serif" },
  { label: "JetBrains Mono", value: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace" },
  { label: "Fira Code", value: "Fira Code, ui-monospace, SFMono-Regular, Menlo, monospace" },
  { label: "Monoespacada", value: "ui-monospace, SFMono-Regular, Menlo, monospace" },
] as const;

export const resolveTextFontFamily = (font: UiTextFont | undefined, families: Pick<UiTypographyTokens, "bodyFamily" | "headingFamily" | "monoFamily">) =>
  font === "heading" ? families.headingFamily
    : font === "mono" ? families.monoFamily
      : font === "inter" ? TEXT_FONT_OPTIONS[0].value
        : font === "systemSans" ? TEXT_FONT_OPTIONS[1].value
          : font === "montserrat" ? TEXT_FONT_OPTIONS[2].value
            : font === "ibmPlexSans" ? TEXT_FONT_OPTIONS[3].value
              : font === "manrope" ? TEXT_FONT_OPTIONS[4].value
                : font === "dmSans" ? TEXT_FONT_OPTIONS[5].value
                  : font === "poppins" ? TEXT_FONT_OPTIONS[6].value
                    : font === "nunito" ? TEXT_FONT_OPTIONS[7].value
                      : font === "workSans" ? TEXT_FONT_OPTIONS[8].value
                        : font === "playfairDisplay" ? TEXT_FONT_OPTIONS[9].value
                          : font === "lora" ? TEXT_FONT_OPTIONS[10].value
                            : font === "merriweather" ? TEXT_FONT_OPTIONS[11].value
                              : font === "systemSerif" || font === "serif" ? TEXT_FONT_OPTIONS[12].value
                                : font === "jetbrainsMono" ? TEXT_FONT_OPTIONS[13].value
                                  : font === "firaCode" ? TEXT_FONT_OPTIONS[14].value
                                    : families.bodyFamily;

export const TEXT_SIZE_TOKEN: Record<UiTextSize, keyof Pick<UiTypographyTokens, "size2xs" | "sizeXs" | "sizeSm" | "sizeMd" | "sizeLg" | "sizeXl" | "size2xl" | "size3xl">> = {
  "2xs": "size2xs", xs: "sizeXs", sm: "sizeSm", md: "sizeMd", lg: "sizeLg", xl: "sizeXl", "2xl": "size2xl", "3xl": "size3xl",
};

export const TEXT_LINE_HEIGHT_TOKEN: Record<UiTextSize, keyof Pick<UiTypographyTokens, "lineHeight2xs" | "lineHeightXs" | "lineHeightSm" | "lineHeightMd" | "lineHeightLg" | "lineHeightXl" | "lineHeight2xl" | "lineHeight3xl">> = {
  "2xs": "lineHeight2xs", xs: "lineHeightXs", sm: "lineHeightSm", md: "lineHeightMd", lg: "lineHeightLg", xl: "lineHeightXl", "2xl": "lineHeight2xl", "3xl": "lineHeight3xl",
};

export const TEXT_LETTER_SPACING_TOKEN: Record<UiTextSize, keyof Pick<UiTypographyTokens, "letterSpacing2xs" | "letterSpacingXs" | "letterSpacingSm" | "letterSpacingMd" | "letterSpacingLg" | "letterSpacingXl" | "letterSpacing2xl" | "letterSpacing3xl">> = {
  "2xs": "letterSpacing2xs", xs: "letterSpacingXs", sm: "letterSpacingSm", md: "letterSpacingMd", lg: "letterSpacingLg", xl: "letterSpacingXl", "2xl": "letterSpacing2xl", "3xl": "letterSpacing3xl",
};

export const TEXT_WEIGHT_TOKEN: Record<UiTextWeight, keyof Pick<UiTypographyTokens, "weightThin" | "weightExtraLight" | "weightLight" | "weightRegular" | "weightBook" | "weightMedium" | "weightSemibold" | "weightBold" | "weightExtraBold" | "weightBlack">> = {
  thin: "weightThin", extraLight: "weightExtraLight", light: "weightLight", regular: "weightRegular", book: "weightBook", medium: "weightMedium", semibold: "weightSemibold", bold: "weightBold", extraBold: "weightExtraBold", black: "weightBlack",
};

export const HEADING_SIZE_BY_LEVEL: Record<1 | 2 | 3 | 4 | 5 | 6, UiTextSize> = {
  1: "3xl", 2: "2xl", 3: "xl", 4: "lg", 5: "md", 6: "sm",
};

export const resolveHeadingSize = (config: UiTextConfig, level: 1 | 2 | 3 | 4 | 5 | 6): UiTextSize => config[`heading${level}Size`];
const headingValue = <T>(config: UiTextConfig, level: 1 | 2 | 3 | 4 | 5 | 6, key: string) => {
  const record = config as UiTextConfig & Record<string, T | undefined>;
  return record[`h${level}${key}`] ?? record[`heading${level}${key}`];
};
export const resolveHeadingFont = (config: UiTextConfig, level: 1 | 2 | 3 | 4 | 5 | 6): UiTextFont => headingValue<UiTextFont>(config, level, "Font") || "heading";
export const resolveHeadingLineHeight = (config: UiTextConfig, level: 1 | 2 | 3 | 4 | 5 | 6): UiTextSize => headingValue<UiTextSize>(config, level, "LineHeight") || "sm";
export const resolveHeadingLetterSpacing = (config: UiTextConfig, level: 1 | 2 | 3 | 4 | 5 | 6): UiTextSize => headingValue<UiTextSize>(config, level, "LetterSpacing") || "sm";
export const resolveHeadingTone = (config: UiTextConfig, level: 1 | 2 | 3 | 4 | 5 | 6): UiTextTone => headingValue<UiTextTone>(config, level, "Tone") || "default";
export const resolveHeadingWeight = (config: UiTextConfig, level: 1 | 2 | 3 | 4 | 5 | 6): UiTextWeight => headingValue<UiTextWeight>(config, level, "Weight") || "bold";
