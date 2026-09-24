import styles from "./MeusPedidosTeste4View.module.css";

export function MeusPedidosTeste4View() {
  return <main className={styles.page}><section className={styles.content}>
    <header className={styles.header}><div><p>Meus pedidos</p><h1>Pedido em andamento</h1></div><strong>RP-000123</strong></header>
    <section className={styles.summary}><div><p>Agora</p><strong>Em preparo</strong><span>Itens sendo separados.</span></div><div><p>Em seguida</p><strong>A caminho</strong><span>Voce sera avisado.</span></div><div><p>Previsao</p><strong>Sexta-feira</strong><span>18h - 21h</span></div></section>
    <section className={styles.route}><p>Linha do pedido</p><div><article className={styles.done}><b>1</b><strong>Confirmado</strong><span>Pagamento aprovado</span></article><article className={styles.current}><b>2</b><strong>Em preparo</strong><span>Separacao dos itens</span></article><article><b>3</b><strong>A caminho</strong><span>Saida para entrega</span></article><article><b>4</b><strong>Entregue</strong><span>Pedido finalizado</span></article></div></section>
    <section className={styles.footer}><span>6 itens no pedido</span><span>Rua das Palmeiras, 120</span><span>Pagamento aprovado</span></section>
    <section className={styles.history}><header><div><p>Historico</p><h2>Pedidos finalizados</h2></div><span>Ver todos</span></header><div className={styles.ledger}><article><span>12 SET 2026</span><strong>RP-000118</strong><span>8 itens</span><b>Entregue</b><em>€ 86,40</em></article><article><span>29 AGO 2026</span><strong>RP-000104</strong><span>5 itens</span><b>Entregue</b><em>€ 64,90</em></article></div></section>
  </section></main>;
}
