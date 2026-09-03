"use client";

import React from "react";
import { AppShellRuntime, type AppShellRuntimeProps } from "./AppShellRuntime";

export type AppShellProps = AppShellRuntimeProps;

export const AppShell: React.FC<AppShellProps> = (props) => {
  return <AppShellRuntime {...props} />;
};
