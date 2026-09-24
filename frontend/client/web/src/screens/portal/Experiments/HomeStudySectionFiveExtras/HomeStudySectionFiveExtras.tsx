"use client";

import { useRef } from "react";
import styles from "./HomeStudySectionFiveExtras.module.css";

const extras = [
  ["Carvao", "O fogo certo para a sua brasa.", "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=900&q=90"],
  ["Sal e temperos", "Camadas de sabor para cada corte.", "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=90"],
  ["Utensilios", "O essencial entre a grelha e a mesa.", "https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=900&q=90"],
  ["Acompanhamentos", "Detalhes que completam o churrasco.", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=90"],
  ["Presentes", "Uma selecao para compartilhar a experiencia.", "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=900&q=90"],
] as const;

interface HomeStudySectionFiveExtrasProps {
  option: 1 | 2 | 3 | 4 | 5;
}

export function HomeStudySectionFiveExtras({ option }: HomeStudySectionFiveExtrasProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const move = (direction: -1 | 1) => railRef.current?.scrollBy({ behavior: "smooth", left: direction * 300 });
  const cards = (className: string) => <div className={className} ref={railRef}>{extras.map(([name, detail, image], index) => <a href="#catalogo" key={name}><img alt="" src={image} /><span><small>0{index + 1} - EXTRAS ROYAL</small><strong>{name}</strong><em>{detail}</em><b>Ver opcoes</b></span></a>)}</div>;

  if (option === 1) return <section className={`${styles.section} ${styles.optionOne}`}><header><div><p>SECAO 5 - COMPLEMENTOS</p><h2>Voce tambem pode escolher.</h2><span>Tudo o que deixa a brasa pronta.</span></div><div className={styles.controls}><button aria-label="Categoria anterior" onClick={() => move(-1)} type="button">&lt;</button><button aria-label="Proxima categoria" onClick={() => move(1)} type="button">&gt;</button></div></header>{cards(styles.darkRail)}</section>;
  if (option === 2) return <section className={`${styles.section} ${styles.optionTwo}`}><header><div><p>SECAO 5 - COMPLEMENTOS</p><h2>Para alem dos cortes.</h2></div><div className={styles.wordControls}><button aria-label="Categoria anterior" onClick={() => move(-1)} type="button">Anterior</button><button aria-label="Proxima categoria" onClick={() => move(1)} type="button">Proximo</button></div></header>{cards(styles.lightRail)}</section>;
  if (option === 3) return <section className={`${styles.section} ${styles.optionThree}`}><header><p>SECAO 5 - COMPLEMENTOS</p><h2>O que completa a experiencia.</h2></header><div className={styles.edgeRail}><button aria-label="Categoria anterior" onClick={() => move(-1)} type="button">&lt;</button>{cards(styles.photoRail)}<button aria-label="Proxima categoria" onClick={() => move(1)} type="button">&gt;</button></div></section>;
  if (option === 4) return <section className={`${styles.section} ${styles.optionFour}`}><header><p>SECAO 5 - COMPLEMENTOS</p><h2>Da brasa a mesa.</h2><span>Arraste para descobrir mais.</span></header>{cards(styles.tileRail)}</section>;
  return <section className={`${styles.section} ${styles.optionFive}`}><header><div><p>SECAO 5 - COMPLEMENTOS</p><h2>Pequenos detalhes. Outra experiencia.</h2></div><span>01 - 05</span></header>{cards(styles.editorialRail)}<div className={styles.progress}><span /></div></section>;
}
