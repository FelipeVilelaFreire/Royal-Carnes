"use client";

import React, { useEffect, useState } from "react";
import { Badge, Button, Card } from "../../../legacy/design-system";
import { PortalHeader, BottomTabBar, Footer } from "../../../legacy/app-shell";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";
import { CartIcon, BoxIcon, CheckIcon, CutMeatIcon, ScaleIcon, KnifeIcon, ChevronDownIcon } from "../../../legacy/design-system/Icons";
import { catalogSubscriptionPlansMock } from "@/mocks/catalog";
import { royalCustomerMock } from "@/mocks/customer.mock";

export interface MinhaCaixaViewProps {
  onNavigate?: (path: string) => void;
  showShell?: boolean;
}

interface CartItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  weight: string;
  image: string;
  quantity: number;
}

export const MinhaCaixaView: React.FC<MinhaCaixaViewProps> = ({ onNavigate, showShell = true }) => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const attr = document.documentElement.getAttribute("data-theme");
      if (attr === "dark" || attr === "light") return attr;
      const stored = localStorage.getItem("royal_prime_theme");
      if (stored === "dark" || stored === "light") return stored;
    }
    return "dark";
  });

  const [boxMode, setBoxMode] = useState<"assinatura" | "avulso">("assinatura");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Carrinho interativo
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: "cut-1",
      name: "Wagyu Ribeye A5 Japão",
      subtitle: "Marmoreio 8-9, Kagoshima",
      price: 450.0,
      weight: "350g",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBC_FdliewJIIKdczXiSMJqWTbHn34-Q6zHbB99-KU4OpBR9xn9Z1WMuSIyU_U4SXlYiZ7jo8VqGyy4kuznW4XIjmiV4HDDv8MZA_VBvnSR6bp8YsaEueLWhZNGaz4Q2bAw8WqvDkOGmb4b9pxmcebCZ9z14DNKbboEFgzRF6QaJzOQOoPcoW7J0YIzSyIKB0s4DzaCNTg55iOHy8mVZfCyijjpR71Khrh4prHylDItRG8Hf1w-tfkL",
      quantity: 1
    },
    {
      id: "cut-2",
      name: "Picanha Premium Angus",
      subtitle: "Angus Certificado, Resfriada",
      price: 180.0,
      weight: "1.2kg",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIMILsx8lm1BIgFgXPxVlb_wWf-3CW04Wbs2SwDFdSjL8KaODQOEKq8f_yrGuXBZPVLGOS_ipMqqaVg6mJsKYwILj3BuIsYyaBM_dCkuSQXU3nSmN54fwCHj51ApyeUB7RPXwasZbRUDSgoASv4D2j3KxyGPEZl40wvMjV1L_avyZoCPOmKu_SBxMPfE4nTVhYyJ8aWm0HEI2K7rj1Xu3ZNUHHZtTV6H2NO2pV-p3im-AqTiiVVwhe",
      quantity: 1
    }
  ]);

  useEffect(() => {
    const handleThemeChange = () => {
      const current = localStorage.getItem("royal_prime_theme");
      if (current === "dark" || current === "light") {
        setThemeMode(current);
      }
    };
    window.addEventListener("royal_theme_changed", handleThemeChange);
    return () => window.removeEventListener("royal_theme_changed", handleThemeChange);
  }, []);

  const isDark = themeMode === "dark";
  const tokens = isDark ? themeColorsDefault.dark : themeColorsDefault.light;
  const activePlan = catalogSubscriptionPlansMock.find((plan) => plan.key === royalCustomerMock.activeSubscription?.planKey) || catalogSubscriptionPlansMock[0];

  const catalogProducts = [
    {
      id: "cut-1",
      name: "Wagyu Ribeye A5 Japão",
      subtitle: "Marmoreio 8-9, Kagoshima",
      price: 450.0,
      weight: "350g",
      category: "wagyu",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBC_FdliewJIIKdczXiSMJqWTbHn34-Q6zHbB99-KU4OpBR9xn9Z1WMuSIyU_U4SXlYiZ7jo8VqGyy4kuznW4XIjmiV4HDDv8MZA_VBvnSR6bp8YsaEueLWhZNGaz4Q2bAw8WqvDkOGmb4b9pxmcebCZ9z14DNKbboEFgzRF6QaJzOQOoPcoW7J0YIzSyIKB0s4DzaCNTg55iOHy8mVZfCyijjpR71Khrh4prHylDItRG8Hf1w-tfkL"
    },
    {
      id: "cut-2",
      name: "Picanha Premium Angus",
      subtitle: "Angus Certificado, Resfriada",
      price: 180.0,
      weight: "1.2kg",
      category: "bovinos",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIMILsx8lm1BIgFgXPxVlb_wWf-3CW04Wbs2SwDFdSjL8KaODQOEKq8f_yrGuXBZPVLGOS_ipMqqaVg6mJsKYwILj3BuIsYyaBM_dCkuSQXU3nSmN54fwCHj51ApyeUB7RPXwasZbRUDSgoASv4D2j3KxyGPEZl40wvMjV1L_avyZoCPOmKu_SBxMPfE4nTVhYyJ8aWm0HEI2K7rj1Xu3ZNUHHZtTV6H2NO2pV-p3im-AqTiiVVwhe"
    },
    {
      id: "cut-3",
      name: "Tomahawk Angus 21D",
      subtitle: "Osso exposto imponente",
      price: 169.9,
      weight: "950g",
      category: "churrasco",
      image: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "cut-4",
      name: "Prime Rib Dry Aged 60D",
      subtitle: "Câmara de Sal do Himalaia",
      price: 249.0,
      weight: "850g",
      category: "dryaged",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "cut-5",
      name: "Bife de Chorizo Prime",
      subtitle: "Capa lateral de gordura macia",
      price: 109.9,
      weight: "800g",
      category: "bovinos",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  const handleAddToCart = (product: typeof catalogProducts[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item));
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const totalCutsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = boxMode === "assinatura" ? 0 : 29.9;
  const grandTotal = subtotal + shippingFee;

  const filteredProducts = catalogProducts.filter(
    (p) => selectedCategory === "all" || p.category === selectedCategory
  );

  return (
    <div
      style={{
        background: tokens.background,
        color: tokens.text,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', sans-serif",
        transition: "background 0.3s ease, color 0.3s ease"
      }}
    >
      {/* 1. Header Único e Universal do Portal */}
      {showShell ? (
        <PortalHeader
          activeTab="produtos"
          themeMode={themeMode}
          onToggleTheme={() => {
            const next = themeMode === "dark" ? "light" : "dark";
            setThemeMode(next);
            if (typeof document !== "undefined") {
              document.documentElement.setAttribute("data-theme", next);
              document.documentElement.style.backgroundColor = next === "dark" ? "#0B0908" : "#FCFBF7";
              document.documentElement.style.color = next === "dark" ? "#E8E1DE" : "#1A1A1A";
            }
            localStorage.setItem("royal_prime_theme", next);
            window.dispatchEvent(new Event("royal_theme_changed"));
          }}
          onNavigate={onNavigate}
        />
      ) : null}

      {/* 2. Main Content da Página Royal Delivery */}
      <main
        style={{
          flex: 1,
          maxWidth: "1440px",
          width: "100%",
          margin: "0 auto",
          padding: "40px 32px 80px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          boxSizing: "border-box"
        }}
      >
        {/* Layout 2 Colunas (Esquerda: Configurador | Direita: Sticky Summary) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: "40px",
            alignItems: "flex-start"
          }}
          className="grid-configurator"
        >
          <style>{`
            @media (max-width: 1024px) {
              .grid-configurator {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>

          {/* COLUNA ESQUERDA: CONFIGURADOR DE CORTE & MODO */}
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* Header da Seção */}
            <div style={{ borderBottom: `1px solid ${tokens.border}`, paddingBottom: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: tokens.copper }}>
                ROYAL DELIVERY • CONFIGURADOR EXECUTIVO
              </span>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "40px", fontWeight: "700", margin: 0, color: tokens.text }}>
                Monte seu pedido
              </h1>
              <p style={{ fontSize: "15px", color: tokens.textMuted, margin: 0 }}>
                Escolha as melhores carnes, selecione os cortes perfeitos para sua ocasião.
              </p>
            </div>

            {/* Seletor de Modo de Entrega (AVULSO vs ASSINATURA) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {/* Botão Avulso */}
              <button
                onClick={() => setBoxMode("avulso")}
                style={{
                  background: boxMode === "avulso" ? tokens.surfaceContainer : tokens.background,
                  border: `2px solid ${boxMode === "avulso" ? tokens.copper : tokens.border}`,
                  borderRadius: "16px",
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: boxMode === "avulso" ? tokens.copper : tokens.surfaceContainer,
                    color: boxMode === "avulso" ? "#FFFFFF" : tokens.text,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}
                >
                  <CartIcon size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 4px 0", color: tokens.text }}>
                    AVULSO
                  </h3>
                  <p style={{ fontSize: "12px", color: tokens.textMuted, margin: 0 }}>
                    Pedido único para entrega imediata.
                  </p>
                </div>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: `2px solid ${boxMode === "avulso" ? tokens.copper : tokens.border}`, background: boxMode === "avulso" ? tokens.copper : "transparent", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }} />
              </button>

              {/* Botão Assinatura (Com RECOMENDADO no topo interno do card) */}
              <button
                onClick={() => setBoxMode("assinatura")}
                style={{
                  background: boxMode === "assinatura" ? tokens.surfaceContainer : tokens.background,
                  border: `2px solid ${boxMode === "assinatura" ? tokens.copper : tokens.border}`,
                  borderRadius: "16px",
                  padding: "16px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "0.12em", textTransform: "uppercase", color: tokens.copper, background: "rgba(184, 115, 51, 0.15)", padding: "2px 8px", borderRadius: "4px" }}>
                    RECOMENDADO
                  </span>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${boxMode === "assinatura" ? tokens.copper : tokens.border}`, background: boxMode === "assinatura" ? tokens.copper : "transparent", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }} />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "14px", width: "100%" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      background: boxMode === "assinatura" ? tokens.copper : tokens.surfaceContainer,
                      color: boxMode === "assinatura" ? "#FFFFFF" : tokens.text,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    }}
                  >
                    <BoxIcon size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 2px 0", color: tokens.text }}>
                      ASSINATURA
                    </h3>
                    <p style={{ fontSize: "12px", color: tokens.textMuted, margin: 0 }}>
                      Benefícios exclusivos, recorrente.
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Barra de Uso do Plano Ativo (em modo Assinatura - Royal Pro) */}
            {boxMode === "assinatura" && (
              <div
                style={{
                  background: tokens.surfaceContainer,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: "16px",
                  padding: "20px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: tokens.text, display: "flex", alignItems: "center", gap: "8px" }}>
                    <CutMeatIcon size={18} color={tokens.copper} /> Cota do Plano Royal {activePlan.name}: <strong>{totalCutsCount} / {activePlan.productSelectionLimit} cortes adicionados</strong>
                  </span>
                  <span style={{ fontSize: "12px", color: tokens.copper, fontWeight: "700" }}>
                    {activePlan.productSelectionLimit - totalCutsCount > 0 ? `Ainda cabem ${activePlan.productSelectionLimit - totalCutsCount} cortes` : "Cota atingida!"}
                  </span>
                </div>
                <div style={{ width: "100%", height: "8px", background: tokens.background, borderRadius: "9999px", overflow: "hidden", border: `1px solid ${tokens.border}` }}>
                  <div style={{ width: `${Math.min((totalCutsCount / activePlan.productSelectionLimit) * 100, 100)}%`, height: "100%", background: tokens.copper, borderRadius: "9999px", transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }} />
                </div>
              </div>
            )}

            {/* Lista de Produtos (Compact Product List) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Header do Catálogo & Filtros */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: tokens.surfaceContainer,
                  padding: "12px 20px",
                  borderRadius: "12px",
                  border: `1px solid ${tokens.border}`
                }}
              >
                <h2 style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0, color: tokens.text }}>
                  ESCOLHA SUAS CARNES
                </h2>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => setSelectedCategory("all")}
                    style={{
                      background: selectedCategory === "all" ? tokens.copper : "transparent",
                      color: selectedCategory === "all" ? "#FFFFFF" : tokens.textMuted,
                      border: "none",
                      padding: "6px 14px",
                      borderRadius: "9999px",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer"
                    }}
                  >
                    TODOS
                  </button>
                  <button
                    onClick={() => setSelectedCategory("wagyu")}
                    style={{
                      background: selectedCategory === "wagyu" ? tokens.copper : "transparent",
                      color: selectedCategory === "wagyu" ? "#FFFFFF" : tokens.textMuted,
                      border: "none",
                      padding: "6px 14px",
                      borderRadius: "9999px",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer"
                    }}
                  >
                    WAGYU A5
                  </button>
                  <button
                    onClick={() => setSelectedCategory("bovinos")}
                    style={{
                      background: selectedCategory === "bovinos" ? tokens.copper : "transparent",
                      color: selectedCategory === "bovinos" ? "#FFFFFF" : tokens.textMuted,
                      border: "none",
                      padding: "6px 14px",
                      borderRadius: "9999px",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer"
                    }}
                  >
                    ANGUS PRIME
                  </button>
                </div>
              </div>

              {/* Lista dos Cards de Cortes */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {filteredProducts.map((p) => {
                  const cartItem = cart.find((item) => item.id === p.id);
                  const qty = cartItem ? cartItem.quantity : 0;
                  return (
                    <Card
                      key={p.id}
                      variant="surface"
                      bordered
                      hoverable
                      isDark={isDark}
                      style={{
                        padding: "18px 24px",
                        borderRadius: "16px",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        boxSizing: "border-box",
                        gap: "24px",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        {/* FOTO DA CARNE NO INÍCIO DO CARD */}
                        <div style={{ width: "96px", height: "80px", borderRadius: "12px", overflow: "hidden", background: tokens.surfaceContainer, border: `1px solid ${tokens.border}`, flexShrink: 0 }}>
                          <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>

                        {/* TÍTULO DA CARNE & DETALHES • PESO ALINHADOS À ESQUERDA */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px", textAlign: "left" }}>
                          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "700", margin: 0, color: tokens.text, textAlign: "left" }}>
                            {p.name}
                          </h3>
                          <span style={{ fontSize: "13px", color: tokens.textMuted, textAlign: "left" }}>
                            {p.subtitle} • {p.weight}
                          </span>
                        </div>
                      </div>

                      {/* PREÇO E CONTROLES DE ADICIONAR / QUANTIDADE */}
                      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                        <span style={{ fontSize: "20px", fontWeight: "700", color: tokens.text }}>
                          R$ {p.price.toFixed(2).replace(".", ",")}
                        </span>

                        {qty > 0 ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", background: tokens.background, border: `1px solid ${tokens.copper}`, borderRadius: "9999px", padding: "6px 16px", boxShadow: "0 4px 12px rgba(184, 115, 51, 0.2)", transition: "all 0.3s ease" }}>
                            <button
                              onClick={() => handleRemoveFromCart(p.id)}
                              style={{ background: "transparent", border: "none", color: tokens.text, fontWeight: "700", cursor: "pointer", fontSize: "18px", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                              -
                            </button>
                            <span style={{ fontSize: "15px", fontWeight: "700", color: tokens.copper }}>{qty}</span>
                            <button
                              onClick={() => handleAddToCart(p)}
                              style={{ background: "transparent", border: "none", color: tokens.text, fontWeight: "700", cursor: "pointer", fontSize: "18px", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            isDark={isDark}
                            onClick={() => handleAddToCart(p)}
                            style={{ transition: "all 0.3s ease" }}
                          >
                            ADICIONAR
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Histórico de Caixas Anteriores Entregues */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "16px" }}>
              <div style={{ borderBottom: `1px solid ${tokens.border}`, paddingBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "4px" }}>
                    RECORRÊNCIA DO CLUBE
                  </span>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: "700", margin: 0, color: tokens.text }}>
                    Histórico de Caixas Anteriores
                  </h3>
                </div>
                <span style={{ fontSize: "13px", color: tokens.textMuted }}>
                  Repita sua combinação favorita em 1 clique
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Caixa 1: Agosto */}
                <Card
                  variant="surface"
                  bordered
                  hoverable
                  isDark={isDark}
                  style={{
                    padding: "20px 24px",
                    borderRadius: "18px",
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: "24px",
                    alignItems: "flex-start",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}
                >
                  <div style={{ width: "76px", height: "76px", borderRadius: "12px", overflow: "hidden", background: tokens.surfaceContainer, border: `1px solid ${tokens.border}`, flexShrink: 0 }}>
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEyZehgZTv-CyocAVQn0YBZaQ9k5T1yspu9TOTY_a2Ecdie4GqgKNWW_cnd5ZAUuPMshFRWia6eq5Ej3-UQ2L2nImpVVKTr0yfEodgUEJQUsZVZLYiBoQliyrqEezNzVT5XxtmK1ozhqsDd4j-LQyV7RlT1CqQedpMs5qhbesB5PDF1_G10G7rQDZ3U7cedVIHcBedWSA27GA_gQjpXRlZttOTKwJI8hFUgSAUtoBMQmTuk7GfbhUo"
                      alt="Caixa de Agosto"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: tokens.copper }}>
                        ENTREGUE • 12 AGO 2026
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#22C55E", background: "rgba(34, 197, 94, 0.12)", padding: "2px 8px", borderRadius: "4px" }}>
                        RECORRÊNCIA CONFIRMADA
                      </span>
                    </div>

                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", fontWeight: "700", margin: 0, color: tokens.text }}>
                      Caixa de Agosto — Master Churrasco
                    </h4>
                    <span style={{ fontSize: "13px", color: tokens.textMuted, lineHeight: "1.4" }}>
                      5 itens • 6.0kg • Picanha Steakhouse, Ancho, Tomahawk & Brinde Faca Artesanal
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
                    <span style={{ fontSize: "20px", fontWeight: "700", color: tokens.copper }}>
                      R$ {activePlan.monthlyPrice.toLocaleString("pt-BR")},00
                    </span>
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={() => alert("Combinação da Caixa de Agosto aplicada à sua próxima entrega!")}
                      style={{ transition: "all 0.3s ease" }}
                    >
                      Repetir esta caixa ➔
                    </Button>
                  </div>
                </Card>

                {/* Caixa 2: Julho */}
                <Card
                  variant="surface"
                  bordered
                  hoverable
                  isDark={isDark}
                  style={{
                    padding: "20px 24px",
                    borderRadius: "18px",
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: "24px",
                    alignItems: "flex-start",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}
                >
                  <div style={{ width: "76px", height: "76px", borderRadius: "12px", overflow: "hidden", background: tokens.surfaceContainer, border: `1px solid ${tokens.border}`, flexShrink: 0 }}>
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTWZZGOFHbj0Sh572RQ-2vs3emWIEGZWsTB1lYtPYcSjPGcOa9mDPiwX1GCl8gPBNEHqbv95kZnUF7gTwJASw-4aHOZWp1IUKwwTioZC70OM608r9UjPQKMk5Jw4B1qibJodt1tlgo4WyBhdw3iIDeBFHpi2CQBi4BqAaFV2b7RZGuMUPGAkZOHP76xP0TR6KM5dqPFvrumlSXF85A9N100tBX7rkGd__CupxrUAHLYbt5YnwVk0e-"
                      alt="Caixa de Julho"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: tokens.copper }}>
                        ENTREGUE • 12 JUL 2026
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#22C55E", background: "rgba(34, 197, 94, 0.12)", padding: "2px 8px", borderRadius: "4px" }}>
                        RECORRÊNCIA CONFIRMADA
                      </span>
                    </div>

                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", fontWeight: "700", margin: 0, color: tokens.text }}>
                      Caixa de Julho — Selection Wagyu & Angus
                    </h4>
                    <span style={{ fontSize: "13px", color: tokens.textMuted, lineHeight: "1.4" }}>
                      4 itens • 4.5kg • Wagyu A5 Striploin, Picanha Prime & Chorizo
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
                    <span style={{ fontSize: "20px", fontWeight: "700", color: tokens.copper }}>
                      R$ 780,00
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      isDark={isDark}
                      onClick={() => alert("Combinação da Caixa de Julho aplicada à sua próxima entrega!")}
                      style={{ transition: "all 0.3s ease" }}
                    >
                      Repetir esta caixa ➔
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

          </div>

          {/* COLUNA DIREITA: STICKY RESUMO DO PEDIDO */}
          <div style={{ position: "sticky", top: "100px" }}>
            <div
              style={{
                background: tokens.surfaceContainer,
                border: `1px solid ${tokens.border}`,
                borderRadius: "20px",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                boxShadow: isDark ? "0 16px 40px rgba(0,0,0,0.4)" : "0 16px 40px rgba(0,0,0,0.06)"
              }}
            >
              <div style={{ borderBottom: `1px solid ${tokens.border}`, paddingBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0, color: tokens.text }}>
                  RESUMO DO PEDIDO
                </h2>
                <Badge variant="copper">{boxMode.toUpperCase()}</Badge>
              </div>

              {/* Lista dos Itens Adicionados no Carrinho */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", minHeight: "120px" }}>
                {cart.length === 0 ? (
                  <div style={{ padding: "24px", textTransform: "uppercase", textAlign: "center", fontSize: "12px", color: tokens.textMuted, border: `1px dashed ${tokens.border}`, borderRadius: "12px" }}>
                    Sua caixa está vazia.<br />Adicione itens para começar.
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: "12px",
                        borderBottom: `1px solid ${tokens.border}`
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "14px", fontWeight: "700", color: tokens.text }}>
                          {item.quantity}x {item.name}
                        </span>
                        <span style={{ fontSize: "12px", color: tokens.textMuted }}>
                          {item.weight}
                        </span>
                      </div>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: tokens.copper }}>
                        R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Totais & Frete */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: `1px solid ${tokens.border}`, paddingTop: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: tokens.textMuted }}>
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: tokens.textMuted }}>
                  <span>Entrega Refrigerada (-2°C)</span>
                  <span style={{ color: boxMode === "assinatura" ? "#22C55E" : tokens.text, fontWeight: "700" }}>
                    {boxMode === "assinatura" ? "GRÁTIS (SÓCIO)" : `R$ ${shippingFee.toFixed(2).replace(".", ",")}`}
                  </span>
                </div>
              </div>

              {/* Valor Total Final */}
              <div style={{ borderTop: `1px solid ${tokens.border}`, paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: tokens.text }}>
                  TOTAL
                </span>
                <span style={{ fontSize: "28px", fontWeight: "700", color: tokens.copper }}>
                  <span style={{ fontSize: "16px", marginRight: "2px" }}>R$</span>
                  {grandTotal.toFixed(2).replace(".", ",")}
                </span>
              </div>

              {/* Botão de Checkout / Preparação */}
              <Button
                variant="accent"
                size="md"
                style={{ width: "100%", padding: "16px" }}
                onClick={() => alert("Pedido avançado para preparação com sucesso!")}
              >
                AVANÇAR PARA PREPARAÇÃO ➔
              </Button>
            </div>
          </div>

        </div>
      </main>

      {/* 3. BottomTabBar Mobile */}
      {showShell ? <BottomTabBar activeTab="minha-caixa" onNavigate={onNavigate} isDark={isDark} /> : null}

      {/* 4. Footer */}
      {showShell ? <Footer onNavigate={onNavigate} isDark={isDark} /> : null}
    </div>
  );
};
