"use client";

import styles from "./HomeTeste8View.module.css";

const quickActions = [["Cortes", "Comprar para hoje"], ["Minha Box", "Chega em 4 dias"], ["Pedidos", "Ver historico"], ["Assinatura", "Seu plano"]] as const;
const reorders = [["Picanha", "Seu ultimo favorito", "R$ 149,90", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=720&q=90"], ["Fraldinha", "Para compartilhar", "R$ 89,90", "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=720&q=90"], ["Sal de parrilla", "Completa a selecao", "R$ 22,90", "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=720&q=90"]] as const;

export function HomeTeste8View() {
  return <main className={styles.stage}>
    <section className={styles.phoneFrame}>
      <header className={styles.greeting}><p>INICIO</p><h1>Boa noite, Felipe.</h1><span>O fogo de sexta ja esta encaminhado.</span></header>
      <a className={styles.delivery} href="#box"><span><small>PROXIMA ENTREGA</small><strong>Sexta-feira, 18:00 - 20:00</strong><em>Sua Royal Box esta quase pronta.</em></span><b>&gt;</b></a>
      <nav aria-label="Atalhos do cliente" className={styles.shortcuts}>{quickActions.map(([title, detail], index) => <a href={index === 0 ? "#recomprar" : "#box"} key={title}><span>0{index + 1}</span><strong>{title}</strong><small>{detail}</small></a>)}</nav>
      <section className={styles.reorder} id="recomprar"><header><div><p>COMPRAR NOVAMENTE</p><h2>Pronto para repetir.</h2></div><a href="#catalogo">Ver todos &gt;</a></header><div className={styles.productRail}>{reorders.map(([title, detail, price, image]) => <a href="#catalogo" key={title}><img alt="" src={image} /><span><small>{detail}</small><strong>{title}</strong><b>{price}</b><em>Adicionar</em></span></a>)}</div></section>
      <section className={styles.next} id="box"><img alt="" src="https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=900&q=90" /><div><p>PARA A PROXIMA BRASA</p><h2>Altere sua Box antes de quinta.</h2><a href="#catalogo">Revisar selecao &gt;</a></div></section>
    </section>
  </main>;
}
