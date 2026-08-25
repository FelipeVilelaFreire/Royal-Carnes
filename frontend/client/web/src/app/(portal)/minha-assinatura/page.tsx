"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MinhaCaixaView } from "../../../views/portal/tabs/MinhaCaixaView";

export default function MySubscriptionPage() {
  const router = useRouter();
  return <MinhaCaixaView onNavigate={(path) => router.push(path)} />;
}
