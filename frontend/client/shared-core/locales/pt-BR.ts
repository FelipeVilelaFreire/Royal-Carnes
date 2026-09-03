export const clientPtBR = {
  brand: {
    name: "ROYAL PRIME",
    tagline: "Excellence in every ember. A curadoria definitiva para os apaixonados por fogo e carne."
  },
  navigation: {
    home: "Home",
    cortes: "Cortes",
    catalogo: "Catálogo",
    produtos: "Montar Box",
    royalBox: "Royal Box",
    royalDelivery: "Royal Delivery",
    meusPedidos: "Meus Pedidos",
    minhaConta: "Minha Conta",
    carrinho: "Carrinho",
    entrar: "Entrar",
    sair: "Sair"
  },
  appShell: {
    closeDrawerAriaLabel: "Fechar navegacao",
    collapseSidebar: "Recolher menu",
    openDrawerAriaLabel: "Abrir navegacao",
    searchPlaceholder: "Buscar"
  },
  authSession: {
    userName: "Felipe",
    userBadge: "Cliente Royal",
    accountLabel: "Minha conta"
  },
  authEmptyState: {
    title: "Entre para continuar",
    description: "Esta área guarda suas escolhas, pedidos, endereços e preferências Royal Prime.",
    action: "Ver cortes"
  },
  authModal: {
    tabs: {
      login: "Entrar",
      register: "Cadastrar"
    },
    landing: {
      badge: "Portal do cliente",
      calloutTitle: "Entre para transformar a vitrine em pedido acompanhado.",
      calloutDescription: "Na landing o acesso abre a area do cliente: pedidos, Royal Box, entregas e preferencias.",
      login: {
        title: "Entrar no Portal Royal",
        description: "Use o acesso do MVP para sair da landing e entrar na experiencia do cliente.",
        submit: "Entrar no portal"
      },
      register: {
        title: "Criar acesso Royal",
        description: "Cadastre-se para montar pedidos, salvar sua Box e acompanhar entregas.",
        submit: "Criar acesso"
      }
    },
    portal: {
      badge: "Conta Royal",
      calloutTitle: "Acesse para continuar dentro do portal.",
      calloutDescription: "No portal, o login libera as areas protegidas do cliente cadastrado.",
      login: {
        title: "Entrar na Royal Carnes",
        description: "Acesse sua conta para acompanhar pedidos, entregas, enderecos e preferencias.",
        submit: "Acessar minha conta"
      },
      register: {
        title: "Criar conta Royal",
        description: "Cadastre-se para salvar pedidos, montar sua Box e acompanhar entregas.",
        submit: "Criar conta"
      }
    },
    registerHint: "A conta libera pedidos, caixa e acompanhamento.",
    providers: [
      { key: "google", label: "Continuar com Google", shortLabel: "Google" },
      { key: "facebook", label: "Continuar com Facebook", shortLabel: "Facebook" },
      { key: "apple", label: "Continuar com Apple", shortLabel: "Apple" }
    ],
    demo: {
      email: "centauroadmin@gmail.com",
      password: "royalprime",
      hint: "Acesso principal do MVP."
    },
    separator: "ou",
    fields: {
      name: "Nome completo",
      email: "E-mail",
      password: "Senha"
    },
    placeholders: {
      name: "Seu nome",
      email: "voce@email.com",
      password: "Sua senha"
    },
    forgotPassword: "Esqueci minha senha",
    legal: "Este MVP simula o acesso para validar a experiencia do cliente. Nenhuma cobranca real e processada aqui."
  },
  royalDelivery: {
    emptyTitle: "Royal Delivery",
    emptyDescription: "A montagem avulsa do Royal Delivery entra aqui: carnes, formato, utensílios, carvão, endereço e pagamento."
  },
  meusPedidos: {
    title: "Meus Pedidos",
    subtitle: "Acompanhe suas compras, caixas e entregas Royal Delivery.",
    stats: {
      activeOrders: "Pedidos em andamento",
      nextBox: "Proximo ciclo",
      lastRating: "Ultima avaliacao",
      deliveredOrders: "Pedidos entregues"
    },
    currentOrder: {
      badge: "Pedido atual",
      total: "Valor total",
      deliveryCode: "Codigo de entrega",
      deliveryCodeHint: "Forneca ao entregador",
      items: "Itens do pedido",
      estimate: "Previsao",
      payment: "Pagamento"
    },
    nextBox: {
      badge: "Assinatura",
      title: "Proximo ciclo da assinatura",
      editWindow: "Edite os cortes e acompanhamentos ate 48h antes do envio.",
      action: "Editar ciclo"
    },
    history: {
      title: "Historico de Pedidos",
      type: "Tipo",
      date: "Data",
      status: "Status",
      value: "Valor",
      actions: "Acoes",
      details: "Detalhes",
      review: "Avaliar"
    }
  },
  pedido: {
    hero: {
      badge: "Pedido Royal Carnes",
      title: "Monte seu pedido",
      description: "Escolha primeiro o tipo de compra. Depois selecione produtos, compare categorias e acompanhe o resumo da montagem.",
      searchPlaceholder: "Buscar produto",
      filterLabel: "Filtrar",
      clearFilters: "Limpar filtros"
    },
    modes: {
      subscription: {
        title: "Assinatura fechada",
        eyebrow: "Basic, Premium ou Pro",
        description: "Planos com preço fixo, limites claros e produtos liberados por categoria.",
        details: ["Escolha o plano", "Selecione produtos do plano", "Receba mensal ou anual"]
      },
      royalBox: {
        title: "Royal Box",
        eyebrow: "Recorrente mensal",
        description: "Uma caixa personalizada que o cliente monta uma vez e recebe todo mês.",
        details: ["Todo o estoque Royal", "Dia do mês escolhido", "Carvão e utensílios"]
      },
      royalDelivery: {
        title: "Royal Delivery",
        eyebrow: "Pedido avulso",
        description: "Compra livre para receber agora, com endereço e frete definidos no pedido.",
        details: ["Sem recorrência", "Endereço flexível", "Repetir último pedido"]
      }
    },
    plans: {
      title: "Escolha um plano",
      subtitle: "Na assinatura fechada, o plano define o limite e quais produtos aparecem no grid.",
      activeTitle: "Voce esta montando o ciclo da sua assinatura",
      activeSubtitle: "O catalogo abaixo ja respeita o plano ativo, o saldo do ciclo e os limites de cada grupo.",
      activePlanLabel: "Plano ativo",
      renewalLabel: "Renova em",
      nextDeliveryLabel: "Proxima entrega",
      cycleUsageLabel: "Uso atual do ciclo"
    },
      catalog: {
        title: "Produtos disponíveis",
        subtitle: "Primeira camada do configurador: produtos, categorias, preço e disponibilidade.",
        emptyTitle: "Nenhum produto encontrado",
        emptyDescription: "Ajuste a busca ou selecione outra categoria.",
        foundLabel: "itens encontrados"
      },
    productCard: {
      fromLabel: "A partir de",
      categoryLabel: "Categoria",
      select: "Selecionar",
      selected: "Selecionado",
      add: "Adicionar",
      limitReached: "Limite atingido",
      limitReachedHint: "Saldo insuficiente neste ciclo.",
      quantitySuffix: "un.",
      availableForSubscription: "Assinatura",
      availableForBox: "Box",
      availableForDelivery: "Delivery"
    },
    filters: {
      modalTitle: "Filtrar produtos",
      categoryTitle: "Categoria",
      allCategories: "Todas as categorias",
      close: "Fechar",
      apply: "Aplicar"
    },
    summary: {
      title: "Resumo",
      empty: "Escolha uma modalidade para começar.",
      activeSubscriptionMode: "Minha assinatura",
      activeSubscriptionBadge: "Plano ativo",
      activeSubscriptionLabel: "Assinatura ativa",
      linkedPlan: "Plano vinculado",
      currentCycleFallback: "Uso do ciclo liberado",
      activeCycleDescriptionPrefix: "Ciclo atual vinculado ao plano",
      subscriptionRenewPrefix: "Renova em",
      nextDeliveryPrefix: "Proxima entrega em",
      cycleUsedSuffix: "usados no ciclo",
      activeSubscriptionHintSuffix: "Este pedido entra no ciclo atual da assinatura.",
      cycleCuts: "Cortes do ciclo",
      selectedMode: "Modalidade",
      selectedPlan: "Plano",
      selectedItems: "Itens selecionados",
      selectedLimit: "Itens escolhidos",
      fixedPlanPrice: "Preço fixo do plano",
      variableEstimate: "Estimativa",
      noVariableEstimate: "Na assinatura fechada, o valor não muda conforme os produtos selecionados.",
      meatUsage: "carnes",
      charcoalUsage: "carvão",
      seasoningUsage: "temperos",
      sideUsage: "acompanhamentos",
      utensilUsage: "utensílios",
      deliveryAddress: "Endereço",
      recurrenceDay: "Recorrência",
      selectedFreight: "Frete",
      freightNotSelected: "Selecionar na etapa de entrega",
      selectedPayment: "Pagamento",
      remove: "Remover",
      estimate: "Estimativa",
      nextStep: "Continuar montagem",
      paymentNextStep: "Ir para pagamento",
      finishStep: "Finalizar pedido",
      placeholder: "Na próxima etapa entram quantidades, cortes, recorrência, endereço e frete."
    },
    steps: {
      montagem: "Montagem",
      entrega: "Entrega",
      pagamento: "Pagamento",
      resumo: "Resumo"
    },
    deliveryStep: {
      badge: "Etapa 2",
      title: "Entrega e recorrência",
      description: "Confirme para onde o pedido vai e como essa modalidade deve ser entregue.",
      back: "Voltar para montagem",
      next: "Continuar para pagamento",
      common: {
        addressTitle: "Endereço de entrega",
        addressLabel: "Endereço principal",
        addressValue: "Rua das Palmeiras, 120 - Centro",
        addressHint: "Usado como padrão para este fluxo. Você pode trocar antes de finalizar.",
        primaryAddress: "Principal",
        zipPrefix: "CEP:",
        phonePrefix: "Tel:",
        removeAddress: "Remover",
        addAddress: "Adicionar outro endereço",
        newAddressTitle: "Novo endereço",
        zipCode: "CEP",
        street: "Rua",
        number: "Número",
        neighborhood: "Bairro",
        city: "Cidade",
        complement: "Complemento",
        saveAddress: "Salvar endereço",
        cancelAddress: "Cancelar",
        notesTitle: "Observações",
        notesPlaceholder: "Ex: deixar embalado por tipo de corte, horário preferencial ou ponto de referência."
      },
      subscription: {
        title: "Assinatura fechada",
        description: "Entrega vinculada ao cadastro do cliente. A forma de pagamento e ciclo de cobrança entram na próxima etapa.",
        fields: ["Usar endereço do cadastro", "Entrega recorrente da assinatura", "Preferências gerais do pacote"]
      },
      royalBox: {
        title: "Royal Box",
        description: "A Box fica recorrente no dia escolhido do mês, com a mesma composição montada na etapa anterior.",
        deliveryDayLabel: "Dia do mês",
        deliveryDayPrefix: "Todo dia",
        deliveryDayHint: "Escolha o dia fixo em que a caixa será preparada para entrega mensal.",
        fields: ["Endereço mensal da Box", "Receber todo mês nesse dia", "Observações da caixa"]
      },
      royalDelivery: {
        title: "Royal Delivery",
        description: "Pedido avulso para entrega agora, com endereço flexível e frete definido antes do pagamento.",
        freightLabel: "Frete",
        calculatedFreight: "Frete calculado",
        pendingFreight: "Escolha uma opção de frete",
        includedFreight: "Frete incluso",
        pickup: "Retirada",
        standardDelivery: "Entrega padrão",
        expressDelivery: "Entrega expressa",
        repeatLastOrder: "Repetir último pedido futuramente",
        fields: ["Entregar neste endereço", "Selecionar frete", "Observações do pedido"]
      }
    },
    paymentStep: {
      badge: "Etapa 3",
      title: "Pagamento",
      description: "Escolha como o cliente pretende finalizar. Por enquanto é uma etapa mockada para validar o fluxo do pedido.",
      back: "Voltar para entrega",
      next: "Continuar para resumo",
      methodsTitle: "Forma de pagamento",
      recurrenceTitle: "Cobrança recorrente",
      recurrenceDescription: "Para assinatura e Royal Box, o cartão pode ficar como método padrão das próximas cobranças.",
      installmentsTitle: "Parcelamento",
      installmentsSuffix: "x sem juros",
      totalTitle: "Total desta etapa",
      paymentMockNotice: "Pagamento ainda não processa cobrança real neste MVP.",
      methods: {
        pix: "Pix",
        pixDescription: "Gera uma chave mockada para pagamento rápido.",
        creditCard: "Cartão de crédito",
        creditCardDescription: "Melhor opção para cobrança recorrente e confirmação automática.",
        payOnDelivery: "Pagar na entrega",
        payOnDeliveryDescription: "O cliente paga quando receber o pedido, combinando com a entrega.",
        whatsapp: "Finalizar pelo WhatsApp",
        whatsappDescription: "Envia a montagem para atendimento concluir manualmente."
      }
    },
    reviewStep: {
      badge: "Etapa 4",
      title: "Resumo final",
      description: "Revise a modalidade, os itens, a entrega e o pagamento antes de finalizar.",
      back: "Voltar para pagamento",
      finish: "Finalizar pedido",
      orderTitle: "Pedido",
      deliveryTitle: "Entrega",
      paymentTitle: "Pagamento",
      itemsTitle: "Itens escolhidos",
      limitsTitle: "Disponibilidade do plano",
      totalTitle: "Total",
      emptyItems: "Nenhum item selecionado ainda.",
      fixedPlanHint: "Valor fixo da assinatura selecionada.",
      variableOrderHint: "Estimativa com produtos e frete selecionados."
    }
  },
  home: {
    hero: {
      nextBoxAlert: "Sua próxima caixa chega em 12 de setembro.",
      ctaViewBox: "Ver minha caixa"
    },
    highlights: {
      title: "Destaques Royal Carnes",
      wagyu: {
        title: "Mais pedidos 2026",
        subtitle: "Picanha, fraldinha, maminha e acompanhamentos"
      },
      dryAged: {
        title: "Churrasco para família",
        subtitle: "Produtos, carvão e utensílios para uma compra completa"
      },
      angus: {
        title: "Linha nobre",
        subtitle: "Picanha, baby beef, ancho e chorizo"
      }
    },
    exploreSection: {
      title: "Explore nossos catálogos",
      categories: ["Mais pedidos", "Família", "Linha nobre", "Espetinhos"]
    },
    orientation: {
      hero: {
        badge: "Home Royal Carnes",
        title: "Escolha o caminho do seu churrasco",
        description: "Veja o catálogo, entenda os produtos e escolha entre plano fechado, caixa recorrente personalizada ou pedido avulso.",
        ctaCatalog: "Ver catálogo",
        ctaProducts: "Conhecer produtos",
        catalogCardTitle: "Primeiro, olhe os cortes",
        catalogCardDescription: "O catálogo serve como vitrine: cortes, temperos, carvão, utensílios, disponibilidade por plano e opções que entram na Box ou no Delivery.",
        catalogCardCta: "Abrir catálogo",
        stats: [
          { value: "3", label: "formas de compra" },
          { value: "3kg a 8kg", label: "de carnes nos planos" },
          { value: "Box mensal", label: "com dia escolhido" }
        ]
      },
      paths: [
        {
          title: "Assinatura fechada",
          eyebrow: "Basic, Premium ou Pro",
          description: "Escolha um plano com preço fechado, kg de carne, carvão, temperos e benefícios definidos.",
          cta: "Conhecer planos",
          bullets: ["3kg, 5kg ou 8kg de carnes", "Carvão incluso por kg", "Formato de preparo"]
        },
        {
          title: "Royal Box",
          eyebrow: "Caixa recorrente",
          description: "Monte uma caixa personalizada uma vez e receba todo mês no dia escolhido.",
          cta: "Montar minha Box",
          bullets: ["Todo mês", "Produtos, carvão e utensílios", "Dia de entrega fixo"]
        },
        {
          title: "Royal Delivery",
          eyebrow: "Pedido avulso",
          description: "Peça agora com a mesma liberdade da Box, mas sem recorrência mensal.",
          cta: "Pedir avulso",
          bullets: ["Endereço escolhido", "Frete selecionável", "Repetir último pedido"]
        }
      ],
      catalogs: {
        badge: "Catálogos",
        title: "Vitrines para começar",
        cta: "Ver tudo",
        items: [
          {
            title: "Mais pedidos 2026",
            description: "Picanha, maminha, fraldinha, linguiça toscana e pão de alho."
          },
          {
            title: "Churrasco família",
            description: "Cortes versáteis, frango temperado, queijo coalho, combos e acompanhamentos."
          },
          {
            title: "Linha nobre",
            description: "Picanha, ancho, chorizo, contra-filé, baby beef e cortes especiais."
          },
          {
            title: "Espetinhos e acompanhamentos",
            description: "Espetinhos, pão de alho, queijo coalho, linguiças, carvão e itens para completar a mesa."
          }
        ]
      },
      planSummary: {
        badge: "Assinatura fechada",
        title: "Resumo dos planos",
        cta: "Comparar planos",
        plans: [
          {
            name: "Basic",
            price: "R$ 300/mês",
            annual: "R$ 289 no anual",
            details: ["3kg de carnes", "3kg de carvão", "1 tempero base"]
          },
          {
            name: "Premium",
            price: "R$ 500/mês",
            annual: "R$ 489 no anual",
            details: ["5kg de carnes", "5kg de carvão", "1 acompanhamento"]
          },
          {
            name: "Pro",
            price: "R$ 800/mês",
            annual: "R$ 789 no anual",
            details: ["8kg de carnes", "10kg de carvão", "1 utensílio Royal"]
          }
        ]
      },
      royalBox: {
        badge: "Royal Box",
        title: "Monte uma vez. Receba todo mês.",
        description: "A Royal Box é a assinatura personalizada da Royal Carnes. Escolha produtos, cortes, carvão, utensílios, endereço e o dia do mês para receber sempre a mesma caixa.",
        cta: "Montar Royal Box",
        features: ["Caixa recorrente", "Dia do mês", "Produtos e cortes", "Carvão e utensílios"]
      },
      delivery: {
        badge: "Royal Delivery",
        title: "Peça avulso agora",
        description: "O Delivery usa a mesma lógica livre da Box, mas para um pedido único: escolha os produtos, informe o endereço, selecione o frete e finalize para receber sem assinatura.",
        cta: "Ver pedido avulso",
        features: ["Pedido único", "Endereço flexível", "Frete selecionável", "Último pedido"]
      },
      trust: ["Cortes brasileiros", "Preparo escolhido", "Temperos e carvão", "Curadoria Royal", "Complementos"]
    }
  },
  cortes: {
    title: "Catálogo de Cortes",
    subtitle: "Explore toda a curadoria de carnes nobres do clube.",
    memberPriceLabel: "Preço para Membro:",
    exclusiveBadge: "Exclusivo para membros",
    ctaAddBox: "Adicionar à minha caixa",
    ctaBuy: "Comprar",
    categories: {
      wagyu: "Mais pedidos",
      dryAged: "Família",
      angus: "Linha nobre",
      limited: "Espetinhos"
    }
  },
  minhaCaixa: {
    title: "Minha Caixa",
    subtitle: "Caixa de Setembro",
    deliveryDate: "Entrega prevista: 12/09",
    itemsTitle: "O que vem na sua caixa",
    statusTitle: "Status do Envio",
    statusSteps: ["Preparando", "Embalada", "Enviada", "Entregue"],
    historyTitle: "Histórico de Caixas",
    historyItems: [
      { month: "Agosto 2026", count: "3 cortes" },
      { month: "Julho 2026", count: "4 cortes" },
      { month: "Junho 2026", count: "3 cortes" }
    ]
  },
  meuClube: {
    userName: "Felipe",
    memberSince: "Membro desde agosto de 2026",
    subscriptionTitle: "Minha assinatura",
    planName: "Royal Prime Monthly",
    price: "R$ 279/mês",
    nextBilling: "Próxima cobrança: 10/09",
    ctaManage: "Gerenciar assinatura",
    myAccountTitle: "Minha conta",
    accountMenu: [
      "Dados pessoais",
      "Endereço de entrega",
      "Forma de pagamento",
      "Preferências"
    ],
    myClubTitle: "Meu clube",
    clubMenu: [
      "Benefícios",
      "Cortes exclusivos",
      "Histórico",
      "Cupons & Vantagens"
    ]
  },
  landing: {
    hero: {
      badge: "ROYAL CARNES EM CASA",
      title: "Royal Carnes para o churrasco acontecer sem improviso",
      subtitle: "Escolha entre assinatura fechada, Royal Box mensal personalizada ou Royal Delivery avulso.",
      ctaPlans: "Entender como funciona",
      ctaShowcase: "Ver catálogo"
    },
    differentials: {
      badge: "PROVA & DIFERENCIAIS",
      title: "Por que o Royal Prime?",
      coldChain: {
        title: "Churrasco completo",
        description: "Cortes, acompanhamentos, carvão e utensílios em uma experiência organizada para comprar melhor."
      },
      curatorship: {
        title: "Catálogos fáceis de navegar",
        description: "Vitrines como Mais pedidos, Família, Linha nobre e Espetinhos ajudam o cliente a decidir."
      },
      flexibility: {
        title: "Três formas de comprar",
        description: "Assinatura fechada, Royal Box recorrente mensal e Royal Delivery avulso."
      }
    },
    showcase: {
      badge: "CATÁLOGOS ROYAL",
      title: "Vitrines para cada tipo de churrasco",
      subtitle: "Catálogos editoriais ajudam o cliente a comprar por ocasião, preferência e necessidade.",
      tomahawk: {
        badge: "Catálogo",
        title: "Mais pedidos 2026",
        description: "Picanha, fraldinha, maminha, pão de alho e linguiça toscana."
      },
      wagyu: {
        badge: "Vitrine",
        title: "Churrasco para família",
        description: "Produtos, acompanhamentos, carvão e utensílios para resolver o churrasco completo."
      },
      picanha: {
        badge: "Premium",
        title: "Linha nobre",
        description: "Picanha, baby beef, ancho, chorizo e cortes especiais."
      }
    },
    steps: {
      badge: "PASSO A PASSO",
      title: "Três formas de comprar na Royal Carnes",
      step1: {
        number: "1",
        title: "Assinatura fechada",
        description: "Escolha Basic, Premium ou Pro, com limite, benefícios e preço fixo."
      },
      step2: {
        number: "2",
        title: "Royal Box",
        description: "Monte uma caixa personalizada uma vez e receba todo mês no dia escolhido."
      },
      step3: {
        number: "3",
        title: "Royal Delivery",
        description: "Faça um pedido avulso, escolha endereço, frete e finalize para receber agora."
      }
    },
    plans: {
      badge: "PRODUTOS",
      title: "Escolha como quer receber",
      subtitle: "Assinatura fechada, Royal Box personalizada mensal ou Royal Delivery avulso.",
      billingMonthly: "Cobrança Mensal",
      billingAnnual: "Cobrança Anual",
      annualDiscountBadge: "ANUAL",
      annualBanner: {
        savings: "Até R$ 1.680 de Economia",
        savingsDesc: "Desconto de 20% aplicado diretamente em todas as 12 caixas do ano.",
        gift: "Royal Box personalizada",
        giftDesc: "Monte a composicao e receba todo mes no dia escolhido.",
        priceLock: "Preço Congelado 12 Meses",
        priceLockDesc: "Garantia contra reajustes de inflação durante todo o período."
      },
      essential: {
        badge: "Assinatura fechada",
        title: "Basic",
        subtitle: "Plano de entrada para quatro produtos de melhor custo-benefício.",
        monthlyPrice: "300",
        annualPrice: "289",
        annualSavings: "Plano anual",
        features: [
          "Escolha 4 produtos",
          "Produtos do grupo Basic",
          "Formato por produto: espeto, peca, isca ou fatiado",
          "Pagamento mensal ou anual"
        ],
        cta: "Ver Basic"
      },
      master: {
        badge: "Mais equilibrado",
        tagFeatured: "MAIS PEDIDO",
        title: "Premium",
        subtitle: "Mais escolhas, cortes premium, carvão incluso e temperos selecionados.",
        monthlyPrice: "500",
        annualPrice: "489",
        annualSavings: "Plano anual",
        features: [
          "Escolha 6 produtos",
          "Inclui Basic, Picanha e Contra file",
          "Inclui 2 pacotes de carvao",
          "Escolha ate 2 temperos"
        ],
        cta: "Ver Premium"
      },
      wagyu: {
        badge: "Linha nobre",
        title: "Pro",
        subtitle: "Mais variedade, cortes nobres, faca inclusa e maior liberdade de complementos.",
        monthlyPrice: "800",
        annualPrice: "789",
        annualSavings: "Plano anual",
        features: [
          "Escolha 8 produtos",
          "Inclui Basic, Premium, Chorizo e linha nobre",
          "Escolha ate 5 pacotes de carvao",
          "Recebe Faca Royal e escolhe ate 4 temperos"
        ],
        cta: "Ver Pro"
      }
    },
    gift: {
      badge: "ROYAL BOX",
      title: "Monte uma vez. Receba todo mês.",
      description: "A Royal Box e a assinatura personalizada da Royal Carnes. Escolha produtos, formatos, carvão, utensílios, endereço e dia do mês.",
      cta: "Montar Royal Box"
    },
    faq: {
      badge: "TRANSPARÊNCIA TOTAL",
      title: "Perguntas Frequentes",
      q1: {
        question: "Quais formas de compra existem?",
        answer: "A Royal Carnes trabalha com Assinatura fechada, Royal Box recorrente mensal e Royal Delivery avulso."
      },
      q2: {
        question: "O que e a Royal Box?",
        answer: "Royal Box e uma caixa personalizada recorrente. O cliente monta a composicao, escolhe o dia do mes e recebe aquela box mensalmente."
      },
      q3: {
        question: "Qual a diferenca entre Royal Box e Royal Delivery?",
        answer: "A Royal Box e mensal e recorrente. O Royal Delivery e avulso, com pedido feito na hora, endereco escolhido e valor de delivery."
      }
    }
  },
  library: {
    hero: {
      badge: "Library RoyalPrime",
      title: "Library",
      description: "Inventario tecnico das screens e product components que podem amadurecer para ServiceOS.",
      primaryAction: "Componentes",
      secondaryAction: "Screens"
    },
    sections: {
      maturity: "Niveis",
      candidates: "Fila",
      preview: "Preview"
    },
    labels: {
      owner: "Owner",
      status: "Status",
      manifest: "Manifest necessario",
      currentPath: "Local atual",
      route: "Rota",
      command: "Comando",
      level: "Nivel",
      screen: "Screen",
      productComponent: "Product component",
      active: "Em uso",
      future: "Futuro",
      mapped: "Mapeado",
      needsManifest: "Precisa de manifest",
      needsContract: "Precisa de contrato",
      priceLabel: "Referencia de preco",
      action: "Simular acao",
      selectedAction: "Selecionado",
      category: "Catalogo",
      monthlyCycle: "mensal",
      annualMonthlyCycle: "mensal no anual",
      annualPromotion: "Promocao anual",
      benefitsSuffix: "beneficios"
    },
    levels: {
      level0: {
        title: "Screen local",
        description: "Nasce direto na tela para resolver uma necessidade real do RoyalPrime."
      },
      level1: {
        title: "Ecommerce reutilizavel",
        description: "Aparece em mais de uma tela de ecommerce e ganha um componente de produto local."
      },
      level2: {
        title: "Multi-service",
        description: "Mostra potencial para ecommerce e outro service, mas so sera avaliado na filtragem para ServiceOS."
      },
      level3: {
        title: "Foundation/AppShell",
        description: "Deixa de ser produto e vira primitive visual ou capacidade generica de casca."
      }
    }
  },
  portal: {
    title: "Portal do Sócio Royal VIP",
    subtitle: "Gerencie sua assinatura.",
    navigation: {
      mySubscription: "Minha Assinatura",
      tracking: "Rastreio",
      catalog: "Loja VIP",
      settings: "Configurações"
    },
    subscriptionScreen: {
      badge: "SÓCIO ATIVO",
      activePlanTitle: "Plano Master Royal",
      nextDispatch: "Previsão: 05/09",
      boxWeight: "6.0kg",
      boxItemsTitle: "Cortes do Mês",
      items: [{ name: "Picanha Angus", weight: "1.2kg", detail: "BMB 8+" }],
      actions: { pause: "Pausar", changePlan: "Alterar Plano", support: "Suporte VIP" }
    },
    trackingScreen: {
      title: "Rastreio Refrigerado",
      trackingCodeLabel: "Código:",
      trackingCode: "RP-2026",
      carrier: "Express Cold",
      steps: [{ label: "Confirmado", status: "completed", date: "20/08" }]
    },
    catalogScreen: {
      badge: "LOJA VIP",
      title: "Cortes Avulsos",
      items: [{ name: "Picanha", price: "R$ 114", oldPrice: "R$ 129", weight: "1.0kg", icon: "StoreIcon" }],
      ctaAdd: "Adicionar"
    },
    settingsScreen: {
      title: "Configurações",
      addressTitle: "Endereço",
      address: "Av. Atlântica 1702",
      paymentTitle: "Pagamento",
      paymentCard: "Mastercard Black",
      ctaSave: "Salvar"
    }
  },
  minhaConta: {
    title: "Minha Conta",
    subtitle: "Gerencie seu plano, dados pessoais, endereços e preferências.",
    headerGreeting: "Gerencie seu plano, endereços, métodos de pagamento e preferências da sua conta.",
    badge: "SOCIO ATIVO",
    planLabel: "Plano Ativo",
    renewLabel: "Próxima renovação",
    cycleLabel: "Cota do Ciclo Atual",
    tabs: {
      subscription: "Minha Assinatura",
      orders: "Pedidos & Entregas",
      personalData: "Dados Pessoais",
      addresses: "Endereços",
      payment: "Pagamento",
      preferences: "Preferências"
    },
    sections: {
      capacityTitle: "Uso & Capacidade da Assinatura",
      recentOrdersTitle: "Pedidos Recentes",
      personalTitle: "Informações Pessoais",
      addressesTitle: "Meus Endereços",
      paymentTitle: "Métodos de Pagamento",
      legalTitle: "Políticas e Cancelamento"
    },
    actions: {
      changePlan: "Alterar Plano",
      viewDetails: "Ver Detalhes",
      saveChanges: "Salvar Alterações",
      addAddress: "Adicionar Endereço",
      addPayment: "Adicionar Cartão",
      closeAccount: "Encerrar Conta",
      cancelSubscription: "Cancelar Assinatura"
    },
    legalNotice: "Ao cancelar ou pausar a assinatura, os benefícios de preços diferenciados e a garantia de cota mensal serão interrompidos ao término do período vigente."
  },
  orderDetailModal: {
    title: "Detalhes do Pedido",
    codeLabel: "Código",
    typeLabel: "Tipo de Pedido",
    statusLabel: "Status",
    deliveryCodeLabel: "Código de Validação de Entrega",
    deliveryCodeHint: "Informe este código ao entregador no momento do recebimento.",
    itemsTitle: "Itens do Pedido",
    deliveryTitle: "Informações de Entrega",
    estimateLabel: "Previsão de Entrega",
    addressLabel: "Endereço de Entrega",
    paymentTitle: "Resumo do Pagamento",
    subtotalLabel: "Subtotal",
    freightLabel: "Frete",
    discountLabel: "Desconto",
    totalLabel: "Total",
    closeAction: "Fechar",
    supportAction: "Falar com Suporte"
  }
};
