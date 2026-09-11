import React from "react";
import { Stack } from "@foundation/ui/native/Layout";
import { Surface } from "@foundation/ui/native/Surface";
import { Text } from "@foundation/ui/native/Text";
import { useUi } from "@foundation/ui/native/context";
import {
  resolveScreenHeaderMobileTitle,
  normalizeScreenHeaderScrollProgress,
  shouldRenderScreenHeaderDescription,
  type ScreenHeaderContent,
  type ScreenHeaderMobileMode,
} from "../../shared";

export interface ScreenHeaderProps extends ScreenHeaderContent {
  collapsed?: boolean;
  mobileMode?: ScreenHeaderMobileMode;
  scrollProgress?: number;
  showScrollBorder?: boolean;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  collapsed = false,
  description,
  eyebrow,
  mobileMode,
  mobileTitle,
  scrollProgress,
  showScrollBorder = true,
  title,
}) => {
  const { designSystem } = useUi();
  const resolvedMobileMode: ScreenHeaderMobileMode = mobileMode ?? "compact";
  const spacing = designSystem.theme.tokens.spacing;
  const typography = designSystem.theme.tokens.typography;
  const borders = designSystem.theme.tokens.borders;
  const colors = designSystem.theme.colors;
  const resolvedScrollProgress = resolvedMobileMode === "collapsible"
    ? normalizeScreenHeaderScrollProgress(scrollProgress ?? (collapsed ? 1 : 0))
    : 0;
  const expandedPadding = Number(spacing?.spaceMd || 0);
  const collapsedPadding = Number(spacing?.spaceSm || expandedPadding);
  const expandedTitleSize = Number(typography?.sizeXl || 0);
  const collapsedTitleSize = Number(typography?.sizeLg || expandedTitleSize);
  const expandedTitleLineHeight = Number(typography?.lineHeightXl || 0);
  const collapsedTitleLineHeight = Number(typography?.lineHeightLg || expandedTitleLineHeight);
  const interpolate = (from: number, to: number) => from + ((to - from) * resolvedScrollProgress);
  const headerStyle = {
    borderBottomColor: showScrollBorder ? colors?.border : undefined,
    borderBottomWidth: showScrollBorder ? Number(borders?.medium || 0) * resolvedScrollProgress : Number(borders?.none || 0),
    borderWidth: Number(borders?.none || 0),
    paddingHorizontal: spacing?.spaceXl,
    paddingVertical: interpolate(expandedPadding, collapsedPadding),
  };
  const titleStyle = {
    fontSize: interpolate(expandedTitleSize, collapsedTitleSize),
    lineHeight: interpolate(expandedTitleLineHeight, collapsedTitleLineHeight),
  };

  return (
    <Surface appearance={resolvedMobileMode === "collapsible" ? "soft" : "transparent"} style={headerStyle}>
      <Stack gap="sm">
        {eyebrow && resolvedMobileMode === "full" ? <Text tone="primary" variant="caption" weight="bold">{eyebrow}</Text> : null}
        <Text style={titleStyle} variant="h2" weight="bold">
          {resolveScreenHeaderMobileTitle({ mobileTitle, title })}
        </Text>
        {description && shouldRenderScreenHeaderDescription(resolvedMobileMode) ? <Text tone="muted">{description}</Text> : null}
      </Stack>
    </Surface>
  );
};
