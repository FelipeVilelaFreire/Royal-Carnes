import { type ButtonSkeletonProps } from "../Button";
import { DropdownPicker } from "./DropdownPicker";

export type DropdownPickerSkeletonProps = ButtonSkeletonProps;

export const DropdownPickerSkeleton = ({ className, width }: DropdownPickerSkeletonProps) => (
  <DropdownPicker className={className} state="skeleton" width={width === "full" ? "full" : "auto"} />
);
