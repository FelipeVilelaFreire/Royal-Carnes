import styles from "./MeusPedidosTeste3View.module.css";

export function MeusPedidosTeste3View() {
  return <main className={styles.page}><section className={styles.content}>
    <header className={styles.header}><div><p>Meus pedidos / pedido atual</p><h1>RP-000123</h1></div><span>6 itens</span></header>
    <section className={styles.grid}><aside className={styles.order}><p>Pedido feito em</p><strong>18 de setembro</strong><hr /><p>Pagamento</p><strong>Aprovado</strong><hr /><p>Entrega</p><strong>Rua das Palmeiras, 120</strong></aside><section className={styles.focus}><p>Situacao agora</p><strong>Em preparo</strong><span>Estamos montando seu pedido.</span><div><b>2</b><span>de 3 etapas concluidas</span></div></section><aside className={styles.eta}><p>Chegada estimada</p><strong>SEX</strong><b>18</b><span>18h - 21h</span></aside></section>
    <section className={styles.steps}><article><b>01</b><strong>Confirmado</strong><span>Pagamento aprovado</span></article><article className={styles.current}><b>02</b><strong>Em preparo</strong><span>Itens sendo separados</span></article><article><b>03</b><strong>A caminho</strong><span>Proxima atualizacao</span></article></section>
    <section className={styles.history}><header><div><p>Historico de pedidos</p><h2>Entregues recentemente</h2></div><span>2 pedidos</span></header><div className={styles.historyGrid}><article><p>12 SET</p><strong>RP-000118</strong><span>8 itens · € 86,40</span><b>Entregue</b></article><article><p>29 AGO</p><strong>RP-000104</strong><span>5 itens · € 64,90</span><b>Entregue</b></article></div></section>
  </section></main>;
}
