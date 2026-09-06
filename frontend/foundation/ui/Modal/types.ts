import type React from "react";

export type UiModalVariant = "auto" | "center" | "bottom";
export type UiModalSize = "sm" | "md" | "lg" | "full";

export interface ModalProps {
  ariaLabel?: string;
  children: React.ReactNode;
  closeLabel: string;
  description?: string;
  onClose: () => void;
  open: boolean;
  size?: UiModalSize;
  title?: string;
  variant?: UiModalVariant;
}

export type BottomModalProps = Omit<ModalProps, "variant">;
