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
    statusInactive: "Inativo",
    statusPacking: "Embalagem",
    statusPaused: "Pausado",
    statusPreparing: "Em preparação",
    statusDraft: "Rascunho",
    statusBlocked: "Bloqueado",
    statusArchived: "Arquivado"
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
    loadingRows: "Atualizando registros...",
    saving: "Salvando"
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
    subtitle: "Configuração dos planos vendidos: preço, limites, benefícios e disponibilidade.",
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
      includedItemCount: "Itens inclusos",
      includedItemSummary: "Produtos, quantidades e unidades",
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
    add: {
      title: "Cadastrar plano",
      submit: "Cadastrar",
      sections: {
        identity: "Identificacao",
        commercial: "Comercial"
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
    filters: {},
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
    assetChooseFile: "Selecionar imagem",
    assetDropzone: "Arraste uma imagem ou selecione um arquivo.",
    assetRemove: "Remover imagem",
    assetUrlPlaceholder: "Cole a URL da imagem",
    closeConfirmation: "Fechar confirmação",
    confirmRemoveAction: "Remover",
    confirmRemoveImageDescription: "Esta imagem sairá do cadastro quando você salvar.",
    confirmRemoveImageTitle: "Remover imagem?",
    confirmRemoveSelectedOptionDescription: "Tem certeza que deseja remover {option}?",
    confirmRemoveSelectedOptionTitle: "Remover item?",
    removeSelectedOption: "Remover {option}",
    selectOption: "Selecione uma opção...",
    typePlaceholder: "Digite",
    typePlaceholderFor: "Digite {field}"
  }
};
