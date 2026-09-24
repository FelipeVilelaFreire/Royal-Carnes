"use client";

import styles from "./LandingTeste4View.module.css";

export function LandingTeste4View() {
  return <main className={styles.page}><section className={styles.lead}><div><p>ROYAL CARNES · ESTUDO 04</p><h1>O essencial<br />para receber bem.</h1><span>Cortes, acompanhamentos e uma seleção que não precisa gritar.</span><a href="#destaques">Ver destaques</a></div><img alt="" src="https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1300&q=85" /></section><section className={styles.picks} id="destaques"><p>NA SUA PRÓXIMA CAIXA</p><div><article><b>01</b><h2>Cortes altos</h2><span>Para a brasa ficar no centro.</span></article><article><b>02</b><h2>Clássicos da casa</h2><span>Escolhas que sempre funcionam.</span></article><article><b>03</b><h2>Para compartilhar</h2><span>Mais tempo ao redor da mesa.</span></article></div></section><section className={styles.band}><h2>Royal é quando a carne vira o melhor pretexto.</h2><a href="#catalogo">Abrir catálogo</a></section></main>;
}
