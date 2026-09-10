import React, { type ReactNode } from "react";
import { mergeStyles, useUi } from "./context";

export type FieldGridColumns = 1 | 2 | 3 | 4 | "auto";
export type FieldGridDensity = "compact" | "regular" | "comfortable";
export type FieldGridGap = "xs" | "sm" | "md" | "lg";
export type FieldGridItemSpan = 1 | 2 | 3 | 4 | "full";

export interface FieldGridProps {
  children?: ReactNode;
  columns?: FieldGridColumns;
  density?: FieldGridDensity;
  gap?: FieldGridGap;
  style?: any;
}

export interface FieldGridItemProps {
  children?: ReactNode;
  columns?: FieldGridColumns;
  span?: FieldGridItemSpan;
  style?: any;
}

const gapTokenMap = { xs: "space2xs", sm: "spaceXs", md: "spaceMd", lg: "spaceLg" } as const;
const compactGap: FieldGridGap = "sm";
const comfortableGap: FieldGridGap = "lg";
const defaultColumns: FieldGridColumns = 2;
const defaultGap: FieldGridGap = "md";
const defaultSpan: FieldGridItemSpan = 1;

const resolveGap = (tokens: Record<string, any>, gap: FieldGridGap) =>
  tokens.spacing?.[gapTokenMap[gap]];

const resolveBasis = (columns: FieldGridColumns, span: FieldGridItemSpan) => {
  if (span === "full" || columns === 1) return "100%";
  const columnCount = columns === "auto" ? 2 : columns;
  const numericSpan = typeof span === "number" ? Math.min(span, columnCount) : columnCount;
  return `${(numericSpan / columnCount) * 100}%`;
};

export const FieldGrid: React.FC<FieldGridProps> = ({
  children,
  columns,
  density = "regular",
  gap,
  style,
}) => {
  const { designSystem, hosts } = useUi();
  const resolvedColumns = columns ?? defaultColumns;
  const resolvedGapKey = gap ?? defaultGap;
  const resolvedGap = resolveGap(designSystem.theme.tokens, resolvedGapKey);
  const densityGap = density === "compact"
    ? resolveGap(designSystem.theme.tokens, compactGap)
    : density === "comfortable"
      ? resolveGap(designSystem.theme.tokens, comfortableGap)
      : resolvedGap;

  return (
    <hosts.View
      style={mergeStyles({
        flexDirection: "row",
        flexWrap: "wrap",
        gap: densityGap,
        width: "100%",
      }, style)}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement<FieldGridItemProps>(child)) return child;
        if (child.type !== FieldGridItem) return child;
        return React.cloneElement(child, { ...child.props, columns: resolvedColumns });
      })}
    </hosts.View>
  );
};

export const FieldGridItem: React.FC<FieldGridItemProps> = ({
  children,
  columns,
  span,
  style,
}) => {
  const { hosts } = useUi();
  const resolvedColumns = columns ?? defaultColumns;
  const resolvedSpan = span ?? defaultSpan;
  return (
    <hosts.View style={mergeStyles({ flexBasis: resolveBasis(resolvedColumns, resolvedSpan), minWidth: 0 }, style)}>
      {children}
    </hosts.View>
  );
};
