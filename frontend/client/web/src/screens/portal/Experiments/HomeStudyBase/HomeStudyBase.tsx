"use client";

import styles from "./HomeStudyBase.module.css";
import { HomeStudySectionFiveExtras } from "../HomeStudySectionFiveExtras/HomeStudySectionFiveExtras";
import { HomeStudySectionSixFeedback } from "../HomeStudySectionSixFeedback/HomeStudySectionSixFeedback";
import { HomeStudySectionSevenClosing } from "../HomeStudySectionSevenClosing/HomeStudySectionSevenClosing";

interface HomeStudyBaseProps {
  includeReferenceSectionFour?: boolean;
  sectionFiveOption?: 1 | 2 | 3 | 4 | 5;
  sectionSixOption?: 1 | 2 | 3 | 4 | 5;
  sectionSevenOption?: 1 | 2 | 3 | 4 | 5;
}

export function HomeStudyBase({ includeReferenceSectionFour = true, sectionFiveOption = 5, sectionSixOption = 5, sectionSevenOption = 5 }: HomeStudyBaseProps) {
  return <>
    {includeReferenceSectionFour ? <section className={styles.editorial}><img alt="" src="https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=1200&q=85" /><div><p>SECAO 4 - PROXIMA DESCOBERTA</p><h2>Uma mesa maior pede outra selecao.</h2><a href="#catalogo">Conhecer para compartilhar</a></div></section> : null}
    <HomeStudySectionFiveExtras option={sectionFiveOption} />
    <HomeStudySectionSixFeedback option={sectionSixOption} />
    <HomeStudySectionSevenClosing option={sectionSevenOption} />
  </>;
}
