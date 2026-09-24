"use client";

import { useRef } from "react";
import { ProductItemCard } from "@royalprime/product-components/ecommerce";
import { HomeStudyBase } from "../HomeStudyBase/HomeStudyBase";
import { HomeStudySectionOne } from "../HomeStudySectionOne/HomeStudySectionOne";
import { HomeStudySectionFourOptions } from "../HomeStudySectionFourOptions/HomeStudySectionFourOptions";
import { HomeStudySectionTwoOptions } from "../HomeStudySectionTwoOptions/HomeStudySectionTwoOptions";
import styles from "./HomeTeste4View.module.css";

const products = [
  ["Picanha", "1 kg", 149.9, "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=650&q=85"],
  ["Ancho", "700 g", 119.9, "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=650&q=85"],
  ["Fraldinha", "900 g", 89.9, "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=650&q=85"],
  ["Prime rib", "1,1 kg", 159.9, "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=650&q=85"],
  ["Chorizo", "800 g", 109.9, "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&w=650&q=85"],
  ["Short rib", "1,2 kg", 129.9, "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=650&q=85"],
  ["Assado de tira", "1 kg", 99.9, "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=650&q=85"],
  ["Tomahawk", "1,4 kg", 189.9, "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=650&q=85"],
] as const;

export function HomeTeste4View() {
  const railRef = useRef<HTMLDivElement>(null);
  const move = (direction: -1 | 1) => railRef.current?.scrollBy({ behavior: "smooth", left: direction * 300 });

  return <main className={styles.page}>
    <HomeStudySectionOne />
    <HomeStudySectionTwoOptions option={4} />
    <section className={styles.sectionThree} id="secao-3">
      <div><p>SECAO 3 - OPCAO 04</p><h2>Escolhas para a brasa.</h2><span className={styles.dragHint}>Arraste para explorar a selecao</span></div>
      <div className={styles.productRail} ref={railRef}>{products.map(([name, detail, price, image]) => <ProductItemCard actionLabel="Adicionar" categoryLabel="Cortes selecionados" description="Escolha estatica para comparar o card de produto." detailLabel={detail} image={image} key={name} name={name} onAction={() => undefined} preset="catalogo" price={price} showAction />)}</div>
      <div className={styles.underControls}><button aria-label="Produto anterior" onClick={() => move(-1)} type="button">&lt;</button><span>CONTROLES ABAIXO DO TRILHO</span><button aria-label="Proximo produto" onClick={() => move(1)} type="button">&gt;</button></div>
    </section>
    <HomeStudySectionFourOptions option={4} />
    <HomeStudyBase includeReferenceSectionFour={false} sectionFiveOption={4} sectionSixOption={4} sectionSevenOption={4} />
  </main>;
}
