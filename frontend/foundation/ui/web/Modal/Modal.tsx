"use client";

import React from "react";
import { ModalFrame } from "./ModalFrame";
import type { ModalProps } from "./types";

export const Modal: React.FC<ModalProps> = ({ variant = "auto", ...props }) => (
  <ModalFrame {...props} variant={variant} />
);
