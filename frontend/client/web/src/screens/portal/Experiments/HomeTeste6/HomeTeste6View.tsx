"use client";

import { useRef } from "react";
import styles from "./HomeTeste6View.module.css";

const reorders = [
  ["Picanha", "Seu ultimo pedido", "R$ 149,90", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=90"],
  ["Ancho", "Voce pediu ha 18 dias", "R$ 119,90", "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=90"],
  ["Fraldinha", "Para o proximo churrasco", "R$ 89,90", "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=90"],
  ["Carvao Royal", "Completa sua ultima selecao", "R$ 34,90", "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=90"],
  ["Sal de parrilla", "Um detalhe para a brasa", "R$ 22,90", "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=90"],
] as const;

const shortcuts = [["Cortes", "Escolher para hoje"], ["Minha Box", "Proximo ciclo em 4 dias"], ["Pedidos", "Ver novamente"], ["Assinatura", "Gerenciar plano"]] as const;

export function HomeTeste6View() {
  const railRef = useRef<HTMLDivElement>(null);
  const move = (direction: -1 | 1) => railRef.current?.scrollBy({ behavior: "smooth", left: direction * 300 });

  return <main className={styles.page}>
    <section className={styles.intro}>
      <div><p>INICIO</p><h1>Boa noite, Felipe.</h1><span>O que voce quer colocar na mesa hoje?</span></div>
      <a className={styles.cycleCard} href="#box"><small>SUA ROYAL BOX</small><strong>Proximo ciclo em 4 dias.</strong><em>Revisar selecao</em><b>&gt;</b></a>
    </section>

    <nav aria-label="Atalhos do cliente" className={styles.shortcuts}>{shortcuts.map(([name, detail], index) => <a href={index === 0 ? "#cortes" : index === 1 ? "#box" : "#pedidos"} key={name}><span>0{index + 1}</span><strong>{name}</strong><small>{detail}</small><b>&gt;</b></a>)}</nav>

    <section className={styles.reorder} id="cortes">
      <header><div><p>COMPRAR NOVAMENTE</p><h2>O que ja funcionou para voce.</h2></div><div><button aria-label="Produto anterior" onClick={() => move(-1)} type="button">&lt;</button><button aria-label="Proximo produto" onClick={() => move(1)} type="button">&gt;</button></div></header>
      <div className={styles.productRail} ref={railRef}>{reorders.map(([name, detail, price, image]) => <a href="#catalogo" key={name}><img alt="" src={image} /><span><small>{detail}</small><strong>{name}</strong><b>{price}</b><em>Adicionar de novo</em></span></a>)}</div>
    </section>

    <section className={styles.collection} id="box"><img alt="" src="https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1400&q=90" /><div><p>PARA A PROXIMA BRASA</p><h2>Uma selecao nova, sem recomecar do zero.</h2><span>Veja cortes escolhidos para o seu proximo momento.</span><a href="#catalogo">Explorar selecao</a></div></section>
  </main>;
}
