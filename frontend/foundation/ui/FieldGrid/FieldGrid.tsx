"use client";

import React, { type HTMLAttributes } from "react";
import styles from "./FieldGrid.module.css";

export type FieldGridColumns = 1 | 2 | 3 | 4 | "auto";
export type FieldGridDensity = "compact" | "regular" | "comfortable";
export type FieldGridGap = "xs" | "sm" | "md" | "lg";
export type FieldGridItemSpan = 1 | 2 | 3 | 4 | "full";

export interface FieldGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: FieldGridColumns;
  density?: FieldGridDensity;
  gap?: FieldGridGap;
}

export interface FieldGridItemProps extends HTMLAttributes<HTMLDivElement> {
  span?: FieldGridItemSpan;
}

const classNames = (...values: Array<string | undefined>) => values.filter(Boolean).join(" ");

export const FieldGrid: React.FC<FieldGridProps> = ({
  children,
  className,
  columns = 3,
  density = "regular",
  gap = "md",
  ...props
}) => (
  <div
    {...props}
    className={classNames(styles.fieldGrid, className)}
    data-columns={columns}
    data-density={density}
    data-gap={gap}
  >
    {children}
  </div>
);

export const FieldGridItem: React.FC<FieldGridItemProps> = ({
  children,
  className,
  span = 1,
  ...props
}) => (
  <div {...props} className={classNames(styles.fieldGridItem, className)} data-span={span}>
    {children}
  </div>
);
