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
    historico: "Histórico & Auditoria",
    lixeira: "Lixeira",
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
    statusPaused: "Pausado",
    statusAvailable: "Disponível",
    statusReserved: "Reservado",
    statusSoldOut: "Esgotado"
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
  cortes: {
    title: "Catálogo de Cortes Premium",
    subtitle: "Inventário de Wagyu A5, Dry-Aged, Picanha e cortes especiais de temporada",
    ctaAdd: "+ Novo Corte",
    tableHeaders: {
      name: "Corte",
      category: "Categoria",
      aging: "Maturação",
      stock: "Estoque (kg)",
      price: "Preço/kg",
      status: "Disponibilidade"
    }
  },
  caixas: {
    title: "Central de Expedição & Caixas Térmicas",
    subtitle: "Fila de embalagem a vácuo, controle de temperatura -2°C e códigos de rastreio",
    ctaBatchDispatch: "Iniciar Despacho em Lote",
    tableHeaders: {
      id: "Caixa #",
      customerName: "Assinante",
      planName: "Plano",
      status: "Status Envio",
      scheduledDate: "Data Agendada"
    }
  },
  socios: {
    title: "Gestão de Sócios Assinantes",
    subtitle: "Contratos ativos, histórico de cobranças e controle de retenção",
    tableHeaders: {
      customerName: "Cliente",
      planName: "Plano",
      priceMonthly: "Valor Mensal",
      status: "Status",
      joinedDate: "Data de Início"
    }
  },
  historico: {
    title: "Histórico & Auditoria do Sistema",
    subtitle: "Registro imutável de eventos de despacho, auditoria e alterações da plataforma.",
    tableHeaders: {
      event: "Evento",
      description: "Descrição",
      actor: "Autor",
      date: "Data"
    }
  },
  lixeira: {
    title: "Lixeira do Sistema",
    subtitle: "Itens removidos recentemente com retenção temporária de 30 dias para recuperação.",
    emptyText: "Nenhum item na lixeira.",
    tableHeaders: {
      title: "Item / Registro",
      type: "Tipo",
      deletedBy: "Removido por",
      deletedAt: "Data Remoção",
      retention: "Retenção"
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
