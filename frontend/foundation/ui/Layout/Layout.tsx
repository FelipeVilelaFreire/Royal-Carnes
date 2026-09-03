"use client";

import React from "react";

export type LayoutGap = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "grid";
export type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

const gapVar = (gap: LayoutGap | string | undefined) => {
  if (!gap) return "var(--theme--spacing-md)";
  if (gap === "grid") return "var(--theme--layout-gutterDesktop)";
  if (gap.startsWith("var(") || gap.endsWith("px") || gap.endsWith("rem")) return gap;
  const token = gap === "2xs" ? "space2xs" : gap === "2xl" ? "space2xl" : gap === "3xl" ? "space3xl" : `space${gap[0].toUpperCase()}${gap.slice(1)}`;
  return `var(--theme--spacing-${token})`;
};

const containerWidthVar = (size: ContainerSize) => size === "full" ? "none" : `var(--theme--layout-container-${size})`;

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number;
  gap?: LayoutGap | string;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  columns = 20,
  gap = "grid",
  children,
  style,
  ...props
}) => {
  return (
    <div
      {...props}
      style={{
        boxSizing: "border-box",
        display: "grid",
        gap: gapVar(gap),
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        width: "100%",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export type BoxProps = React.HTMLAttributes<HTMLDivElement>;
export const Box = React.forwardRef<HTMLDivElement, BoxProps>(({ children, style, ...props }, ref) => (
  <div ref={ref} {...props} style={{ boxSizing: "border-box", minWidth: 0, ...style }}>{children}</div>
));

export type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  gutter?: "none" | "page";
  size?: ContainerSize;
};
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({ children, gutter = "page", size = "xl", style, ...props }, ref) => (
  <div
    ref={ref}
    {...props}
    style={{
      boxSizing: "border-box",
      marginInline: "auto",
      maxWidth: containerWidthVar(size),
      paddingInline: gutter === "none" ? 0 : "var(--theme--layout-gutterDesktop)",
      width: "100%",
      ...style,
    }}
  >
    {children}
  </div>
));

export type FlexProps = React.HTMLAttributes<HTMLDivElement> & {
  align?: React.CSSProperties["alignItems"];
  direction?: React.CSSProperties["flexDirection"];
  gap?: LayoutGap | string;
  justify?: React.CSSProperties["justifyContent"];
  wrap?: React.CSSProperties["flexWrap"];
};
export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(({ align, children, direction, gap, justify, style, wrap, ...props }, ref) => (
  <div
    ref={ref}
    {...props}
    style={{ alignItems: align, display: "flex", flexDirection: direction, flexWrap: wrap, gap: gapVar(gap), justifyContent: justify, ...style }}
  >
    {children}
  </div>
));

export type GridProps = React.HTMLAttributes<HTMLDivElement> & {
  columns?: number;
  gap?: LayoutGap | string;
};
export const Grid = React.forwardRef<HTMLDivElement, GridProps>(({ children, columns, gap = "grid", style, ...props }, ref) => (
  <div
    ref={ref}
    {...props}
    style={{
      display: "grid",
      gap: gapVar(gap),
      gridTemplateColumns: columns ? `repeat(${columns}, minmax(0, 1fr))` : undefined,
      ...style,
    }}
  >
    {children}
  </div>
));

export type GridItemProps = React.HTMLAttributes<HTMLDivElement> & {
  span?: number | "full";
};
export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(({ children, span, style, ...props }, ref) => (
  <div ref={ref} {...props} style={{ gridColumn: span === "full" ? "1 / -1" : span ? `span ${span}` : undefined, minWidth: 0, ...style }}>{children}</div>
));

export type InlineProps = React.HTMLAttributes<HTMLDivElement> & {
  align?: React.CSSProperties["alignItems"];
  gap?: LayoutGap | string;
  justify?: React.CSSProperties["justifyContent"];
  wrap?: React.CSSProperties["flexWrap"];
};
export const Inline = React.forwardRef<HTMLDivElement, InlineProps>(({ align = "center", children, gap = "sm", justify, style, wrap, ...props }, ref) => (
  <div ref={ref} {...props} style={{ alignItems: align, display: "inline-flex", flexDirection: "row", flexWrap: wrap, gap: gapVar(gap), justifyContent: justify, ...style }}>{children}</div>
));

export type StackProps = React.HTMLAttributes<HTMLDivElement> & {
  align?: React.CSSProperties["alignItems"];
  gap?: LayoutGap | string;
  justify?: React.CSSProperties["justifyContent"];
};
export const Stack = React.forwardRef<HTMLDivElement, StackProps>(({ align, children, gap = "md", justify, style, ...props }, ref) => (
  <div ref={ref} {...props} style={{ alignItems: align, display: "flex", flexDirection: "column", gap: gapVar(gap), justifyContent: justify, ...style }}>{children}</div>
));
