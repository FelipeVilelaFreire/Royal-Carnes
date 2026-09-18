# Continuacao 1 - Planos de assinatura

Planos usam duas tabelas no Admin: capacidades gerais e limites especificos.
O shared-core associa cada limite especifico ao seu grupo e persiste em
`constraints.itemLimits`; o backend valida tanto o limite do grupo quanto o
limite por produto. Nenhuma tela decide por nome de produto.

Exemplo: Carnes 12kg e ate 10 escolhas; Picanha ate 2kg. O mesmo contrato
suporta 4 camisetas gerais e 3 camisetas de futebol. O proximo corte deve
fotografar as regras no ciclo para que uma edicao de plano nao retroaja.
