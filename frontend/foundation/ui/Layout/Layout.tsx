"use client";

import { useEffect, useState, type CSSProperties, type HTMLAttributes } from "react";
import {
  resolveLayoutContainerWidth,
  resolveLayoutGap,
  resolveLayoutGridColumns,
  resolveLayoutGridItemSpan,
  resolveLayoutPageGutter,
  resolveLayoutSpace,
  type UiBoxOverflow,
  type UiBoxPosition,
  type UiBoxWidth,
  type UiFlexAlign,
  type UiFlexDirection,
  type UiFlexJustify,
  type UiLayoutContainerGutter,
  type UiLayoutContainerWidth,
  type UiLayoutGap,
  type UiLayoutGridColumns,
  type UiLayoutSpace,
  type UiLayoutTokens,
} from "../core";
import { useUiConfig } from "../UiProvider";
import styles from "./Layout.module.css";

type LayoutAlign = "start" | "center" | "end" | "stretch";
type LayoutJustify = "start" | "center" | "end" | "between" | "around" | "evenly";
type LayoutBaseProps = HTMLAttributes<HTMLDivElement>;
type UiLayoutSpaceValue = UiLayoutSpace | number;

const classNames = (...values: Array<string | undefined>) => values.filter(Boolean).join(" ");
const toCssStyle = (gap: number, style?: CSSProperties) => ({ "--ui-layout-gap": `${gap}px`, ...style }) as CSSProperties;

const useViewportWidth = () => {
  const [viewportWidth, setViewportWidth] = useState<number>();

  useEffect(() => {
    const update = () => setViewportWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return viewportWidth;
};

const useLayoutTokens = (): UiLayoutTokens => {
  const ui = useUiConfig();
  return ui.theme!.tokens as UiLayoutTokens;
};

type BoxLayoutProps = {
  margin?: UiLayoutSpaceValue;
  marginX?: UiLayoutSpaceValue;
  marginY?: UiLayoutSpaceValue;
  maxWidth?: UiLayoutContainerWidth;
  minHeight?: UiLayoutSpaceValue;
  overflow?: UiBoxOverflow;
  padding?: UiLayoutSpaceValue;
  paddingX?: UiLayoutSpaceValue;
  paddingY?: UiLayoutSpaceValue;
  position?: UiBoxPosition;
  width?: UiBoxWidth;
};

const resolveLayoutSpaceValue = (tokens: UiLayoutTokens, value: UiLayoutSpaceValue | undefined) =>
  typeof value === "number" ? Math.max(0, value) : resolveLayoutSpace(tokens, value);

const boxStyle = (tokens: UiLayoutTokens, value: BoxLayoutProps, style?: CSSProperties) => {
  const maxWidth = resolveLayoutContainerWidth(tokens, value.maxWidth ?? "full");

  return {
    "--ui-box-margin-x": `${resolveLayoutSpaceValue(tokens, value.marginX ?? value.margin)}px`,
    "--ui-box-margin-y": `${resolveLayoutSpaceValue(tokens, value.marginY ?? value.margin)}px`,
    "--ui-box-padding-x": `${resolveLayoutSpaceValue(tokens, value.paddingX ?? value.padding)}px`,
    "--ui-box-padding-y": `${resolveLayoutSpaceValue(tokens, value.paddingY ?? value.padding)}px`,
    "--ui-box-min-height": `${resolveLayoutSpaceValue(tokens, value.minHeight)}px`,
    "--ui-box-max-width": maxWidth === undefined ? "none" : `${maxWidth}px`,
    ...style,
  } as CSSProperties;
};

export type BoxProps = LayoutBaseProps & BoxLayoutProps;
export function Box({
  className,
  margin,
  marginX,
  marginY,
  maxWidth,
  minHeight,
  overflow = "visible",
  padding,
  paddingX,
  paddingY,
  position = "static",
  style,
  width = "auto",
  ...props
}: BoxProps) {
  const tokens = useLayoutTokens();
  return (
    <div
      {...props}
      className={classNames(styles.box, className)}
      data-overflow={overflow}
      data-position={position}
      data-width={width}
      style={boxStyle(tokens, { margin, marginX, marginY, maxWidth, minHeight, padding, paddingX, paddingY }, style)}
    />
  );
}

export type FlexProps = LayoutBaseProps & BoxLayoutProps & {
  align?: UiFlexAlign;
  basis?: "auto" | "content" | "full";
  direction?: UiFlexDirection;
  gap?: UiLayoutGap;
  grow?: boolean;
  justify?: UiFlexJustify;
  shrink?: boolean;
  wrap?: boolean;
};
export function Flex({
  align = "stretch",
  basis = "auto",
  className,
  direction = "row",
  gap,
  grow,
  justify = "start",
  margin,
  marginX,
  marginY,
  maxWidth,
  minHeight,
  overflow = "visible",
  padding,
  paddingX,
  paddingY,
  position = "static",
  shrink,
  style,
  width = "auto",
  wrap,
  ...props
}: FlexProps) {
  const ui = useUiConfig();
  const tokens = useLayoutTokens();
  const viewportWidth = useViewportWidth();
  const resolvedGap = resolveLayoutGap(tokens, gap || ui.layout.inlineGap, viewportWidth);

  return (
    <div
      {...props}
      className={classNames(styles.flex, className)}
      data-align={align}
      data-basis={basis}
      data-direction={direction}
      data-grow={grow || undefined}
      data-justify={justify}
      data-overflow={overflow}
      data-position={position}
      data-shrink={shrink || undefined}
      data-width={width}
      data-wrap={wrap || undefined}
      style={{
        ...boxStyle(tokens, { margin, marginX, marginY, maxWidth, minHeight, padding, paddingX, paddingY }, style),
        "--ui-layout-gap": `${resolvedGap}px`,
      } as CSSProperties}
    />
  );
}

export type StackProps = LayoutBaseProps & { align?: LayoutAlign; gap?: UiLayoutGap };
export function Stack({ align = "stretch", className, gap, style, ...props }: StackProps) {
  const ui = useUiConfig();
  const viewportWidth = useViewportWidth();
  const resolvedGap = resolveLayoutGap(useLayoutTokens(), gap || ui.layout.stackGap, viewportWidth);
  return <div {...props} className={classNames(styles.stack, className)} data-align={align} style={toCssStyle(resolvedGap, style)} />;
}

export type InlineProps = LayoutBaseProps & {
  align?: Exclude<LayoutAlign, "stretch">;
  gap?: UiLayoutGap;
  justify?: LayoutJustify;
  wrap?: boolean;
};
export function Inline({ align = "center", className, gap, justify = "start", style, wrap = true, ...props }: InlineProps) {
  const ui = useUiConfig();
  const viewportWidth = useViewportWidth();
  const resolvedGap = resolveLayoutGap(useLayoutTokens(), gap || ui.layout.inlineGap, viewportWidth);
  return (
    <div
      {...props}
      className={classNames(styles.inline, className)}
      data-align={align}
      data-justify={justify}
      data-wrap={wrap || undefined}
      style={toCssStyle(resolvedGap, style)}
    />
  );
}

export type GridProps = LayoutBaseProps & { columns?: UiLayoutGridColumns; gap?: UiLayoutGap };
export function Grid({ className, columns, gap, style, ...props }: GridProps) {
  const ui = useUiConfig();
  const tokens = useLayoutTokens();
  const viewportWidth = useViewportWidth();
  const resolvedGap = resolveLayoutGap(tokens, gap || ui.layout.gridGap, viewportWidth);
  const resolvedColumns = resolveLayoutGridColumns(tokens, columns || ui.layout.gridColumns, viewportWidth);
  return (
    <div
      {...props}
      className={classNames(styles.grid, className)}
      style={{ "--ui-layout-columns": String(resolvedColumns), ...toCssStyle(resolvedGap, style) } as CSSProperties}
    />
  );
}

export type GridItemProps = LayoutBaseProps & { align?: "center" | "end" | "start"; span?: "full" | number };
export function GridItem({ align = "start", className, span = 1, style, ...props }: GridItemProps) {
  const tokens = useLayoutTokens();
  const viewportWidth = useViewportWidth();
  const resolvedSpan = span === "full" ? "var(--ui-layout-columns)" : String(resolveLayoutGridItemSpan(tokens, span, viewportWidth));
  const start = span === "full" || align === "start" ? "auto" : align === "center" ? `calc((var(--ui-layout-columns) - ${resolvedSpan}) / 2 + 1)` : `calc(var(--ui-layout-columns) - ${resolvedSpan} + 1)`;

  return (
    <div
      {...props}
      className={classNames(styles.gridItem, className)}
      style={{ "--ui-layout-span": resolvedSpan, "--ui-layout-start": start, ...style } as CSSProperties}
    />
  );
}

export type ContainerProps = LayoutBaseProps & {
  gutter?: UiLayoutContainerGutter;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  width?: UiLayoutContainerWidth;
};
export function Container({ className, gutter, size, style, width, ...props }: ContainerProps) {
  const ui = useUiConfig();
  const tokens = useLayoutTokens();
  const viewportWidth = useViewportWidth();
  const legacyWidth = size === "sm" ? "compact" : size === "lg" || size === "xl" ? "wide" : size === "full" ? "full" : undefined;
  const resolvedWidth = resolveLayoutContainerWidth(tokens, width || legacyWidth || ui.layout.containerWidth, viewportWidth, ui.layout);
  const resolvedGutter = gutter || ui.layout.containerGutter;
  const pageGutter = resolvedGutter === "page" ? resolveLayoutPageGutter(tokens, viewportWidth) : 0;

  return (
    <div
      {...props}
      className={classNames(styles.container, className)}
      style={{
        "--ui-layout-container-width": resolvedWidth ? `${resolvedWidth + pageGutter * 2}px` : "none",
        "--ui-layout-page-gutter": `${pageGutter}px`,
        ...style,
      } as CSSProperties}
    />
  );
}

export type LayoutProps = GridProps;
export function Layout(props: LayoutProps) {
  return <Grid {...props} />;
}
