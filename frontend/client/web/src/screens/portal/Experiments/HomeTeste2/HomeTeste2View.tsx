"use client";

import { HomeStudyBase } from "../HomeStudyBase/HomeStudyBase";
import { HomeStudyProductCarousel } from "../HomeStudyProductCarousel/HomeStudyProductCarousel";
import { HomeStudySectionOne } from "../HomeStudySectionOne/HomeStudySectionOne";
import { HomeStudySectionFourOptions } from "../HomeStudySectionFourOptions/HomeStudySectionFourOptions";
import { HomeStudySectionTwoOptions } from "../HomeStudySectionTwoOptions/HomeStudySectionTwoOptions";
import styles from "./HomeTeste2View.module.css";

export function HomeTeste2View() {
  return <main className={styles.page}>
    <HomeStudySectionOne />
    <HomeStudySectionTwoOptions option={2} />
    <section className={styles.sectionThree} id="secao-3">
      <div><p>SECAO 3 - OPCAO 02</p><h2>Cortes para preparar agora.</h2></div>
      <HomeStudyProductCarousel mode="arrows" variant="outline" />
    </section>
    <HomeStudySectionFourOptions option={2} />
    <HomeStudyBase includeReferenceSectionFour={false} sectionFiveOption={2} sectionSixOption={2} sectionSevenOption={2} />
  </main>;
}
