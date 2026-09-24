"use client";

import styles from "./HomeStudySectionSevenClosing.module.css";

interface HomeStudySectionSevenClosingProps { option: 1 | 2 | 3 | 4 | 5; }

const actions = <div className={styles.actions}><a href="#catalogo">Ver catalogo</a><a href="#secao-4">Montar Royal Box</a></div>;

export function HomeStudySectionSevenClosing({ option }: HomeStudySectionSevenClosingProps) {
  if (option === 1) return <section className={`${styles.section} ${styles.centered}`} id="catalogo"><img alt="" src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1800&q=85" /><div><p>SECAO 7 - SUA PROXIMA MESA</p><h2>Agora e so escolher o que vai para a sua mesa.</h2><span>Cortes, complementos e a forma de receber que combina com o seu momento.</span>{actions}</div></section>;
  if (option === 2) return <section className={`${styles.section} ${styles.split}`} id="catalogo"><img alt="" src="https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1400&q=85" /><div><p>SECAO 7 - SUA PROXIMA MESA</p><h2>Uma selecao pronta para acontecer.</h2><span>Escolha os cortes ou monte a sua proxima Royal Box.</span>{actions}</div></section>;
  if (option === 3) return <section className={`${styles.section} ${styles.yellow}`} id="catalogo"><p>SECAO 7 - FECHAMENTO</p><h2>O proximo churrasco comeca aqui.</h2><span>Escolha do seu jeito. Receba no seu ritmo.</span>{actions}</section>;
  if (option === 4) return <section className={`${styles.section} ${styles.editorial}`} id="catalogo"><p>SECAO 7 - FECHAMENTO</p><h2>A mesa esta posta.<br />A escolha e sua.</h2><div><span>Cortes para hoje. Uma Box para o mes. Uma experiencia para lembrar.</span>{actions}</div></section>;
  return <section className={`${styles.section} ${styles.paths}`} id="catalogo"><p>SECAO 7 - COMECE POR AQUI</p><h2>Qual caminho voce quer seguir?</h2><div>{[["Cortes", "Escolher avulso"], ["Royal Box", "Montar a sua caixa"], ["Assinatura", "Conhecer os planos"]].map(([name, label], index) => <a href="#catalogo" key={name}><span>0{index + 1}</span><strong>{name}</strong><em>{label}</em><b>&gt;</b></a>)}</div></section>;
}
