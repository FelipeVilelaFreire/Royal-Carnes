"use client";

import styles from "./LandingTeste5View.module.css";

export function LandingTeste5View() {
  return <main className={styles.page}><section className={styles.hero}><div><p>ROYAL CARNES · ESTUDO 05</p><h1>Cortes certos.<br /><em>Sem excesso.</em></h1><a href="#prateleira">Comprar agora</a></div><aside><span>CURADORIA<br />ROYAL</span><b>05</b></aside></section><section className={styles.shelf} id="prateleira"><header><p>VITRINE DIRETA</p><h2>O que vai bem hoje.</h2></header><div><article><img alt="" src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85" /><h3>Picanha</h3><span>R$ 149,90</span></article><article><img alt="" src="https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=85" /><h3>Ancho</h3><span>R$ 89,90</span></article><article><img alt="" src="https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=85" /><h3>Short rib</h3><span>R$ 109,90</span></article></div></section><section className={styles.footer}><p>UMA BOA MESA COMEÇA AQUI.</p><a href="#mais">Ver todos os cortes</a></section></main>;
}
