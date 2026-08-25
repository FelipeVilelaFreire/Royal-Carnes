"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PedidoView } from "../../../views/portal/tabs/PedidoView";

export default function ProdutosPage() {
  const router = useRouter();
  return <PedidoView onNavigate={(path) => router.push(path)} />;
}
