"use client";

import React from "react";
import {
  BoxIcon,
  CartIcon,
  CheckIcon,
  ChevronRightIcon,
  CreditCardIcon,
  FlameIcon,
  LayersIcon,
  MenuIcon,
  PlanIcon,
  RepeatIcon,
  SettingsIcon,
  StoreIcon,
  TagIcon,
  TruckIcon,
  UserIcon,
} from "../../ui/web/Icon/AppIcons";
import type { AppShellNavigationItem } from "./types";

const normalizeIconName = (item: Pick<AppShellNavigationItem, "iconIntent" | "iconName" | "key">) => {
  return String(item.iconIntent || item.iconName || item.key || "").toLowerCase();
};

export function renderAppShellIcon(item: AppShellNavigationItem, color: string, size = 20) {
  if (item.icon && React.isValidElement(item.icon)) return item.icon;

  const name = normalizeIconName(item);
  if (["box", "package", "inventory", "estoque", "minhacaixa"].includes(name)) return <BoxIcon size={size} color={color} />;
  if (["cart", "order", "orders", "pedidos", "pedir", "checkout"].includes(name)) return <CartIcon size={size} color={color} />;
  if (["catalog", "catalogo", "store", "produtos", "categorias", "cortes", "home", "dashboard"].includes(name)) return <StoreIcon size={size} color={color} />;
  if (["delivery", "deliveries", "truck", "royaldelivery", "tracking"].includes(name)) return <TruckIcon size={size} color={color} />;
  if (["plan", "plans", "planos"].includes(name)) return <PlanIcon size={size} color={color} />;
  if (["billing", "payment", "payments", "pagamentos"].includes(name)) return <CreditCardIcon size={size} color={color} />;
  if (["membership", "subscription", "subscriptions", "assinaturas"].includes(name)) return <RepeatIcon size={size} color={color} />;
  if (["category-management"].includes(name)) return <TagIcon size={size} color={color} />;
  if (["collection-discovery"].includes(name)) return <LayersIcon size={size} color={color} />;
  if (["settings", "configuracoes"].includes(name)) return <SettingsIcon size={size} color={color} />;
  if (["success", "check"].includes(name)) return <CheckIcon size={size} color={color} />;
  if (["more", "ellipsis", "menu"].includes(name)) return <MenuIcon size={size} color={color} />;
  if (["search"].includes(name)) return <SearchIcon size={size} color={color} />;
  if (["account", "user", "usuarios", "clientes", "socios", "minhaconta", "myaccount"].includes(name)) return <UserIcon size={size} color={color} />;
  if (["chevron", "next"].includes(name)) return <ChevronRightIcon size={size} color={color} />;
  return <FlameIcon size={size} color={color} />;
}
