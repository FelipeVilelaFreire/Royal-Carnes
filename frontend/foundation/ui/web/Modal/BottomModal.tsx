"use client";

import React from "react";
import { ModalFrame } from "./ModalFrame";
import type { BottomModalProps } from "./types";

export const BottomModal: React.FC<BottomModalProps> = (props) => (
  <ModalFrame {...props} variant="bottom" />
);
