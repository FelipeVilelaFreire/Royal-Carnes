# Verificacao automatica

Contrato: ../ROYALPRIME_ARCHITECTURE_CONTRACT.md.
Estes scripts verificam parte objetiva do contrato; nao substituem revisao.

## Comandos na raiz

- npm run verify:rules: compara o working tree completo com HEAD, incluindo
  alteracoes staged, unstaged e arquivos novos nao ignorados.
- npm run verify:rules -- --base REV: compara com um commit explicito; use a
  base inicial da tarefa se houve commits durante a execucao.
- npm run verify:rules -- --all: inventario estrito de toda a fonte frontend;
  falha tambem para divida antiga. Nao e o comando incremental de entrega.
- npm run test:rules: testes positivos/negativos do analisador.
- npm run verify:foundation: verificacoes especificas da Foundation existentes.
- npm run verify: testes do analisador, regras incrementais e Foundation.

## Cobertura

TypeScript AST verifica style explicito e spreads locais resolviveis, texto JSX
literal, atributos/propriedades comuns de copy em UI/config, emoji, tags style/SVG locais, JSX fora de TSX,
imports/reexports/require/import dinamico com specifier literal e chamadas
fetch/axios diretas nas render-apps. Confere fronteiras client/admin/Foundation,
imports de mock/API/data-source, locale fixo e novas dependencias de casca legada.
PostCSS verifica cores hex/rgb/hsl, medidas fisicas com unidades e consumo direto
de Theme no CSS de UI. Imports CSS novos devem ser Modules.

Comparacao por arquivo/regra/conteudo normalizado e quantidade. Ocorrencia antiga
identica pode permanecer; mudar seu conteudo ou adicionar outra falha. Mover
codigo entre arquivos nao transfere automaticamente a tolerancia. Nao existe
comando para atualizar baseline ou comentario de supressao.

## Integracao

prebuild de client e admin executa o verificador, inclusive ao rodar npm run build
diretamente no pacote. Invocar next/vite diretamente ignora hooks npm.
GitHub Actions executa testes e compara com merge-base do PR ou commit anterior
do push. No primeiro push de uma branch, usa merge-base com a branch padrao;
sem base disponivel, executa inventario estrito. A execucao remota depende de
publicar os arquivos. Tornar o check
obrigatorio para merge depende da configuracao de protecao de branch no GitHub;
este trabalho nao altera essas configuracoes nem publica commits.

## Limites conhecidos

Nao e um typechecker de fluxo de dados nem um verificador de semantica comercial.
Nao resolve aliases arbitrarios novos, reexports indiretos em barrels, computed
imports, todas as APIs de rede, spreads externos, CSS-in-JS disfarçado, strings
montadas por funcoes ou toda a gramatica de cores/unidades CSS. Casos conhecidos
devem ganhar teste e regra especifica ao amadurecer, sem alegar cobertura total.
Rotas, salvamento real, permissoes, regra backend, visual e paridade native ainda
exigem os testes/inspecoes do contrato.

Bindings novos internos de Foundation podem ser reprovados: nao adicionar
excecao ampla por pasta. Revisar o contrato, a necessidade e criar uma verificacao
estreita testada para o caso autorizado. Nao desativar check para concluir tarefa.

O diff incremental nao exige limpar tudo no arquivo; por isso a revisao manual
do trecho alterado continua obrigatoria. Commitar uma violacao e comparar com
HEAD depois pode ocultar a novidade localmente; CI compara com a base externa.

Saida: codigo 0 sem novas violacoes; 1 com violacoes e arquivo/linha/regra;
2 se o verificador nao conseguir executar (por exemplo, base Git ausente).

## Validacao inicial (2026-09-08)

28 testes do analisador e 93 checks Foundation passaram. Builds admin/client
passaram com prebuild ativo. Um arquivo temporario novo com estilo inline e
copy literal fez o prebuild falhar com duas regras e codigo 1; foi removido
apos a prova. O workflow remoto ainda nao foi executado/publicado nesta tarefa.
