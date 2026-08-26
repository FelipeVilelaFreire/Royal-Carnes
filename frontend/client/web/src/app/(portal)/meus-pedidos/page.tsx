"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MeusPedidosView } from "../../../screens/portal/tabs/MeusPedidosView";

export default function MeusPedidosPage() {
  const router = useRouter();
  return <MeusPedidosView onNavigate={(path) => router.push(path)} />;
}
