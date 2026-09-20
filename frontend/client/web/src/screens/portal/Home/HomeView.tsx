import React from "react";

export interface HomeViewProps {
  isAuthenticated?: boolean;
  onNavigate?: (path: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = () => null;
