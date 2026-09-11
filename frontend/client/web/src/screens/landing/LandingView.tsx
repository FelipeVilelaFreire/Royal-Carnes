"use client";

import React from "react";
import { SectionContainer } from "@foundation/ui/web/SectionContainer/SectionContainer";
import { sharedAssets } from "@royalprime/client/manifest/assets";
import {
  DifferentialsSection,
  FaqSection,
  GiftSection,
  HomeSection,
  HowItWorksSection,
  PlansSection,
  ProductOptionsSection,
  ShowcaseSection,
} from "./sections";

export interface LandingViewProps {
  onNavigate?: (path: string) => void;
}

const LANDING_SECTION_IDS_BY_ROUTE_KEY: Record<string, string> = {
  faq: "faq",
  home: "top",
  howItWorks: "how-it-works",
  plans: "assinaturas",
  productOptions: "product-options",
  showcase: "catalogos",
  top: "top",
};

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const handleRouteClick = (routeKey: string) => {
    const landingSectionId = LANDING_SECTION_IDS_BY_ROUTE_KEY[routeKey] ?? routeKey;

    if (LANDING_SECTION_IDS_BY_ROUTE_KEY[routeKey] || document.getElementById(landingSectionId)) {
      document.getElementById(landingSectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    onNavigate?.(`/${routeKey}`);
  };

  return (
    <>
      <SectionContainer
        atmosphere="solid"
        headerSafety
        heightRecipe="heroPeek"
        id="top"
        usefulColumns={20}
      >
        <HomeSection onRouteClick={handleRouteClick} />
      </SectionContainer>

      <SectionContainer atmosphere="glass" id="product-options" usefulColumns={20}>
        <ProductOptionsSection onRouteClick={handleRouteClick} />
      </SectionContainer>

      <SectionContainer atmosphere="solid" id="how-it-works" usefulColumns={20}>
        <HowItWorksSection onRouteClick={handleRouteClick} />
      </SectionContainer>

      <SectionContainer atmosphere="glass" id="assinaturas" usefulColumns={20}>
        <PlansSection onRouteClick={handleRouteClick} />
      </SectionContainer>

      <SectionContainer
        atmosphere="image"
        backgroundImage={sharedAssets.client.landing.heroBackground}
        id="catalogos"
        usefulColumns={20}
      >
        <ShowcaseSection />
      </SectionContainer>

      <SectionContainer atmosphere="glass" id="diferenciais" usefulColumns={20}>
        <DifferentialsSection />
      </SectionContainer>

      <SectionContainer atmosphere="solid" id="royal-box" usefulColumns={20}>
        <GiftSection onRouteClick={handleRouteClick} />
      </SectionContainer>

      <SectionContainer atmosphere="glass" id="faq" usefulColumns={14}>
        <FaqSection />
      </SectionContainer>
    </>
  );
};
