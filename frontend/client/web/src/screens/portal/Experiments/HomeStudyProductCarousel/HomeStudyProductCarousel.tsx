"use client";

import { useRef, useState } from "react";
import styles from "./HomeStudyProductCarousel.module.css";

const products = [
  ["Picanha", "1 kg · Para grelhar", "R$ 149,90", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=650&q=85"],
  ["Ancho", "700 g · Marmoreio", "R$ 119,90", "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=650&q=85"],
  ["Fraldinha", "900 g · Para fatiar", "R$ 89,90", "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=650&q=85"],
  ["Prime rib", "1,1 kg · Para dividir", "R$ 159,90", "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=650&q=85"],
  ["Chorizo", "800 g - Corte argentino", "R$ 109,90", "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&w=650&q=85"],
  ["Short rib", "1,2 kg - Cozimento lento", "R$ 129,90", "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=650&q=85"],
  ["Assado de tira", "1 kg - Para compartilhar", "R$ 99,90", "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=650&q=85"],
  ["Tomahawk", "1,4 kg - Corte especial", "R$ 189,90", "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=650&q=85"],
] as const;

export type ProductCarouselVariant = "ink" | "outline" | "cream" | "glass" | "line";
export type ProductCarouselMode = "arrows" | "dots" | "peek" | "grid" | "sideArrows" | "edgeArrows";

interface HomeStudyProductCarouselProps {
  mode: ProductCarouselMode;
  variant: ProductCarouselVariant;
}

export function HomeStudyProductCarousel({ mode, variant }: HomeStudyProductCarouselProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const move = (direction: -1 | 1) => railRef.current?.scrollBy({ behavior: "smooth", left: direction * 300 });
  const select = (index: number) => {
    const target = railRef.current?.children.item(index) as HTMLElement | null;
    target?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    setActiveIndex(index);
  };

  return <div className={`${styles.carousel} ${styles[mode]} ${styles[variant]}`}>
    {mode === "arrows" ? <div className={styles.controls}><button aria-label="Produto anterior" onClick={() => move(-1)} type="button">Anterior</button><span>Deslize os cortes</span><button aria-label="Proximo produto" onClick={() => move(1)} type="button">Proximo</button></div> : null}
    {mode === "peek" ? <p className={styles.dragHint}>Arraste para ver os proximos cortes</p> : null}
    <div className={mode === "sideArrows" ? styles.railFrame : mode === "edgeArrows" ? styles.edgeFrame : undefined}>
      {mode === "sideArrows" ? <button aria-label="Produto anterior" className={styles.sideButton} onClick={() => move(-1)} type="button">&lt;</button> : null}
      <div className={styles.rail} ref={railRef}>
        {products.map(([name, detail, price, image]) => <a className={styles.card} href="#catalogo" key={name}><img alt="" src={image} /><span className={styles.content}><strong>{name}</strong><small>{detail}</small><b>{price}</b></span></a>)}
      </div>
      {mode === "sideArrows" ? <button aria-label="Proximo produto" className={styles.sideButton} onClick={() => move(1)} type="button">&gt;</button> : null}
      {mode === "edgeArrows" ? <button aria-label="Produto anterior" className={`${styles.edgeButton} ${styles.previous}`} onClick={() => move(-1)} type="button">&lt;</button> : null}
      {mode === "edgeArrows" ? <button aria-label="Proximo produto" className={`${styles.edgeButton} ${styles.next}`} onClick={() => move(1)} type="button">&gt;</button> : null}
    </div>
    {mode === "dots" ? <div className={styles.dots}>{products.map(([name], index) => <button aria-label={`Mostrar ${name}`} data-active={activeIndex === index || undefined} key={name} onClick={() => select(index)} type="button">{index + 1}</button>)}</div> : null}
  </div>;
}
