"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { HeroMarketplaceView } from "../../../screens/landing/HeroMarketplaceView";

export default function RoyalDeliveryPage() {
  const router = useRouter();
  return <HeroMarketplaceView onNavigate={(path) => router.push(path)} />;
}
