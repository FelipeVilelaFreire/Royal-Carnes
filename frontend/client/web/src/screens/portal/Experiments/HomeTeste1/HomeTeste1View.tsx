"use client";

import { HomeStudyBase } from "../HomeStudyBase/HomeStudyBase";
import { HomeStudyProductCarousel } from "../HomeStudyProductCarousel/HomeStudyProductCarousel";
import { HomeStudySectionOne } from "../HomeStudySectionOne/HomeStudySectionOne";
import { HomeStudySectionFourOptions } from "../HomeStudySectionFourOptions/HomeStudySectionFourOptions";
import { HomeStudySectionTwoOptions } from "../HomeStudySectionTwoOptions/HomeStudySectionTwoOptions";
import styles from "./HomeTeste1View.module.css";

export function HomeTeste1View() {
  return <main className={styles.page}>
    <HomeStudySectionOne />
    <HomeStudySectionTwoOptions option={1} />
    <section className={styles.sectionThree} id="secao-3">
      <div><p>SECAO 3 - OPCAO 01</p><h2>Escolhidos para a brasa.</h2></div>
      <HomeStudyProductCarousel mode="edgeArrows" variant="ink" />
    </section>
    <HomeStudySectionFourOptions option={1} />
    <HomeStudyBase includeReferenceSectionFour={false} sectionFiveOption={1} sectionSixOption={1} sectionSevenOption={1} />
  </main>;
}
