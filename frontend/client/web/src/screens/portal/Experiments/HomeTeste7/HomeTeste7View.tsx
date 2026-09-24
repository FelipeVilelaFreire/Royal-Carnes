"use client";

import styles from "./HomeTeste7View.module.css";

const entryPoints = [
  ["Cortes para hoje", "Selecao direta para a grelha", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=90"],
  ["Essenciais da brasa", "Carvao, sal e utensilios", "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=900&q=90"],
] as const;

export function HomeTeste7View() {
  return <main className={styles.stage}>
    <section className={styles.phoneFrame}>
      <div className={styles.topline}><span>ROYAL PRIME</span><a href="#entrar">Entrar</a></div>
      <section className={styles.hero}>
        <img alt="" src="https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1100&q=90" />
        <div><p>PARA QUEM CHEGOU AGORA</p><h1>A sua proxima brasa comeca aqui.</h1><span>Escolha o momento. A gente ajuda a encontrar os cortes.</span></div>
      </section>
      <section className={styles.moments}>
        <p>ESCOLHA O MOMENTO</p>
        <div><a href="#cortes">Churrasco hoje</a><a href="#cortes">Jantar a dois</a><a href="#cortes">Para a semana</a></div>
      </section>
      <section className={styles.discover} id="cortes">
        <header><div><p>COMECE POR AQUI</p><h2>Sem catalogo infinito.</h2></div><span>01 / 02</span></header>
        <div className={styles.cardRail}>{entryPoints.map(([title, description, image]) => <a href="#entrar" key={title}><img alt="" src={image} /><span><small>{description}</small><strong>{title}</strong><b>Explorar &gt;</b></span></a>)}</div>
      </section>
      <section className={styles.access} id="entrar"><p>JA CONHECE A ROYAL?</p><h2>Entre para ver pedidos, sua Box e recompras.</h2><a href="#acesso">Entrar ou criar conta</a></section>
    </section>
  </main>;
}
