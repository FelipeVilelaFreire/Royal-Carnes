# Referência visual do Dashboard Admin

Status: referência visual fornecida pelo usuário em 2026-09-11. Não é contrato arquitetural e não autoriza Tailwind, cores locais ou uma implementação paralela.

## Objetivo

Usar a referência Stitch como direção visual para as superfícies administrativas, preservando o contrato do RoyalPrime:

```text
Theme tokens -> Semi-composed recipes -> Foundation UI -> Admin config -> render-only screen
```

## Anatomia aprovada

1. Fundo escuro atmosférico e discreto, já pertencente ao AppShell/Background.
2. Conteúdo com largura ampla e respiro vertical consistente.
3. Cabeçalho editorial: marcador circular pequeno, rótulo em caixa alta, título Plus Jakarta e subtítulo curto.
4. Quatro KPIs em uma linha desktop: rótulo pequeno, ícone quadrado discreto, valor mono e apoio com ponto semântico.
5. Títulos de blocos de tabela ficam em uma faixa própria acima da superfície de linhas, com contador compacto e ação à direita.
6. Tabela em Surface glass separada: cabeçalho baixo, divisores suaves, linhas densas e hover muito contido.
7. Status usa Badge compacto de texto normal, ponto indicador e cor semântica: sucesso, aviso, perigo ou primário.
8. Valores financeiros e códigos operacionais usam a família mono; nomes principais usam texto de maior contraste; metadados usam tom muted.

## Tradução da referência para o RoyalPrime

| Referência Stitch | Implementação RoyalPrime |
| --- | --- |
| `glass-panel` / `glass-card` | `Surface appearance="glass"` via `dashboard.config.jsx` e receita Foundation |
| Tailwind spacing/radius | tokens de Theme e Layout Foundation |
| cores RGBA locais | Theme + Semi-composed + tons semânticos da Foundation |
| `status-badge` | `Badge` Foundation com `indicator` |
| Plus Jakarta / JetBrains Mono | tokens do tema exclusivo do Admin |
| tabela HTML direta | tela render-only, colunas e cópia declaradas por config/locale |

## Regra de fidelidade

Copiar a hierarquia visual, a densidade e a intenção da referência; nunca copiar scripts CDN, Tailwind, CSS físico, fontes remotas da tela ou dados de demonstração para o runtime do produto.
