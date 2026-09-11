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
    colecoes: "Coleções",
    planos: "Planos de assinatura",
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
      colecoes: "Coleções",
      planos: "Planos de assinatura",
      clientes: "Clientes",
      assinaturas: "Assinaturas",
      pagamentos: "Pagamentos",
      usuarios: "Usuários",
      configuracoes: "Configurações"
    },
    navigationGroups: {
      principal: "Principal",
      club: "Clube",
      management: "Gestão",
      overview: "Visão geral",
      base: "Base do produto",
      commerce: "Comercial",
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
  accessShell: {
    close: "Fechar",
    tabs: {
      login: "Entrar",
      register: "Cadastrar"
    },
    flows: {
      login: {
        title: "Entrar no admin",
        description: "Use uma conta interna para acessar os dados reais do backend.",
        submit: "Entrar"
      },
      register: {
        title: "Cadastrar operador",
        description: "O cadastro de operadores e feito pela administracao do sistema.",
        submit: "Cadastrar"
      }
    },
    fields: {
      name: "Nome",
      email: "E-mail",
      password: "Senha"
    },
    placeholders: {
      name: "Nome do operador",
      email: "admin@royalprime.local",
      password: "Digite sua senha"
    },
    legal: "Acesso restrito a operadores autorizados."
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
    statusPaid: "Pago",
    statusFailed: "Falhou",
    statusRefunded: "Reembolsado",
    statusReceived: "Recebido",
    statusSeparating: "Separando",
    statusReady: "Pronto",
    statusCompleted: "Concluido",
    statusInactive: "Inativo",
    statusPacking: "Embalagem",
    statusPaused: "Pausado",
    statusPreparing: "Em preparação",
    statusDraft: "Rascunho",
    statusBlocked: "Bloqueado",
    statusArchived: "Arquivado",
    statusCancelled: "Cancelado",
    statusPastDue: "Pagamento pendente",
    statusReserved: "Reservado",
    statusSelected: "Selecionado",
    statusFulfilled: "Concluído",
    emptyValue: "-"
  },
  entities: {
    box: "Caixa térmica",
    category: "Categoria",
    collection: "Coleção",
    customer: "Cliente",
    cut: "Corte nobre",
    delivery: "Entrega",
    inventoryMovement: "Movimento de estoque",
    member: "Sócio",
    order: "Pedido comercial",
    payment: "Pagamento",
    plan: "Plano",
    product: "Produto",
    subscription: "Assinatura",
    subscriptionPlan: "Plano de assinatura",
    userCustomer: "Usuário / Cliente"
  },
  dashboard: {
    title: "Dashboard Operacional",
    subtitle: "Visão executiva de faturamento recorrente, assinantes e entregas",
    headerBadge: "Visão operacional",
    ctaBatchDispatch: "Iniciar despacho em lote",
    loading: "Atualizando indicadores",
    tableTitle: "Últimos pedidos em esteira",
    plansTableTitle: "Planos em operação",
    viewAllBoxes: "Ver todas as caixas",
    emptyRecentOrders: "Nenhum pedido recente encontrado.",
    emptyPlans: "Nenhum plano em operação encontrado.",
    panels: {
      revenue: {
        title: "Receita e pedidos",
        description: "Leitura comercial baseada nas assinaturas e pedidos cadastrados."
      },
      club: {
        title: "Saúde do Clube",
        description: "Acompanhamento da base ativa e dos contratos que exigem acompanhamento."
      },
      operation: {
        title: "Operação de entregas",
        description: "Fila atual de montagem, despacho e confirmação das caixas."
      }
    },
    metrics: {
      estimatedRecurringRevenue: "Receita recorrente estimada",
      ordersInPanel: "Pedidos cadastrados",
      activeSubscribers: "Assinantes ativos",
      pastDueSubscriptions: "Assinaturas pendentes",
      cancelledSubscriptions: "Assinaturas canceladas",
      deliveriesInQueue: "Caixas na fila",
      readyDeliveries: "Caixas prontas",
      outForDelivery: "Em rota"
    },
    attention: {
      title: "Atenção imediata",
      description: "Pendências reais que merecem uma ação da equipe agora.",
      actions: {
        viewSubscriptions: "Ver assinaturas",
        viewDeliveries: "Ver entregas",
        viewOrders: "Ver pedidos"
      },
      items: {
        pastDueSubscriptions: {
          title: "Cobranças pendentes",
          description: "Assinaturas marcadas pelo backend como pagamento pendente."
        },
        deliveries: {
          title: "Caixas em andamento",
          description: "Entregas que ainda não alcançaram um status terminal."
        },
        orders: {
          title: "Pedidos abertos",
          description: "Pedidos que permanecem em uma etapa operacional ativa."
        }
      }
    },
    kpis: {
      mrr: "Faturamento mensal",
      activeSubscribers: "Assinantes ativos",
      pendingDeliveries: "Caixas na fila",
      retentionRate: "Taxa de retenção"
    },
    kpiHelpers: {
      mrr: "{orders} pedidos no painel",
      activeSubscribers: "{total} assinaturas cadastradas",
      pendingDeliveries: "{total} caixas em operação",
      retentionRate: "Churn estimado de {churn}"
    },
    tableHeaders: {
      order: "Pedido",
      member: "Sócio",
      plan: "Plano",
      box: "Caixa",
      status: "Status",
      date: "Data"
    },
    planTableHeaders: {
      plan: "Plano",
      price: "Preço",
      recurrence: "Recorrência",
      items: "Itens inclusos",
      subscribers: "Assinantes ativos",
      status: "Status"
    },
    billingIntervals: {
      day: "Diário",
      week: "Semanal",
      month: "Mensal",
      year: "Anual"
    },
    planStatuses: {
      active: "Ativo",
      draft: "Rascunho",
      archived: "Arquivado"
    }
  },
  standard: {
    apiErrorStatus: "Status",
    apiErrorTitle: "Nao foi possivel carregar os dados reais do backend.",
    apiErrorUnknown: "Erro sem status HTTP.",
    loading: "Atualizando",
    loadingRows: "Atualizando registros...",
    saving: "Salvando"
  },
  pedidos: {
    title: "Pedidos",
    subtitle: "Acompanhamento de pedidos comerciais, assinatura, separação e status operacional.",
    ctaAdd: "Novo pedido",
    searchPlaceholder: "Buscar pedidos...",
    tableHeaders: {
      code: "Código",
      customerName: "Cliente",
      kindLabel: "Tipo de pedido",
      recurrence: "Assinatura / ciclo",
      deliveryStatus: "Entrega",
      paymentStatus: "Pagamento",
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
    },
    fields: {
      address: "Endereco",
      code: "Codigo do pedido",
      createdAt: "Criado em",
      customer: "Cliente",
      deliveries: "Entregas",
      history: "Historico",
      items: "Itens",
      kind: "Tipo de pedido",
      notes: "Observacoes",
      payments: "Pagamentos",
      recurrence: "Assinatura / ciclo",
      status: "Status",
      subscription: "Assinatura",
      subscriptionCycle: "Ciclo de assinatura",
      subscriptionCycleStatus: "Status do ciclo",
      total: "Total"
    },
    detail: {
      title: "Detalhe do pedido",
      tabs: {
        data: "Dados",
        delivery: "Entrega",
        history: "Historico",
        items: "Itens",
        payment: "Pagamento",
        subscription: "Assinatura"
      },
      emptyData: "Nenhum dado cadastrado para este pedido.",
      emptyDelivery: "Nenhuma entrega vinculada a este pedido.",
      emptyHistory: "Nenhum historico cadastrado para este pedido.",
      emptyItems: "Nenhum item cadastrado para este pedido.",
      emptyPayment: "Nenhum pagamento vinculado a este pedido.",
      emptySubscription: "Pedido sem assinatura ou ciclo vinculado."
    },
    add: {
      title: "Cadastrar pedido",
      submit: "Cadastrar",
      sections: {
        data: "Dados",
        items: "Itens"
      }
    },
    items: {
      add: "Adicionar item",
      name: "Item",
      product: "Produto",
      quantity: "Quantidade",
      source: "Origem",
      sourceKey: "Chave da origem",
      unit: "Unidade",
      variant: "Variante"
    },
    history: {
      createdAt: "Data",
      from: "De",
      note: "Nota",
      to: "Para"
    },
    deliveries: {
      address: "Endereco",
      code: "Entrega",
      confirmationCode: "Confirmacao",
      notes: "Observacoes",
      status: "Status"
    },
    payments: {
      amount: "Valor",
      dueAt: "Vencimento",
      paidAt: "Pago em",
      reference: "Referencia",
      status: "Status"
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
    searchPlaceholder: "Buscar produtos...",
    tableHeaders: {
      name: "Produto",
      key: "Chave",
      category: "Categoria",
      collection: "Coleção",
      unit: "Unidade",
      price: "Preço",
      variants: "Variantes",
      commercialModes: "Canais",
      status: "Status"
    },
    filters: {
      status: "Status"
    },
    fields: {
      name: "Produto",
      key: "Chave",
      description: "Descrição",
      unit: "Unidade",
      status: "Status",
      categories: "Categorias",
      categoryKeys: "Categorias por chave",
      collections: "Coleções",
      collectionKeys: "Coleções por chave",
      commercialModes: "Canais comerciais",
      commercialModeKeys: "Canais por chave",
      variantCount: "Quantidade de variantes",
      price: "Preço base",
      priceCents: "Preço",
      primaryImage: "Imagem principal"
    },
    detail: {
      title: "Detalhe do produto",
      tabs: {
        data: "Dados",
        collections: "Coleções",
        variants: "Variantes",
        prices: "Preços",
        media: "Mídia"
      },
      sections: {
        identity: "Identificação",
        catalog: "Catálogo",
        variants: "Variantes"
      },
      emptyData: "Nenhum dado cadastrado para este produto.",
      emptyCollections: "Nenhuma coleção vinculada a este produto.",
      emptyVariants: "Nenhuma variante cadastrada para este produto.",
      emptyPrices: "Nenhum preço cadastrado para este produto.",
      emptyMedia: "Nenhuma mídia cadastrada para este produto."
    },
    add: {
      title: "Cadastrar produto",
      submit: "Cadastrar",
      sections: {
        identity: "Identificação",
        commercial: "Comercial",
        media: "Mídia"
      }
    }
  },
  categorias: {
    title: "Categorias",
    subtitle: "Estrutura comercial para organizar produtos, cortes, combos e linhas do catálogo.",
    ctaAdd: "Nova categoria",
    searchPlaceholder: "Buscar categorias...",
    tableHeaders: {
      name: "Nome",
      key: "Chave",
      parent: "Categoria pai",
      sortOrder: "Ordem",
      status: "Status"
    },
    filters: {
      status: "Status"
    },
    fields: {
      name: "Nome",
      key: "Chave",
      parent: "Categoria pai",
      sortOrder: "Ordem",
      status: "Status"
    },
    detail: {
      title: "Detalhe da categoria",
      tabs: {
        data: "Dados"
      },
      emptyData: "Nenhum dado cadastrado para esta categoria."
    },
    add: {
      title: "Cadastrar categoria",
      submit: "Cadastrar",
      helpers: {
        parent: "Obs: deixar vazio a torna categoria pai."
      },
      sections: {
        data: "Dados"
      }
    }
  },
  colecoes: {
    title: "Coleções",
    subtitle: "Agrupamentos comerciais para vitrines, combos, campanhas e ofertas do catálogo.",
    searchPlaceholder: "Buscar coleções...",
    tableHeaders: {
      name: "Coleção",
      key: "Chave",
      productCount: "Produtos",
      sortOrder: "Ordem",
      status: "Status"
    },
    filters: {
      status: "Status"
    },
    fields: {
      name: "Coleção",
      key: "Chave",
      image: "Imagem",
      description: "Descrição",
      productCount: "Produtos vinculados",
      sortOrder: "Ordem",
      status: "Status"
    },
    detail: {
      title: "Detalhe da coleção",
      tabs: {
        data: "Dados"
      },
      emptyData: "Nenhum dado cadastrado para esta coleção."
    }
  },
  planos: {
    title: "Planos de assinatura",
    subtitle: "Configuração dos planos vendidos: preço, limites de produtos e disponibilidade.",
    ctaAdd: "Novo plano",
    searchPlaceholder: "Buscar planos...",
    tableHeaders: {
      name: "Plano",
      price: "Preco",
      billingInterval: "Recorrencia",
      entitlements: "Itens inclusos",
      includedItems: "Itens inclusos",
      activeSubscribers: "Assinantes ativos",
      status: "Status",
      subtitle: "Descrição",
      protein: "Proteínas",
      charcoal: "Carvão",
      monthlyPrice: "Preço mensal",
      annualPrice: "Preço anual"
    },
    filters: {
      status: "Status"
    },
    filterOptions: {
      basic: "Basic",
      premium: "Premium",
      pro: "Pro"
    },
    fields: {
      billingInterval: "Recorrencia",
      description: "Descricao",
      entitlementCount: "Itens inclusos",
      entitlementSummary: "Produtos, quantidades e unidades",
      includedItems: "Itens inclusos",
      includedItemCount: "Itens inclusos",
      includedItemSummary: "Produtos, quantidades e unidades",
      addIncludedItem: "Adicionar item incluso",
      includedItemType: "Tipo",
      includedItemTarget: "Item",
      limit: "Limite",
      product: "Produto",
      quantity: "Quantidade",
      unit: "Unidade",
      variant: "Variante",
      subscriberCount: "Assinantes",
      activeSubscriberCount: "Assinantes ativos",
      subscriberSummary: "Clientes vinculados",
      key: "Chave",
      price: "Preco",
      name: "Nome do plano",
      sortOrder: "Ordem",
      status: "Status",
      trialDays: "Dias de teste"
    },
    form: {
      billingInterval: "Recorrência",
      description: "Descrição",
      entitlementCount: "Benefícios",
      key: "Chave",
      priceCents: "Preço",
      annualMonthlyPrice: "Preço anual",
      monthlyPrice: "Preço mensal",
      name: "Nome do plano",
      subtitle: "Descrição"
    },
    detail: {
      title: "Detalhe do plano",
      sections: {
        identity: "Identificacao",
        commercial: "Comercial"
      },
      tabs: {
        data: "Dados",
        entitlements: "Itens inclusos",
        includedItems: "Itens inclusos",
        subscribers: "Assinantes",
        prices: "Preços"
      },
      emptyData: "Nenhum dado cadastrado para este plano.",
      emptyEntitlements: "Nenhum item incluso cadastrado para este plano.",
      emptyIncludedItems: "Nenhum item incluso cadastrado para este plano.",
      emptySubscribers: "Nenhum assinante vinculado a este plano.",
      emptyPrices: "Nenhum preço cadastrado para este plano."
    },
    subscribers: {
      customer: "Cliente",
      status: "Status",
      startedAt: "Início",
      currentCycleEndsAt: "Fecha em",
      currentCycleOrders: "Pedidos do ciclo",
      currentCycleUsage: "Consumo do ciclo"
    },
    add: {
      title: "Cadastrar plano",
      submit: "Cadastrar",
      sections: {
        identity: "Identificacao",
        commercial: "Comercial",
        includedItems: "Itens inclusos"
      }
    },
    billingIntervals: {
      day: "Diário",
      week: "Semanal",
      month: "Mensal",
      year: "Anual"
    }
  },
  clientes: {
    title: "Clientes",
    subtitle: "Base de clientes, contatos, endereços e histórico operacional.",
    ctaAdd: "Novo cliente",
    searchPlaceholder: "Buscar clientes...",
    tableHeaders: {
      name: "Cliente",
      email: "E-mail",
      phone: "Telefone",
      status: "Status",
      addressCount: "Endereços"
    },
    filters: {
      status: "Status"
    },
    fields: {
      name: "Nome",
      email: "E-mail",
      phone: "Telefone",
      document: "CPF/CNPJ",
      status: "Status",
      memberSince: "Cliente desde",
      defaultAddress: "Endereço principal",
      addressCount: "Endereços cadastrados",
      createdAt: "Criado em",
      updatedAt: "Atualizado em"
    },
    detail: {
      title: "Detalhe do cliente",
      tabs: {
        data: "Dados",
        addresses: "Endereços",
        history: "Histórico"
      },
      emptyData: "Nenhum dado cadastrado para este cliente.",
      emptyAddresses: "Nenhum endereço cadastrado para este cliente.",
      emptyHistory: "Nenhum histórico disponível para este cliente."
    },
    add: {
      title: "Cadastrar cliente",
      submit: "Cadastrar",
      sections: {
        identity: "Identificação",
        contact: "Contato"
      }
    }
  },
  assinaturas: {
    title: "Assinaturas",
    subtitle: "Vínculo operacional entre clientes, planos, ciclos, boxes e pedidos.",
    ctaAdd: "Nova assinatura",
    searchPlaceholder: "Buscar assinaturas...",
    tableHeaders: {
      customer: "Cliente",
      plan: "Plano",
      status: "Status",
      currentCycle: "Ciclo",
      startedAt: "Início",
      currentCycleEndsAt: "Fecha em",
      currentCycleOrders: "Pedidos do ciclo",
      currentCycleUsage: "Consumo do ciclo"
    },
    filters: {
      status: "Status"
    },
    fields: {
      cancelReason: "Motivo do cancelamento",
      cancelledAt: "Cancelada em",
      currentCycleConsumed: "Consumido",
      currentCycleEndsAt: "Fechamento do ciclo",
      currentCycleItems: "Produtos escolhidos",
      currentCycleUsageItems: "Uso por item",
      currentCycleLimit: "Limite contratado",
      currentCycleOrders: "Pedidos/boxes",
      currentCycleRemaining: "Saldo restante",
      currentCycleStartsAt: "Início do ciclo atual",
      customer: "Cliente",
      defaultDeliveryAddress: "Endereço padrão",
      deliveryPreferences: "Preferências e restrições",
      deliveryWindow: "Janela de entrega",
      endedAt: "Encerrada em",
      internalNotes: "Observações internas",
      orders: "Pedidos do ciclo",
      payments: "Pagamentos",
      plan: "Plano",
      preferredDeliveryDay: "Dia preferido de entrega",
      startedAt: "Início da assinatura",
      status: "Status"
    },
    detail: {
      title: "Detalhe da assinatura",
      tabs: {
        data: "Dados",
        delivery: "Entrega",
        operation: "Operação",
        currentCycle: "Ciclo atual",
        orders: "Pedidos do ciclo",
        payments: "Pagamentos"
      },
      emptyData: "Nenhum dado cadastrado para esta assinatura.",
      emptyDelivery: "Nenhum dado de entrega cadastrado para esta assinatura.",
      emptyOperation: "Nenhum dado operacional cadastrado para esta assinatura.",
      emptyCurrentCycle: "Nenhum produto selecionado neste ciclo.",
      emptyOrders: "Nenhum pedido vinculado ao ciclo desta assinatura.",
      emptyPayments: "Nenhum pagamento vinculado a esta assinatura."
    },
    currentCycle: {
      item: "Item",
      product: "Produto",
      quantity: "Quantidade",
      remaining: "Saldo",
      selectedItems: "Escolhidos",
      usedWithLimit: "Usado / limite",
      status: "Status"
    },
    orders: {
      code: "Pedido",
      createdAt: "Data",
      status: "Status",
      total: "Total"
    },
    payments: {
      amount: "Valor",
      dueAt: "Vencimento",
      reference: "Referência",
      status: "Status"
    },
    deliveryDays: {
      monday: "Segunda-feira",
      tuesday: "Terça-feira",
      wednesday: "Quarta-feira",
      thursday: "Quinta-feira",
      friday: "Sexta-feira",
      saturday: "Sábado"
    },
    deliveryWindows: {
      morning: "Manhã",
      afternoon: "Tarde",
      evening: "Noite",
      businessHours: "Horário comercial"
    },
    add: {
      title: "Cadastrar assinatura",
      submit: "Cadastrar",
      sections: {
        data: "Dados",
        delivery: "Entrega"
      }
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
    ctaAdd: "Novo pagamento",
    searchPlaceholder: "Buscar pagamentos...",
    tableHeaders: {
      amount: "Valor",
      customer: "Cliente",
      dueAt: "Vencimento",
      origin: "Origem",
      reference: "Referência",
      relation: "Vinculo",
      status: "Status"
    },
    filters: {
      origin: "Origem",
      status: "Status"
    },
    fields: {
      amount: "Valor",
      customer: "Cliente",
      dueAt: "Vencimento",
      history: "Historico",
      notes: "Observações",
      order: "Pedido",
      origin: "Origem",
      paidAt: "Pago em",
      reference: "Referência",
      relation: "Vinculo",
      status: "Status",
      subscription: "Assinatura",
      subscriptionPlan: "Plano da assinatura"
    },
    origins: {
      manual: "Manual",
      order: "Pedido avulso",
      subscription: "Assinatura",
      subscriptionOrder: "Pedido de assinatura"
    },
    detail: {
      title: "Detalhe do pagamento",
      tabs: {
        data: "Dados",
        history: "Historico",
        order: "Pedido",
        subscription: "Assinatura",
        values: "Valores"
      },
      emptyData: "Nenhum dado cadastrado para este pagamento.",
      emptyHistory: "Nenhum evento cadastrado para este pagamento.",
      emptyOrder: "Nenhum pedido vinculado a este pagamento.",
      emptySubscription: "Nenhuma assinatura vinculada a este pagamento.",
      emptyValues: "Nenhum valor cadastrado para este pagamento."
    },
    orders: {
      code: "Pedido",
      createdAt: "Criado em",
      status: "Status",
      total: "Total"
    },
    subscriptions: {
      cycle: "Ciclo",
      cycleStatus: "Status do ciclo",
      cycleWindow: "Janela do ciclo",
      plan: "Plano",
      status: "Status"
    },
    events: {
      created: "Criado",
      date: "Data",
      event: "Evento",
      status: "Status",
      updated: "Atualizado"
    },
    add: {
      title: "Cadastrar pagamento",
      submit: "Cadastrar",
      sections: {
        data: "Dados"
      }
    }
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
    subtitle: "Manifesto operacional da aplicação, identidade, AppShell e parâmetros globais.",
    sectionOperation: "Parâmetros de operação",
    actions: {
      previewManifest: "Prévia do manifest",
      saveDraft: "Salvar rascunho"
    },
    badges: {
      manifestReady: "Manifest"
    },
    tabs: {
      appShell: "AppShell",
      commerce: "Comercial",
      identity: "Identidade",
      operation: "Operação"
    },
    sections: {
      brand: "Identidade da aplicação",
      brandDescription: "Valores que nomeiam o produto e alimentam AppShell, títulos e superfícies publicadas.",
      fulfillment: "Operação e entrega",
      fulfillmentDescription: "Parâmetros globais para expedição, cadeia de frio e janela padrão.",
      navigation: "Navegação do admin",
      navigationDescription: "Configuração declarativa da casca administrativa e das rotas visíveis.",
      payments: "Comercial e cobrança",
      paymentsDescription: "Parâmetros globais de moeda, provedor financeiro e ciclo de cobrança."
    },
    fields: {
      adminTagline: "Subtítulo do admin",
      adminTitle: "Título do admin",
      appName: "Nome da aplicação",
      billingCyclePolicy: "Política de ciclo",
      businessName: "Nome comercial",
      coldChainSensor: "Cadeia de frio",
      currency: "Moeda",
      defaultDeliveryWindow: "Janela padrão",
      fulfillmentWarehouse: "Centro de expedição",
      hiddenRoutes: "Rotas ocultas",
      mobileNavigation: "Navegação mobile",
      paymentProvider: "Provedor de pagamento",
      sidebarMode: "Sidebar"
    },
    status: {
      active: "Ativo",
      connected: "Conectado",
      monitoring: "Monitorando",
      pendingManifestSync: "Pendente",
      review: "Revisar"
    },
    values: {
      businessHours: "Horário comercial",
      hiddenRoutes: "Usuários e Configurações podem sair do menu principal",
      mobileBottomTabs: "Bottom tabs operacionais",
      monthlyCycle: "Ciclo mensal por assinatura",
      sidebarOperational: "Menu operacional por domínio"
    },
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
    assetChooseFile: "Selecionar imagem",
    assetDropzone: "Arraste uma imagem ou selecione um arquivo.",
    assetRemove: "Remover imagem",
    assetUrlPlaceholder: "Cole a URL da imagem",
    addLineItem: "Adicionar item",
    closeConfirmation: "Fechar confirmação",
    confirmRemoveAction: "Remover",
    confirmRemoveImageDescription: "Esta imagem sairá do cadastro quando você salvar.",
    confirmRemoveImageTitle: "Remover imagem?",
    confirmRemoveSelectedOptionDescription: "Tem certeza que deseja remover {option}?",
    confirmRemoveSelectedOptionTitle: "Remover item?",
    removeSelectedOption: "Remover {option}",
    emptyLineItems: "Nenhum item adicionado.",
    removeLineItem: "Remover item",
    selectOption: "Selecione uma opção...",
    typePlaceholder: "Digite",
    typePlaceholderFor: "Digite {field}"
  }
};
