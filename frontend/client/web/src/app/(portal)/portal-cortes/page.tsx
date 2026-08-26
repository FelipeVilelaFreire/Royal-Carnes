"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { HeroCortesView } from "../../../screens/cuts/HeroCortesView";

export default function PortalCortesPage() {
  const router = useRouter();
  return <HeroCortesView onNavigate={(path) => router.push(path)} />;
}
