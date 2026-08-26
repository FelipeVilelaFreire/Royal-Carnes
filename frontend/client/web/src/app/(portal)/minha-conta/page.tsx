"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MinhaContaView } from "../../../screens/portal/tabs/MinhaContaView";

export default function MinhaContaPage() {
  const router = useRouter();
  return <MinhaContaView onNavigate={(path) => router.push(path)} />;
}
