"use client";

import styles from "./HomeStudySectionTwoOptions.module.css";

const collections = [
  ["Churrasco", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1100&q=85"],
  ["Cortes para preparar", "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=700&q=85"],
  ["Essenciais", "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=700&q=85"],
  ["Para compartilhar", "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=700&q=85"],
] as const;

type SectionTwoOption = 1 | 2 | 3 | 4 | 5;

export function HomeStudySectionTwoOptions({ option }: { option: SectionTwoOption }) {
  if (option === 1) return <section className={`${styles.section} ${styles.optionOne}`} id="secao-2"><p>SECAO 2 · OPCAO 01</p><h2>Uma colecao grande, tres caminhos ao lado.</h2><div className={styles.asymmetricGrid}>{collections.map(([name, image]) => <a href="#secao-3" key={name}><img alt="" src={image} /><span>{name}</span></a>)}</div></section>;
  if (option === 2) return <section className={`${styles.section} ${styles.optionTwo}`} id="secao-2"><div><p>SECAO 2 · OPCAO 02</p><h2>Deslize pelas colecoes.</h2></div><div className={styles.collectionRail}>{collections.map(([name, image]) => <a href="#secao-3" key={name}><img alt="" src={image} /><span>{name}</span></a>)}</div></section>;
  if (option === 3) return <section className={`${styles.section} ${styles.optionThree}`} id="secao-2"><p>SECAO 2 · OPCAO 03</p><h2>Quatro colecoes no mesmo plano.</h2><div className={styles.mosaic}>{collections.map(([name, image]) => <a href="#secao-3" key={name}><img alt="" src={image} /><span>{name}</span></a>)}</div></section>;
  if (option === 4) return <section className={`${styles.section} ${styles.optionFour}`} id="secao-2"><p>SECAO 2 · OPCAO 04</p><div className={styles.banners}><a href="#secao-3"><img alt="" src={collections[1][1]} /><span><b>PARA PREPARAR</b><strong>Cortes para cozinhar com calma.</strong></span></a><a href="#secao-3"><img alt="" src={collections[3][1]} /><span><b>PARA COMPARTILHAR</b><strong>Uma selecao para a mesa inteira.</strong></span></a></div></section>;
  return <section className={`${styles.section} ${styles.optionFive}`} id="secao-2"><p>SECAO 2 · OPCAO 05</p><h2>Escolha pela forma de servir.</h2><div className={styles.collectionList}>{collections.slice(0, 3).map(([name, image]) => <a href="#secao-3" key={name}><img alt="" src={image} /><span><strong>{name}</strong><small>Cortes para descobrir.</small></span></a>)}</div></section>;
}
