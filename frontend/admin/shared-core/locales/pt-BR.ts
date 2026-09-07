export const adminPtBR = {
  brand: {
    name: "PRIME CUT ADMIN",
    tagline: "Painel de Gestão e Operação do Clube"
  },
  navigation: {
    dashboard: "Dashboard",
    pedidos: "Pedidos",
    deliveries: "Entregas",
    estoque: "Estoque",
    produtos: "Produtos",
    categorias: "Categorias",
    planos: "Planos",
    clientes: "Clientes",
    assinaturas: "Assinaturas",
    pagamentos: "Pagamentos",
    usuarios: "Usuários",
    configuracoes: "Configurações"
  },
  appShell: {
    closeDrawerAriaLabel: "Fechar navegação",
    collapseSidebar: "Recolher menu",
    openDrawerAriaLabel: "Abrir navegação",
    searchPlaceholder: "Buscar registros",
    navigation: {
      dashboard: "Dashboard",
      pedidos: "Pedidos",
      deliveries: "Entregas",
      estoque: "Estoque",
      produtos: "Produtos",
      categorias: "Categorias",
      planos: "Planos",
      clientes: "Clientes",
      assinaturas: "Assinaturas",
      pagamentos: "Pagamentos",
      usuarios: "Usuários",
      configuracoes: "Configurações"
    },
    navigationGroups: {
      overview: "Visão geral",
      operations: "Operação",
      catalog: "Catálogo",
      customers: "Clientes",
      system: "Sistema"
    }
  },
  auth: {
    title: "Entrar no admin",
    subtitle: "Use uma conta interna para acessar os dados reais do backend.",
    emailLabel: "E-mail",
    passwordLabel: "Senha",
    emailPlaceholder: "admin@royalprime.local",
    passwordPlaceholder: "Digite sua senha",
    submit: "Entrar",
    loading: "Entrando",
    invalid: "Nao foi possivel entrar. Confira as credenciais.",
    seedHint: "Acesso local seedado: admin@royalprime.local"
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
    status: "Status",
    statusActive: "Ativo",
    statusApproved: "Aprovado",
    statusDelivered: "Entregue",
    statusOutForDelivery: "Saiu para entrega",
    statusPending: "Pendente",
    statusPacking: "Embalagem",
    statusPaused: "Pausado",
    statusPreparing: "Em preparação"
  },
  entities: {
    box: "Caixa térmica",
    category: "Categoria",
    customer: "Cliente",
    cut: "Corte nobre",
    delivery: "Entrega",
    inventoryMovement: "Movimento de estoque",
    member: "Sócio",
    order: "Pedido comercial",
    payment: "Pagamento",
    plan: "Plano",
    product: "Produto",
    subscriptionPlan: "Plano de assinatura",
    userCustomer: "Usuário / Cliente"
  },
  dashboard: {
    title: "Dashboard Operacional",
    subtitle: "Visão executiva de faturamento recorrente, assinantes e entregas",
    ctaBatchDispatch: "Iniciar despacho em lote",
    loading: "Atualizando indicadores",
    tableTitle: "Últimos pedidos em esteira",
    viewAllBoxes: "Ver todas as caixas",
    emptyRecentOrders: "Nenhum pedido recente encontrado.",
    kpis: {
      mrr: "Faturamento mensal",
      activeSubscribers: "Assinantes ativos",
      pendingDeliveries: "Caixas na fila",
      retentionRate: "Taxa de retenção"
    },
    kpiHelpers: {
      mrr: "{orders} pedidos no painel",
      activeSubscribers: "{total} assinaturas cadastradas",
      pendingDeliveries: "{total} entregas em acompanhamento",
      retentionRate: "Churn estimado de {churn}"
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
  standard: {
    loading: "Atualizando",
    loadingRows: "Atualizando registros..."
  },
  pedidos: {
    title: "Pedidos",
    subtitle: "Acompanhamento de pedidos comerciais, assinatura, separação e status operacional.",
    ctaAdd: "Novo pedido",
    tableHeaders: {
      code: "Código",
      customerName: "Cliente",
      kindLabel: "Tipo de pedido",
      summary: "Resumo dos itens",
      total: "Valor total",
      status: "Status",
      createdAt: "Data do pedido"
    },
    form: {
      code: "Código do pedido",
      customerName: "Cliente",
      summary: "Resumo dos itens",
      totalFormatted: "Total"
    }
  },
  deliveries: {
    title: "Entregas",
    subtitle: "Fila de embalagem, expedição, rota e confirmação de entrega.",
    ctaBatchDispatch: "Iniciar despacho em lote",
    tableHeaders: {
      id: "Caixa",
      customerName: "Assinante",
      planName: "Plano",
      status: "Status de envio",
      scheduledDate: "Data agendada"
    },
    filters: {
      status: "Status de envio"
    },
    form: {
      address: "Endereço de entrega",
      customerName: "Assinante",
      planName: "Plano",
      scheduledDate: "Data agendada"
    }
  },
  estoque: {
    title: "Estoque",
    subtitle: "Movimentos, saldos e ajustes de disponibilidade operacional.",
    ctaAdd: "Novo movimento"
  },
  produtos: {
    title: "Produtos",
    subtitle: "Gestão de catálogo, disponibilidade, preço e dados comerciais dos itens.",
    ctaAdd: "Novo produto",
    tableHeaders: {
      name: "Produto",
      category: "Categoria",
      aging: "Maturação",
      line: "Linha / Categoria",
      origin: "Origem",
      preparation: "Preparo",
      stock: "Estoque",
      weight: "Peso / unidade",
      price: "Preço",
      status: "Disponibilidade"
    },
    filters: {
      line: "Linha"
    },
    filterOptions: {
      dailyCuts: "Cortes do dia a dia",
      nobleLine: "Linha nobre",
      premiumCuts: "Cortes premium",
      royalCombos: "Combos Royal"
    },
    form: {
      line: "Linha",
      name: "Nome do produto",
      price: "Preço",
      weight: "Peso / unidade"
    }
  },
  categorias: {
    title: "Categorias",
    subtitle: "Estrutura comercial para organizar produtos, cortes, combos e linhas do catálogo.",
    ctaAdd: "Nova categoria"
  },
  planos: {
    title: "Planos",
    subtitle: "Configuração dos planos vendidos: preço, limites, benefícios e disponibilidade.",
    ctaAdd: "Novo plano",
    tableHeaders: {
      name: "Plano",
      subtitle: "Descrição",
      protein: "Proteínas",
      charcoal: "Carvão",
      monthlyPrice: "Preço mensal",
      annualPrice: "Preço anual"
    },
    filters: {
      planType: "Tipo de plano"
    },
    filterOptions: {
      basic: "Basic",
      premium: "Premium",
      pro: "Pro"
    },
    form: {
      annualMonthlyPrice: "Preço anual",
      monthlyPrice: "Preço mensal",
      name: "Nome do plano",
      subtitle: "Descrição"
    }
  },
  clientes: {
    title: "Clientes",
    subtitle: "Base de clientes, contatos, endereços e histórico operacional.",
    ctaAdd: "Novo cliente"
  },
  assinaturas: {
    title: "Assinaturas",
    subtitle: "Assinaturas ativas, ciclos, pausas, cancelamentos e vínculo com planos.",
    ctaAdd: "Nova assinatura",
    tableHeaders: {
      name: "Plano",
      subtitle: "Descrição",
      protein: "Proteínas",
      charcoal: "Carvão",
      monthlyPrice: "Preço mensal",
      annualPrice: "Preço anual"
    },
    filters: {
      planType: "Tipo de plano"
    },
    filterOptions: {
      basic: "Basic",
      premium: "Premium",
      pro: "Pro"
    },
    form: {
      annualMonthlyPrice: "Preço anual",
      monthlyPrice: "Preço mensal",
      name: "Nome do plano",
      subtitle: "Descrição"
    }
  },
  caixas: {
    title: "Caixas",
    subtitle: "Caixas térmicas em montagem, expedição e entrega.",
    ctaBatchDispatch: "Iniciar despacho em lote",
    tableHeaders: {
      id: "Caixa",
      customerName: "Assinante",
      planName: "Plano",
      status: "Status de envio",
      scheduledDate: "Data agendada"
    }
  },
  cortes: {
    title: "Cortes",
    subtitle: "Cortes nobres, maturação, estoque e disponibilidade.",
    ctaAdd: "Novo corte",
    tableHeaders: {
      aging: "Maturação",
      category: "Categoria",
      name: "Corte",
      status: "Status",
      stock: "Estoque"
    }
  },
  pagamentos: {
    title: "Pagamentos",
    subtitle: "Status de cobranças, falhas, reembolsos e recorrência financeira.",
    ctaAdd: "Novo pagamento"
  },
  usuarios: {
    title: "Usuários",
    subtitle: "Acessos internos, permissões e operadores do painel administrativo.",
    ctaAdd: "Novo usuário",
    tableHeaders: {
      customerName: "Cliente",
      email: "E-mail",
      phone: "Telefone",
      planName: "Plano ativo",
      priceMonthly: "Valor mensal",
      status: "Status",
      joinedDate: "Membro desde"
    },
    form: {
      activePlan: "Plano ativo",
      email: "E-mail de contato",
      name: "Nome do cliente",
      phone: "Telefone"
    }
  },
  socios: {
    title: "Sócios",
    subtitle: "Sócios do clube, planos ativos e valores recorrentes.",
    ctaAdd: "Novo sócio",
    tableHeaders: {
      customerName: "Cliente",
      joinedDate: "Membro desde",
      planName: "Plano ativo",
      priceMonthly: "Valor mensal",
      status: "Status"
    },
    filters: {
      status: "Status do contrato"
    },
    form: {
      customerName: "Nome do cliente",
      email: "E-mail de contato",
      planName: "Plano assinado",
      priceMonthly: "Valor mensal"
    }
  },
  configuracoes: {
    title: "Configurações gerais",
    subtitle: "Parâmetros operacionais do clube, integrações de pagamento e cadeia de frio.",
    sectionOperation: "Parâmetros de operação",
    cards: {
      brand: "Marca global",
      recurrency: "Recorrência",
      coldChain: "Cadeia de frio",
      warehouse: "Expedição central"
    }
  },
  historico: {
    title: "Histórico",
    subtitle: "Auditoria de eventos relevantes do painel administrativo.",
    tableHeaders: {
      event: "Evento",
      description: "Descrição",
      actor: "Responsável",
      date: "Data"
    }
  },
  lixeira: {
    title: "Lixeira",
    subtitle: "Registros removidos e retenção operacional.",
    emptyText: "Nenhum registro removido.",
    tableHeaders: {
      title: "Registro",
      type: "Tipo",
      deletedBy: "Removido por",
      deletedAt: "Removido em",
      retention: "Retenção"
    }
  },
  details: {
    badgeTitle: "Detalhes do registro",
    tabs: {
      summary: "Resumo",
      specs: "Especificações e ficha",
      history: "Histórico de alterações"
    },
    emptySummary: "Nenhum atributo adicional a exibir.",
    specsContent: "Ficha técnica avançada e especificações do fornecedor cadastradas no sistema.",
    historyContent: "Histórico imutável de alterações realizadas neste registro."
  },
  forms: {
    addTitle: "Cadastrar",
    selectOption: "Selecione uma opção...",
    typePlaceholder: "Digite",
    typePlaceholderFor: "Digite {field}"
  }
};
