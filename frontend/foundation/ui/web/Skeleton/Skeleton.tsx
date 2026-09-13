"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { Surface } from "../Surface";
import styles from "./Skeleton.module.css";

export type SkeletonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SkeletonShape = "block" | "circle" | "text";
export type SkeletonWidth = "full" | "lg" | "md" | "sm" | "xs";

export type SkeletonProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "style"> & {
  shape?: SkeletonShape;
  size?: SkeletonSize;
  width?: SkeletonWidth;
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { className, shape = "block", size = "md", width = "full", ...props },
  ref,
) {
  return (
    <Surface
      {...props}
      ref={ref}
      appearance="soft"
      aria-hidden="true"
      className={[styles.skeleton, className].filter(Boolean).join(" ")}
      data-shape={shape}
      data-size={size}
      data-width={width}
      tone="neutral"
    />
  );
});
