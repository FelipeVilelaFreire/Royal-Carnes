export const adminPtBR = {
  brand: {
    name: "PRIME CUT ADMIN",
    tagline: "Painel de Gestão & Operação do Clube"
  },
  navigation: {
    dashboard: "Dashboard",
    cortes: "Catálogo de Cortes",
    caixas: "Despacho de Caixas",
    socios: "Gestão de Sócios",
    configuracoes: "Configurações"
  },
  dashboard: {
    title: "Visão Geral da Operação",
    subtitle: "Acompanhe a receita recorrente, sócios ativos e entregas em tempo real.",
    kpis: {
      mrr: { label: "Faturamento Mensal (MRR)", value: "R$ 142.500", change: "+12,4% este mês" },
      activeMembers: { label: "Sócios Ativos", value: "512", change: "42 novos em agosto" },
      pendingBoxes: { label: "Caixas a Despachar", value: "480", change: "Entrega em 12/09" },
      retentionRate: { label: "Taxa de Retenção", value: "96,8%", change: "Churn baixíssimo (3,2%)" }
    }
  },
  cortes: {
    title: "Catálogo de Cortes Nobres",
    subtitle: "Gestão de estoque, maturação, graus de marmoreio e precificação por kg.",
    ctaAdd: "+ Novo Corte",
    table: {
      headers: ["Corte / Produto", "Categoria", "Origem / Raça", "Maturação", "Preço Sócio/kg", "Status", "Ações"]
    }
  },
  caixas: {
    title: "Esteira de Despacho & Logística",
    subtitle: "Controle térmico (-2°C) e expedição da Caixa de Setembro/2026.",
    ctaBatchDispatch: "🚀 Iniciar Despacho em Lote",
    steps: ["Pedido Confirmado", "Em Preparação", "Embalagem Térmica", "Em Trânsito", "Entregue"]
  },
  socios: {
    title: "Gestão de Sócios & Assinaturas",
    subtitle: "Base de membros VIP, planos ativos e histórico de preferências.",
    table: {
      headers: ["Sócio", "Plano Ativo", "Valor Mensal", "Próxima Cobrança", "Caixa do Mês", "Status", "Ações"]
    }
  },
  configuracoes: {
    title: "Configurações da Plataforma",
    subtitle: "Regras de negócio, integrações de pagamento e cadeia de frio."
  }
};
