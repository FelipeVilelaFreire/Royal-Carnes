"use client";

import styles from "./HomeStudySectionFourOptions.module.css";

const options = [
  ["Royal Assinatura", "Uma selecao pronta para voltar a sua mesa.", "Plano definido e recorrente.", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1100&q=90"],
  ["Royal Box", "A sua caixa, do seu jeito, todos os meses.", "Composicao e dia escolhidos por voce.", "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1100&q=90"],
  ["Avulso", "Escolha hoje. Receba sem compromisso.", "Um pedido unico para quando precisar.", "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1100&q=90"],
] as const;

interface HomeStudySectionFourOptionsProps {
  option: 1 | 2 | 3 | 4;
}

export function HomeStudySectionFourOptions({ option }: HomeStudySectionFourOptionsProps) {
  if (option === 1) return <section className={`${styles.section} ${styles.cards}`}><header><p>SECAO 4 - FORMAS DE COMPRAR</p><h2>Uma curadoria. Tres formas de chegar a sua mesa.</h2></header><div className={styles.cardGrid}>{options.map(([name, title, detail, image]) => <a href="#catalogo" key={name}><img alt="" src={image} /><span><small>{name}</small><strong>{title}</strong><em>{detail}</em><b>Conhecer</b></span></a>)}</div></section>;
  if (option === 2) return <section className={`${styles.section} ${styles.featured}`}><header><p>SECAO 4 - FORMAS DE COMPRAR</p><h2>Escolha o ritmo da sua mesa.</h2></header><div className={styles.featuredGrid}><a className={styles.box} href="#catalogo"><img alt="" src={options[1][3]} /><span><small>ROYAL BOX</small><strong>A sua caixa, todos os meses.</strong><em>Monte a composicao e escolha o dia.</em><b>Montar uma Box</b></span></a><div>{[options[0], options[2]].map(([name, title, detail, image]) => <a href="#catalogo" key={name}><img alt="" src={image} /><span><small>{name}</small><strong>{title}</strong><em>{detail}</em><b>Conhecer</b></span></a>)}</div></div></section>;
  if (option === 3) return <section className={`${styles.section} ${styles.stripes}`}><header><p>SECAO 4 - FORMAS DE COMPRAR</p><h2>O mesmo padrao. No seu tempo.</h2></header><div>{options.map(([name, title, detail, image], index) => <a href="#catalogo" key={name}><span>0{index + 1}</span><img alt="" src={image} /><div><small>{name}</small><strong>{title}</strong><em>{detail}</em></div><b>Ver opcao</b></a>)}</div></section>;
  return <section className={`${styles.section} ${styles.editorial}`}><img alt="" src={options[1][3]} /><div><p>SECAO 4 - FORMAS DE COMPRAR</p><h2>Qual relacao voce quer ter com a sua selecao?</h2><div className={styles.optionList}>{options.map(([name, title, detail, image], index) => <a href="#catalogo" key={name}><span>0{index + 1}</span><img alt="" src={image} /><div><small>{name}</small><strong>{title}</strong><em>{detail}</em></div><b>&gt;</b></a>)}</div></div></section>;
}
