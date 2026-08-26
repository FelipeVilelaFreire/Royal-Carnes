"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { HeroCortesView } from "../../../screens/cuts/HeroCortesView";

export default function CortesPage() {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return <HeroCortesView onNavigate={handleNavigate} />;
}
