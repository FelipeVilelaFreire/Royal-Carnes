"use client";

import { useRef } from "react";
import styles from "./HomeStudySectionSixFeedback.module.css";

const reviews = [
  ["Felipe", "Karlsruhe", "Royal Box", "Chegou impecavel e a selecao fez a mesa toda conversar.", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=90"],
  ["Marina", "Sao Paulo", "Pedido avulso", "Cortes bonitos, entrega simples e uma brasa que virou noite longa.", "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=90"],
  ["Rafael", "Curitiba", "Assinatura", "A selecao pronta tirou a duvida e manteve o ritual da semana.", "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=900&q=90"],
  ["Bianca", "Florianopolis", "Royal Box", "A caixa chegou no dia certo e deixou tudo mais simples para receber.", "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=90"],
  ["Lucas", "Belo Horizonte", "Pedido avulso", "Escolhi os cortes em minutos e o churrasco ficou memoravel.", "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=90"],
  ["Ana", "Porto Alegre", "Assinatura", "Virou um momento nosso, sem precisar decidir tudo de novo.", "https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=900&q=90"],
] as const;

interface HomeStudySectionSixFeedbackProps { option: 1 | 2 | 3 | 4 | 5; }

export function HomeStudySectionSixFeedback({ option }: HomeStudySectionSixFeedbackProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const move = (direction: -1 | 1) => railRef.current?.scrollBy({ behavior: "smooth", left: direction * 320 });
  if (option === 1) return <section className={`${styles.section} ${styles.editorial}`}><img alt="" src={reviews[0][4]} /><div><p>SECAO 6 - NA MESA DE QUEM ESCOLHE</p><blockquote>“{reviews[0][3]}”</blockquote><span>{reviews[0][0]}, {reviews[0][1]} - {reviews[0][2]}</span><div className={styles.editorialRail}>{reviews.slice(1).map(([name, city, mode, quote, image]) => <article key={name}><img alt="" src={image} /><q>{quote}</q><b>{name}, {city} - {mode}</b></article>)}</div></div></section>;
  if (option === 2) return <section className={`${styles.section} ${styles.cards}`}><header><p>SECAO 6 - FEEDBACK</p><h2>Historias que continuam na mesa.</h2></header><div>{reviews.map(([name, city, mode, quote, image]) => <article key={name}><img alt="" src={image} /><blockquote>“{quote}”</blockquote><span>{name}, {city}</span><small>{mode}</small></article>)}</div></section>;
  if (option === 3) return <section className={`${styles.section} ${styles.mosaic}`}><header><p>SECAO 6 - FEEDBACK</p><h2>Momentos que merecem voltar.</h2></header><div className={styles.mosaicGrid}>{reviews.map(([name, city, mode, quote, image], index) => <article key={name}><img alt="" src={image} /><span><small>0{index + 1} - {mode}</small><blockquote>“{quote}”</blockquote><b>{name}, {city}</b></span></article>)}</div></section>;
  if (option === 4) return <section className={`${styles.section} ${styles.railSection}`}><header><div><p>SECAO 6 - FEEDBACK</p><h2>O que fica depois da brasa.</h2></div><div><button aria-label="Feedback anterior" onClick={() => move(-1)} type="button">&lt;</button><button aria-label="Proximo feedback" onClick={() => move(1)} type="button">&gt;</button></div></header><div className={styles.reviewRail} ref={railRef}>{reviews.map(([name, city, mode, quote, image]) => <article key={name}><img alt="" src={image} /><blockquote>“{quote}”</blockquote><span>{name}, {city}</span><small>{mode}</small></article>)}</div></section>;
  return <section className={`${styles.section} ${styles.darkQuote}`}><p>SECAO 6 - FEEDBACK</p><blockquote>“{reviews[1][3]}”</blockquote><span>{reviews[1][0]}, {reviews[1][1]} - {reviews[1][2]}</span><div>{reviews.filter((_, index) => index !== 1).map(([name, city, mode, quote]) => <article key={name}><small>{mode}</small><q>{quote}</q><b>{name}, {city}</b></article>)}</div></section>;
}
