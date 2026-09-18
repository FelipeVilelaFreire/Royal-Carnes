# Planos: capacidades basicas no Admin

## Objetivo atual

Esta etapa entrega somente a configuracao basica de capacidade no Admin. O
operador define quanto o plano oferece por categoria-pai, sem montar ainda
uma arvore de subcategorias ou produtos especificos.

Exemplo de configuracao:

```text
Carnes             10 kg
Acompanhamentos     3 unit
Utensilios          2 unit
```

## O que aparece no Admin

Na secao `Capacidades do plano`, cada linha tem somente:

1. `Capacidade`: seletor limitado a categorias-pai do catalogo.
2. `Limite`: quantidade permitida no plano.

A unidade e preenchida automaticamente a partir da categoria escolhida.
Assim, `Carnes` usa `kg` e `Utensilios` usa `unit`; o operador nao precisa
escolher nem digitar a unidade.

## Fora deste recorte

Nesta etapa, o Admin nao configura:

- categoria filha;
- produto ou variante especifica;
- relacao pai/filho entre capacidades;
- maximo de escolhas diferentes.

Essas possibilidades permanecem como evolucao posterior. Quando forem
reintroduzidas, precisam nascer de uma decisao de produto clara e de um fluxo
de edicao que mostre visualmente a arvore inteira, em vez de campos tecnicos
soltos.

## Donos do fluxo

```text
Catalogo administra categorias-pai e suas unidades
  -> shared-core do Admin carrega as opcoes validas
  -> planos.config.jsx declara os dois campos editaveis
  -> renderer padrao apresenta e salva o formulario
```

O frontend apenas restringe a configuracao visivel a categorias-pai e resolve
a unidade para apresentacao. Regras de elegibilidade e consumo continuam sob
autoridade do backend.
