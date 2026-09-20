import React from "react";
import type { useClientStrings } from "../../../../../shared-core/hooks/useClientStrings";

export interface HomeViewProps {
  onNavigate: (path: string) => void;
  strings: ReturnType<typeof useClientStrings>;
}

export const HomeView: React.FC<HomeViewProps> = () => null;
