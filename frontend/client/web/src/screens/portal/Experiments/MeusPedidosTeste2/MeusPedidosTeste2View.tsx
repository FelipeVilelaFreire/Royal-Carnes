import styles from "./MeusPedidosTeste2View.module.css";

export function MeusPedidosTeste2View() {
  return <main className={styles.page}><section className={styles.content}>
    <header className={styles.header}><div><p>Meus pedidos</p><h1>Pedido RP-000123</h1></div><span>Atualizado agora</span></header>
    <section className={styles.overview}><div className={styles.state}><p>Status do pedido</p><strong>Em preparo</strong><span>Seu pedido esta em nossa cozinha.</span></div><div className={styles.time}><p>Previsao de chegada</p><strong>Hoje</strong><span>18h - 21h</span></div></section>
    <section className={styles.body}><section className={styles.timeline}><p>Andamento</p><article className={styles.done}><b>09:24</b><div><strong>Pedido confirmado</strong><span>Recebemos seu pagamento.</span></div></article><article className={styles.current}><b>Agora</b><div><strong>Em preparo</strong><span>Itens selecionados e separados.</span></div></article><article><b>Proximo</b><div><strong>Sai para entrega</strong><span>Voce recebe uma nova atualizacao.</span></div></article></section><aside className={styles.info}><p>Entrega</p><strong>Rua das Palmeiras, 120</strong><span>Portaria · Apto 42</span><hr /><p>Resumo</p><strong>6 itens</strong><span>Pagamento aprovado</span></aside></section>
    <section className={styles.history}><header><div><p>Historico</p><h2>Pedidos entregues</h2></div><span>2 pedidos</span></header><div className={styles.historyList}><article><div><strong>RP-000118</strong><span>12 de setembro · 8 itens</span></div><b>Entregue</b><em>€ 86,40</em></article><article><div><strong>RP-000104</strong><span>29 de agosto · 5 itens</span></div><b>Entregue</b><em>€ 64,90</em></article></div></section>
  </section></main>;
}
