import styles from "./MeusPedidosTeste1View.module.css";

export function MeusPedidosTeste1View() {
  return <main className={styles.page}><section className={styles.content}>
    <header className={styles.header}><div><p>Meus pedidos</p><h1>Acompanhe seu pedido</h1></div><span>Pedido RP-000123</span></header>
    <section className={styles.status}><div><p>Status atual</p><strong>Em preparo</strong><span>Estamos separando os itens do seu pedido.</span></div><div className={styles.delivery}><p>Entrega prevista</p><strong>Sexta-feira</strong><span>18h - 21h</span></div></section>
    <section className={styles.progress} aria-label="Etapas do pedido"><article className={styles.done}><b>1</b><div><strong>Confirmado</strong><span>Pagamento aprovado</span></div></article><i /><article className={styles.current}><b>2</b><div><strong>Em preparo</strong><span>Itens sendo separados</span></div></article><i /><article><b>3</b><div><strong>A caminho</strong><span>Atualizaremos voce</span></div></article></section>
    <section className={styles.details}><article><p>Proxima atualizacao</p><strong>Quando sair para entrega</strong></article><article><p>Endereco de entrega</p><strong>Rua das Palmeiras, 120</strong></article><article><p>Itens no pedido</p><strong>6 produtos</strong></article></section>
    <section className={styles.history}><header><div><p>Historico</p><h2>Pedidos anteriores</h2></div><span>Ver todos</span></header><div className={styles.historyRows}><article><strong>RP-000118</strong><span>12 set 2026</span><span>8 itens</span><b>Entregue</b><em>€ 86,40</em></article><article><strong>RP-000104</strong><span>29 ago 2026</span><span>5 itens</span><b>Entregue</b><em>€ 64,90</em></article></div></section>
  </section></main>;
}
