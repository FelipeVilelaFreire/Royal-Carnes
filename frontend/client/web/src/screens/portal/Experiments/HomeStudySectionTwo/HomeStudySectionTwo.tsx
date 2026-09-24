"use client";
import styles from "./HomeStudySectionTwo.module.css";
const cards = [["Churrasco", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1100&q=85"], ["Cortes para preparar", "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=700&q=85"], ["Essenciais", "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=700&q=85"]];
/** Secao 2 congelada: previa de catalogo usada igual nas cinco rotas. */
export function HomeStudySectionTwo() { return <section className={styles.sectionTwo} id="secao-2"><div className={styles.sectionHead}><div><p>SECAO 2 · CONGELADA</p><h2>Encontre a colecao certa.</h2></div><a href="#secao-3">Ver catalogo</a></div><div className={styles.grid}>{cards.map(([name, image]) => <a href="#secao-3" key={name}><img alt="" src={image} /><span>{name}</span></a>)}</div></section>; }
