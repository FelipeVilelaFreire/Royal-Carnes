export const adminPtBR = {
  brand: {
    name: "PRIME CUT ADMIN",
    tagline: "Painel de Gestão & Operação do Clube"
  },
  navigation: {
    dashboard: "Dashboard",
    produtos: "Produtos",
    usuarios: "Usuários",
    assinaturas: "Assinaturas",
    pedidos: "Pedidos",
    deliveries: "Deliveries",
    configuracoes: "Configurações"
  },
  common: {
    back: "Voltar",
    cancel: "Cancelar",
    save: "Salvar",
    edit: "Editar",
    delete: "Excluir",
    restore: "Restaurar",
    actions: "Ações",
    searchPlaceholder: "Buscar registros...",
    allFilter: "Todos",
    showing: "Exibindo",
    of: "de",
    records: "registros",
    emptyState: "Nenhum registro encontrado.",
    statusActive: "Ativo",
    statusPending: "Pendente",
    statusPacking: "Embalagem",
    statusPaused: "Pausado"
  },
  dashboard: {
    title: "Dashboard Operacional",
    subtitle: "Visão executiva de faturamento recorrente (MRR), assinantes e entregas",
    ctaBatchDispatch: "Iniciar Despacho em Lote",
    tableTitle: "Últimos Pedidos em Esteira",
    viewAllBoxes: "Ver todas as caixas",
    kpis: {
      mrr: "Faturamento Mensal (MRR)",
      activeSubscribers: "Assinantes Ativos",
      pendingDeliveries: "Caixas na Fila",
      retentionRate: "Taxa de Retenção"
    },
    tableHeaders: {
      order: "Pedido",
      member: "Sócio",
      plan: "Plano",
      box: "Caixa",
      status: "Status",
      date: "Data"
    }
  },
  produtos: {
    title: "Catálogo de Produtos Nobres",
    subtitle: "Gestão de inventário, maturação e disponibilidade do e-commerce.",
    ctaAdd: "+ Novo Produto",
    tableHeaders: {
      name: "Produto",
      category: "Categoria",
      aging: "Maturação",
      stock: "Estoque (kg)",
      price: "Preço",
      status: "Disponibilidade"
    }
  },
  usuarios: {
    title: "Gestão de Usuários & Clientes",
    subtitle: "Cadastro base de clientes e membros ativos da plataforma.",
    ctaAdd: "+ Novo Usuário",
    tableHeaders: {
      customerName: "Cliente",
      email: "E-mail",
      planName: "Plano Ativo",
      priceMonthly: "Valor Mensal",
      status: "Status",
      joinedDate: "Membro Desde"
    }
  },
  assinaturas: {
    title: "Planos de Assinatura Royal Box",
    subtitle: "Catálogo oficial de planos do clube (Basic, Premium e Pro), limites de proteína, carvão e valores.",
    ctaAdd: "+ Novo Plano",
    tableHeaders: {
      name: "Plano",
      subtitle: "Descrição / Inclusões",
      protein: "Proteínas",
      charcoal: "Carvão",
      monthlyPrice: "Preço Mensal",
      annualPrice: "Preço Anual"
    }
  },
  pedidos: {
    title: "Gestão de Pedidos Comerciais",
    subtitle: "Acompanhamento de pedidos comerciais (#RD-8492, #RS-2026-09A/B) e histórico de compras.",
    ctaAdd: "+ Novo Pedido",
    tableHeaders: {
      code: "Código #",
      customerName: "Cliente",
      kindLabel: "Tipo de Pedido",
      summary: "Resumo dos Itens",
      total: "Valor Total",
      status: "Status",
      createdAt: "Data do Pedido"
    }
  },
  deliveries: {
    title: "Esteira de Deliveries & Expedição Logística",
    subtitle: "Fila de embalagem a vácuo, controle de temperatura -2°C e expedição de caixas físicas.",
    ctaBatchDispatch: "Iniciar Despacho em Lote",
    tableHeaders: {
      id: "Caixa #",
      customerName: "Assinante",
      planName: "Plano",
      status: "Status Envio",
      scheduledDate: "Data Agendada"
    }
  },
  configuracoes: {
    title: "Configurações Gerais",
    subtitle: "Parâmetros operacionais do clube, integrações de pagamento e cadeia de frio.",
    sectionOperation: "Parâmetros de Operação",
    cards: {
      brand: "Marca Global",
      recurrency: "Recorrência",
      coldChain: "Cadeia de Frio",
      warehouse: "Expedição Central"
    }
  },
  details: {
    badgeTitle: "DETALHES DO REGISTRO",
    tabs: {
      summary: "Resumo",
      specs: "Especificações & Ficha",
      history: "Histórico de Alterações"
    },
    specsContent: "Ficha técnica avançada e especificações do fornecedor cadastradas no sistema.",
    historyContent: "Histórico imutável de alterações realizadas neste registro."
  },
  forms: {
    addTitle: "Cadastrar",
    selectOption: "Selecione uma opção...",
    typePlaceholder: "Digite"
  }
};
