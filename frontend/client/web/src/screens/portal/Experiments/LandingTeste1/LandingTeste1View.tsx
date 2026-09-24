"use client";

import styles from "./LandingTeste1View.module.css";

const cuts = [
  ["Picanha maturada", "R$ 149,90", "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=85"],
  ["Tomahawk", "R$ 189,90", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85"],
  ["Ancho premium", "R$ 119,90", "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=85"],
];

/** Laboratorio visual estatico: nao representa catalogo, preco ou estoque reais. */
export function LandingTeste1View() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p>ROYAL CARNES · ESTUDO 01</p>
          <h1>O fogo aceso muda a noite inteira.</h1>
          <span>Uma vitrine cinematografica, com pouco texto e cortes no centro da conversa.</span>
          <a href="#selecao">Ver a seleção</a>
        </div>
      </section>
      <section className={styles.intro} id="selecao">
        <p>ESCOLHIDOS PARA A BRASA</p>
        <h2>Três cortes. Nenhum ruído.</h2>
      </section>
      <section className={styles.grid}>
        {cuts.map(([name, price, image]) => (
          <article className={styles.cut} key={name}>
            <img alt="" src={image} />
            <div><h3>{name}</h3><span>{price}</span></div>
          </article>
        ))}
      </section>
      <section className={styles.occasions}>
        <p>ESCOLHA O RITMO</p>
        <div><a href="#almoco">Almoço de domingo</a><a href="#brasa">Brasa acesa</a><a href="#presente">Para presentear</a></div>
      </section>
      <section className={styles.membership}><img alt="" src="https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=85" /><div><p>ROYAL BOX</p><h2>Uma seleção pensada para voltar à sua mesa.</h2><a href="#box">Conhecer a assinatura</a></div></section>
      <section className={styles.statement}>
        <p>DO CORTE À MESA</p>
        <h2>Carne boa pede tempo, gente e uma história para contar.</h2>
        <a href="#top">Montar uma caixa</a>
      </section>
    </main>
  );
}
