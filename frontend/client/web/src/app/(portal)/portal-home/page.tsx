"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { HomeView } from "../../../views/portal/tabs/HomeView";

export default function PortalHomePage() {
  const router = useRouter();
  return <HomeView onNavigate={(path) => router.push(path)} />;
}
