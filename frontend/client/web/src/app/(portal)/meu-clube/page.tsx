"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { HeroMarketplaceView } from "../../../screens/landing/HeroMarketplaceView";

export default function MeuClubePage() {
  const router = useRouter();
  return <HeroMarketplaceView onNavigate={(path) => router.push(path)} />;
}
