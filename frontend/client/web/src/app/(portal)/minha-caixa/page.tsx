"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MinhaCaixaView } from "../../../screens/portal/tabs/MinhaCaixaView";

export default function MinhaCaixaPage() {
  const router = useRouter();
  return <MinhaCaixaView onNavigate={(path) => router.push(path)} />;
}
