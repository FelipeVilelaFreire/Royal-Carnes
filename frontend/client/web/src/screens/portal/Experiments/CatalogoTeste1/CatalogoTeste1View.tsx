"use client";

import styles from "./CatalogoTeste1View.module.css";

const products = [
  ["Bife ancho", "R$ 89,90", "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=85"],
  ["Short rib", "R$ 109,90", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85"],
  ["Picanha", "R$ 149,90", "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=85"],
  ["Prime burger", "R$ 42,90", "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=85"],
];

/** Laboratorio visual estatico: nao usa filtros, carrinho ou dados de catalogo. */
export function CatalogoTeste1View() {
  return <main className={styles.page}>
    <header className={styles.intro}><p>CATÁLOGO · ESTUDO 01</p><h1>Cortes que merecem<br />a sua próxima receita.</h1><span>28 itens selecionados</span></header>
    <nav className={styles.filters}><a href="#todos">Todos</a><a href="#bovinos">Bovinos</a><a href="#aves">Aves</a><a href="#acompanhamentos">Acompanhamentos</a><a href="#kits">Kits</a></nav>
    <section className={styles.products} id="todos">{products.map(([name, price, image], index) => <article key={name}><div className={styles.imageWrap}><img alt="" src={image} /><span>{index % 2 ? "NOVO" : "SELEÇÃO ROYAL"}</span></div><div className={styles.info}><h2>{name}</h2><p>Porção para a sua mesa</p><strong>{price}</strong><a href="#adicionar">Adicionar +</a></div></article>)}</section>
  </main>;
}
