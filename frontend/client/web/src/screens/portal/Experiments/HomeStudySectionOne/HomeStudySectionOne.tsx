"use client";

import styles from "./HomeStudySectionOne.module.css";

/** Secao 1 congelada: usada igual nas cinco rotas durante os testes da Secao 2. */
export function HomeStudySectionOne() {
  return <section className={styles.sectionOne}>
    <div className={styles.overlay}>
      <p>SECAO 1 · CONGELADA</p>
      <h1>Selecao da churrasqueira.</h1>
      <span>Uma abertura por colecao com foto de fundo, proxima da Home atual.</span>
      <a href="#secao-2">Ver selecao</a>
    </div>
  </section>;
}
