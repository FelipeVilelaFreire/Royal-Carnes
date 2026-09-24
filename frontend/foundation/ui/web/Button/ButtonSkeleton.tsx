import { Button } from "./Button";

export interface ButtonSkeletonProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  width?: "full" | "lg" | "md" | "sm" | "xs";
}

export const ButtonSkeleton = ({ className, size = "sm", width = "md" }: ButtonSkeletonProps) => (
  <Button
    className={className}
    size={size}
    skeletonWidth={width}
    state="skeleton"
  />
);
