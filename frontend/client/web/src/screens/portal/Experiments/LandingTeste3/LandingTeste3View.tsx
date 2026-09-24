"use client";

import styles from "./LandingTeste3View.module.css";

export function LandingTeste3View() {
  return <main className={styles.page}><section className={styles.hero}><p>ROYAL CARNES · ESTUDO 03</p><h1>Uma boa escolha começa<br />antes do primeiro corte.</h1><a href="#colecoes">Descobrir agora</a></section><section className={styles.collections} id="colecoes"><article><span>01</span><h2>Para a brasa</h2><img alt="" src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85" /></article><article><span>02</span><h2>Para preparar</h2><img alt="" src="https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=85" /></article><article><span>03</span><h2>Para dividir</h2><img alt="" src="https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=900&q=85" /></article></section><section className={styles.note}><p>CHEGA BEM. FICA MELHOR À MESA.</p><h2>Seleções pequenas para quem gosta de escolher bem.</h2></section></main>;
}
