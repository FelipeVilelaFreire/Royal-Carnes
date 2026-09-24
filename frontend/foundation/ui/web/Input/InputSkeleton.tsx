import { type SkeletonSize, type SkeletonWidth } from "../Skeleton";
import { Input } from "./Input";

export interface InputSkeletonProps {
  className?: string;
  size?: Extract<SkeletonSize, "md" | "lg" | "xl">;
  width?: SkeletonWidth;
}

export const InputSkeleton = ({ className, size = "lg", width = "full" }: InputSkeletonProps) => (
  <Input className={className} skeletonSize={size} skeletonWidth={width} state="skeleton" />
);
