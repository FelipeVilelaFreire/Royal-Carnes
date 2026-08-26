"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { HomeOrientationView } from "../../../screens/portal/tabs/HomeOrientationView";

export default function PortalHomePage() {
  const router = useRouter();
  return <HomeOrientationView onNavigate={(path) => router.push(path)} />;
}
