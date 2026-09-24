"use client";

import { HomeStudyBase } from "../HomeStudyBase/HomeStudyBase";
import { HomeStudyProductCarousel } from "../HomeStudyProductCarousel/HomeStudyProductCarousel";
import { HomeStudySectionOne } from "../HomeStudySectionOne/HomeStudySectionOne";
import { HomeStudySectionFourOptions } from "../HomeStudySectionFourOptions/HomeStudySectionFourOptions";
import { HomeStudySectionTwoOptions } from "../HomeStudySectionTwoOptions/HomeStudySectionTwoOptions";
import styles from "./HomeTeste3View.module.css";

export function HomeTeste3View() {
  return <main className={styles.page}>
    <HomeStudySectionOne />
    <HomeStudySectionTwoOptions option={3} />
    <section className={styles.sectionThree} id="secao-3">
      <div>
        <p>SECAO 3 - OPCAO 03</p>
        <h2>Mais pedidos da semana.</h2>
      </div>
      <HomeStudyProductCarousel mode="sideArrows" variant="cream" />
    </section>
    <HomeStudySectionFourOptions option={3} />
    <HomeStudyBase includeReferenceSectionFour={false} sectionFiveOption={3} sectionSixOption={3} sectionSevenOption={3} />
  </main>;
}
