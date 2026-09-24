import styles from "./MeusPedidosTeste5View.module.css";

export function MeusPedidosTeste5View() {
  return <main className={styles.page}><section className={styles.content}>
    <header className={styles.header}><div><p>Meus pedidos</p><h1>Central do pedido</h1></div><span>RP-000123</span></header>
    <section className={styles.top}><div className={styles.status}><p>Status atual</p><strong>Em preparo</strong><span>Seu pedido esta sendo preparado.</span></div><div className={styles.delivery}><p>Entrega prevista</p><strong>Sexta-feira · 18h - 21h</strong><span>Rua das Palmeiras, 120</span></div></section>
    <section className={styles.columns}><section className={styles.checklist}><p>Acompanhamento</p><article className={styles.done}><b>Concluido</b><div><strong>Pagamento aprovado</strong><span>Recebemos seu pedido.</span></div></article><article className={styles.current}><b>Agora</b><div><strong>Preparando seus itens</strong><span>Esta etapa pode levar alguns minutos.</span></div></article><article><b>Depois</b><div><strong>Pedido sai para entrega</strong><span>Enviaremos uma atualizacao.</span></div></article></section><aside className={styles.summary}><p>Resumo do pedido</p><strong>6 itens</strong><span>Subtotal confirmado</span><hr /><p>Precisa de ajuda?</p><strong>Fale com a Royal Prime</strong></aside></section>
    <section className={styles.history}><header><div><p>Historico</p><h2>Pedidos anteriores</h2></div><span>Ver todos</span></header><div className={styles.historyCards}><article><p>Pedido entregue</p><strong>RP-000118</strong><span>12 set · 8 itens</span><b>€ 86,40</b></article><article><p>Pedido entregue</p><strong>RP-000104</strong><span>29 ago · 5 itens</span><b>€ 64,90</b></article></div></section>
  </section></main>;
}
