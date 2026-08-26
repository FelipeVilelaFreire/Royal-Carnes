"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LandingView } from "../screens/landing/LandingView";

export default function RootPage() {
  const router = useRouter();
  return <LandingView onNavigate={(path) => router.push(path)} />;
}
