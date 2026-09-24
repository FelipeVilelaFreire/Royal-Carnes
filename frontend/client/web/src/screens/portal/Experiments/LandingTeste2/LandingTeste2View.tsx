"use client";

import styles from "./LandingTeste2View.module.css";

const moments = [
  ["Almoço sem pressa", "Cortes para preparar", "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1000&q=85"],
  ["Churrasco de sábado", "A brasa é o centro", "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1000&q=85"],
  ["Para dividir", "Mesa cheia, conversa longa", "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85"],
];

/** Laboratorio visual estatico: alternativa compacta e clara para a Home. */
export function LandingTeste2View() {
  return (
    <main className={styles.page}>
      <section className={styles.top}>
        <div><p>ROYAL CARNES · ESTUDO 02</p><h1>Escolha o momento.<br />A gente cuida da carne.</h1><a href="#momentos">Explorar ocasiões</a></div>
        <img alt="Mesa com carnes preparadas" src="https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1400&q=90" />
      </section>
      <section className={styles.moments} id="momentos">
        <header><p>COMECE POR UMA OCASIÃO</p><h2>Uma Home que parece uma revista de compra.</h2></header>
        <div className={styles.cards}>{moments.map(([title, text, image]) => <article key={title}><img alt="" src={image} /><div><span>{text}</span><h3>{title}</h3><a href="#catalogo">Ver coleção →</a></div></article>)}</div>
      </section>
      <section className={styles.selection}><div><p>SELEÇÃO DA SEMANA</p><h2>Quatro cortes para começar sem pensar demais.</h2><a href="#cortes">Ver os cortes</a></div><img alt="" src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85" /></section>
      <section className={styles.catalog} id="catalogo"><span>18</span><div><p>CORTES, KITS E ACOMPANHAMENTOS</p><h2>Não sabe por onde ir? Veja tudo o que acabou de chegar.</h2><a href="#top">Abrir catálogo</a></div></section>
    </main>
  );
}
