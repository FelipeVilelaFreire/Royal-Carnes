"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { HeroMarketplaceView } from "../../screens/landing/HeroMarketplaceView";

export default function HeroPage() {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return <HeroMarketplaceView onNavigate={handleNavigate} />;
}
