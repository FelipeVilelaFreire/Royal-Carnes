"use client";

import React from "react";

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number;
  gap?: string;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  columns = 20,
  gap = "16px",
  children,
  style,
  ...props
}) => {
  return (
    <div
      {...props}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: gap,
        width: "100%",
        boxSizing: "border-box",
        ...style
      }}
    >
      {children}
    </div>
  );
};

export type BoxProps = React.HTMLAttributes<HTMLDivElement> & { [key: string]: any };
export const Box = React.forwardRef<HTMLDivElement, BoxProps>(({ children, style, ...props }, ref) => (
  <div ref={ref} {...props} style={style}>{children}</div>
));

export type ContainerProps = React.HTMLAttributes<HTMLDivElement> & { [key: string]: any };
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({ children, style, ...props }, ref) => (
  <div ref={ref} {...props} style={{ width: "100%", maxWidth: "1280px", margin: "0 auto", ...style }}>{children}</div>
));

export type FlexProps = React.HTMLAttributes<HTMLDivElement> & { [key: string]: any };
export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(({ children, style, ...props }, ref) => (
  <div ref={ref} {...props} style={{ display: "flex", ...style }}>{children}</div>
));

export type GridProps = React.HTMLAttributes<HTMLDivElement> & { [key: string]: any };
export const Grid = React.forwardRef<HTMLDivElement, GridProps>(({ children, style, ...props }, ref) => (
  <div ref={ref} {...props} style={{ display: "grid", ...style }}>{children}</div>
));

export type GridItemProps = React.HTMLAttributes<HTMLDivElement> & { [key: string]: any };
export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(({ children, style, ...props }, ref) => (
  <div ref={ref} {...props} style={style}>{children}</div>
));

export type InlineProps = React.HTMLAttributes<HTMLDivElement> & { [key: string]: any };
export const Inline = React.forwardRef<HTMLDivElement, InlineProps>(({ children, style, ...props }, ref) => (
  <div ref={ref} {...props} style={{ display: "inline-flex", flexDirection: "row", alignItems: "center", ...style }}>{children}</div>
));

export type StackProps = React.HTMLAttributes<HTMLDivElement> & { [key: string]: any };
export const Stack = React.forwardRef<HTMLDivElement, StackProps>(({ children, style, ...props }, ref) => (
  <div ref={ref} {...props} style={{ display: "flex", flexDirection: "column", ...style }}>{children}</div>
));
