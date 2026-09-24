"use client";

import { useRef, useState } from "react";
import { HomeStudyBase } from "../HomeStudyBase/HomeStudyBase";
import { HomeStudySectionOne } from "../HomeStudySectionOne/HomeStudySectionOne";
import { HomeStudySectionTwoOptions } from "../HomeStudySectionTwoOptions/HomeStudySectionTwoOptions";
import styles from "./HomeTeste5View.module.css";

const choices = [
  ["Picanha", "A escolha para fogo alto", "R$ 149,90", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=650&q=85"],
  ["Ancho", "Marmoreio e grelha quente", "R$ 119,90", "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=650&q=85"],
  ["Fraldinha", "Para cortar e compartilhar", "R$ 89,90", "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=650&q=85"],
  ["Prime rib", "Um corte para dividir", "R$ 159,90", "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=650&q=85"],
  ["Chorizo", "Grelha quente e tempo curto", "R$ 109,90", "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&w=650&q=85"],
  ["Short rib", "Fogo lento e textura", "R$ 129,90", "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=650&q=85"],
  ["Assado de tira", "A mesa toda participa", "R$ 99,90", "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=650&q=85"],
  ["Tomahawk", "O corte que abre a noite", "R$ 189,90", "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=650&q=85"],
] as const;

export function HomeTeste5View() {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const move = (direction: -1 | 1) => {
    railRef.current?.scrollBy({ behavior: "smooth", left: direction * 350 });
    setActiveIndex((current) => Math.min(choices.length - 1, Math.max(0, current + direction)));
  };

  return <main className={styles.page}>
    <HomeStudySectionOne />
    <HomeStudySectionTwoOptions option={5} />
    <section className={styles.sectionThree} id="secao-3">
      <div><p>SECAO 3 - OPCAO 05</p><h2>Um card mais editorial.</h2></div>
      <div className={styles.editorialControls}>
        <span>0{activeIndex + 1} - 08</span>
        <div className={styles.progressTrack}><span className={styles.progressFill} data-position={activeIndex + 1} /></div>
        <div><button aria-label="Card anterior" onClick={() => move(-1)} type="button">&lt;</button><button aria-label="Proximo card" onClick={() => move(1)} type="button">&gt;</button></div>
      </div>
      <div className={styles.choiceRail} ref={railRef}>{choices.map(([name, note, price, image], index) => <a className={styles.choiceCard} href="#catalogo" key={name}><img alt="" src={image} /><span className={styles.index}>0{index + 1}</span><span className={styles.choiceContent}><strong>{name}</strong><small>{note}</small><b>{price}</b><em>Ver corte</em></span></a>)}</div>
    </section>
    <HomeStudyBase />
  </main>;
}
