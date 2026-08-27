# Library de product components ecommerce

A rota `/library` existe para mapear, testar e documentar componentes de produto que nasceram no RoyalPrime, mas que podem amadurecer para um futuro `services/ecommerce` no ServiceOS.

Ela nao e uma vitrine final de design system. Tambem nao e uma promessa de que tudo que aparece ali deve ser promovido. A library e uma bancada tecnica para separar o que e reutilizavel, entender quais opcoes realmente existem e preparar uma filtragem futura com menos risco.

## Objetivo

- listar componentes candidatos de ecommerce;
- mostrar o status de cada componente: mapeado, precisa de manifest ou precisa de contrato;
- renderizar exemplos reais usando mocks existentes do RoyalPrime;
- expor composicoes e modos declarados no manifest;
- permitir interacao simples para validar estado, handlers e variacoes;
- documentar o que pertence ao componente e o que pertence a Foundation/AppShell.

## Regra principal

O componente de produto controla composicao funcional.

A Foundation/AppShell controla aparencia fina.

Isso significa que o manifest do componente pode decidir coisas como:

- mostrar ou esconder imagem, nome, descricao, preco, badge, beneficios ou acao;
- escolher um modo como `catalog`, `checkout`, `compact`, `monthlyPlan` ou `annualPromotion`;
- escolher um `priceMode`, `actionMode`, `benefitsMode`, `quantityMode` ou equivalente;
- declarar quais dados, labels e handlers a tela consumidora precisa fornecer.

Mas o manifest do componente nao deve decidir:

- raio final do card;
- escala tipografica;
- cor exata;
- sombra;
- estilo visual do botao;
- desenho de icone;
- receita de superficie.

Essas decisoes sao do design system atual no MVP e, futuramente, da Foundation/AppShell do ServiceOS.

## Niveis

`level-0`: screen local.

Nasce dentro de uma tela para resolver uma necessidade concreta. Pode ser baguncado no comeco, mas nao deve virar padrao automaticamente.

`level-1`: product component local.

Quando uma parte aparece em mais de uma tela ou claramente representa uma unidade de ecommerce, ela pode ir para `frontend/client/web/src/product-components/ecommerce`.

`level-2`: candidato multi-service.

Quando o mesmo contrato servir para ecommerce e outro service, ele pode ser avaliado futuramente para ServiceOS.

`level-3`: Foundation/AppShell.

Quando a decisao deixa de ser produto e vira primitive visual, token, receita, layout ou casca generica.

## Como um componente entra na library

1. Criar o componente real em `frontend/client/web/src/product-components/ecommerce`.
2. Criar um manifest ao lado do componente.
3. Exportar componente e manifest em `index.ts`.
4. Adicionar o candidato em `frontend/client/shared-core/mocks/library.mock.ts`.
5. Adicionar um preview na `/library` usando dados reais ou mocks ja existentes.
6. Rodar `npm run build`.

## Estrutura esperada de um manifest

Cada manifest deve ter pelo menos:

- `id`, `name`, `service`, `componentLevel`, `targetPath`, `manifestPath`, `owner`, `status`;
- `manifestScope.owns`;
- `manifestScope.doesNotOwn`;
- `designSystemBoundary`;
- `composition`;
- `optionGroups`;
- `compositions`;
- `dataContract`;
- `capabilities`.

`optionGroups` alimenta o painel da `/library`.

- `control: "boolean"` aparece como liga/desliga;
- `control: "select"` aparece como select compacto;
- `control: "text"` e `control: "number"` ficam documentados para evolucao posterior;
- `owner: "product-component"` significa opcao funcional do card;
- `owner: "consumer-state"` significa estado/handler vindo da screen;
- `owner: "foundation"` deve ser evitado por enquanto, salvo quando estivermos documentando uma futura decisao visual.

## Componentes atuais

### ProductItemCard

Representa um item de catalogo ou produto selecionavel.

Serve para:

- catalogo;
- checkout;
- lista compacta;
- produto incluso em plano;
- item favorito;
- item com quantidade.

O foco dele e produto. Se a necessidade virar plano, pagamento, entrega ou resumo, deve nascer outro card.

### PlanBenefitCard

Representa plano, assinatura ou beneficio comercial.

Serve para:

- plano mensal;
- plano anual;
- promocao anual;
- comparacao de planos;
- gerenciamento de assinatura;
- upgrade.

O foco dele e plano/beneficio. Ele nao deve tentar representar produto individual.

## O que queremos aprender com a library

A library deve responder perguntas praticas:

- este card aparece em mais de uma tela?
- quais partes dele realmente precisam ser opcionais?
- quais opcoes sao booleanas e quais precisam ser select?
- quais estados pertencem a tela consumidora?
- quais variacoes sao apenas aparencia e devem ir para Foundation?
- o contrato continua simples depois de ver varios exemplos lado a lado?

Se um card comeca a ganhar opcoes demais, provavelmente existem dois componentes diferentes escondidos nele.

## Criterio para futura promocao ao ServiceOS

Um componente so deve ser considerado para ServiceOS quando:

- tiver uso real em mais de uma tela ou fluxo;
- tiver manifest estavel;
- tiver exemplos claros na `/library`;
- separar bem dados, composicao, estado consumidor e visual de Foundation;
- nao depender de regra exclusiva da RoyalPrime;
- sobreviver a uma revisao de contrato sem carregar atalhos do MVP.

A promocao deve acontecer aos poucos. A tree do RoyalPrime ajuda a organizar o trabalho, mas a library nao deve fingir que o MVP ja e ServiceOS completo.
