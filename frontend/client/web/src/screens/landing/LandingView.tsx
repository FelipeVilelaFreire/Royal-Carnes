"use client";

import React from "react";
import { SectionContainer } from "@foundation/ui/SectionContainer/SectionContainer";
import { sharedAssets } from "@royalprime/client/manifest/assets";
import {
  DifferentialsSection,
  FaqSection,
  GiftSection,
  HeroSection,
  PlansSection,
  ShowcaseSection,
  StepsSection,
} from "./sections";

export interface LandingViewProps {
  onNavigate?: (path: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const handleRouteClick = (routeKey: string) => {
    if (routeKey === "plans") {
      onNavigate?.("/home");
      return;
    }

    onNavigate?.(`/${routeKey}`);
  };

  return (
    <>
      <SectionContainer
        atmosphere="image"
        backgroundImage={sharedAssets.client.landing.heroBackground}
        headerSafety
        heightRecipe="heroPeek"
        id="top"
        usefulColumns={17}
      >
        <HeroSection onRouteClick={handleRouteClick} />
      </SectionContainer>

      <SectionContainer atmosphere="solid" id="clube" usefulColumns={17}>
        <DifferentialsSection />
      </SectionContainer>

      <SectionContainer atmosphere="glass" id="selecao" usefulColumns={17}>
        <ShowcaseSection />
      </SectionContainer>

      <SectionContainer atmosphere="solid" id="como-funciona" usefulColumns={17}>
        <StepsSection />
      </SectionContainer>

      <SectionContainer atmosphere="glass" id="assinaturas" usefulColumns={17}>
        <PlansSection onRouteClick={handleRouteClick} />
      </SectionContainer>

      <SectionContainer atmosphere="solid" id="royal-box" usefulColumns={17}>
        <GiftSection onRouteClick={handleRouteClick} />
      </SectionContainer>

      <SectionContainer atmosphere="solid" id="faq" usefulColumns={14}>
        <FaqSection />
      </SectionContainer>
    </>
  );
};
