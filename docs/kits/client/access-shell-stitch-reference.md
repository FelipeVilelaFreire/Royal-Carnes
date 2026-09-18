# Referencia visual Stitch - acesso Client

Status: referencia visual recebida do usuario em 2026-09-18 para a entrada
do Portal Client e da area Perfil. Nao e codigo de producao e nao autoriza
Tailwind, fontes remotas, Material Symbols, CSS literal, imagens externas ou
dados demonstrativos no runtime.

## Origem preservada

O usuario enviou um HTML completo gerado pelo Stitch para um modal de acesso
Royal Prime em modo escuro. O original usa Tailwind CDN, Google Fonts,
Material Symbols, imagens externas, valores CSS literais, scripts inline e um
painel de demonstracao de estados. Ele serve somente como direcao visual; nao
deve ser executado, copiado para o produto ou tratado como contrato funcional.

## Direcao visual recebida

Experiencia de acesso premium para uma acougueria gourmet brasileira: atmosfera
escura, superfices em camadas, acento dourado/cobre pontual, tipografia
editorial e uma leitura serena de exclusividade e confianca.

O Stitch propoe um modal desktop arquitetado em duas colunas:

```text
portal escurecido e desfocado ao fundo
  -> modal central
     -> painel editorial de marca a esquerda
     -> formulario de acesso a direita
```

O formulario inclui entrada por Google, divisor para entrada por e-mail, e-mail,
senha, recuperacao de senha, acao primaria, alternancia para cadastro e estados
visuais de erro e carregamento. No mobile, a referencia pede uma composicao de
uma coluna, sem simplesmente reduzir o modal desktop.

## Anatomia visual a estudar

| Regiao | Referencia Stitch | Traducao segura para RoyalPrime |
| --- | --- | --- |
| Fundo | Portal desfocado sob um scrim escuro | O Portal real permanece atras do `AccessShell`; nao criar uma pagina ou AppShell paralelo. |
| Modal | Card central em duas colunas no desktop | O `AccessShell` Foundation continua dono da apresentacao; a composicao deve usar `Modal` desktop e `BottomModal`/screen no mobile conforme config. |
| Painel de marca | Fotografia editorial, selo e argumentos de valor | Direcao a avaliar. Midia, logo e qualquer selo devem vir do catalogo de assets/config; nao usar imagem externa, promessas ou certificacoes inventadas. |
| Cabeca do formulario | "Conta Royal", titulo e descricao | Copy vem do locale ativo e descreve somente capacidades reais do Portal. |
| Google | Botao secundario "Continuar com Google" | E somente referencia de interface. So pode receber acao quando OAuth for contratado no backend e exposto pelo shared-core. |
| E-mail e senha | Labels, campos, esqueci senha e CTA | Mantem o fluxo real existente: submit chama o hook de autenticacao, que chama a API e o backend. |
| Cadastro | Alternancia dentro da mesma casca | Usa os fluxos declarados no `access-shell.config.jsx`; nao criar tela ou estado de negocio paralelo. |
| Erro e loading | Banner de erro e botao em carregamento | Estados devem refletir retorno real do hook. Nenhum painel de demonstracao entra no produto. |
| Fechar | Acao discreta no topo | Usa o fechamento real do modal, com rotulo localizado e navegacao por teclado. |

## O que esta fora do contrato atual

```text
API atual
  -> POST /api/v1/auth/login/
  -> email e senha

Nao existe ainda
  -> OAuth Google
  -> recuperacao de senha confirmada pelo backend
```

Portanto, o design pode reservar espaco para esses caminhos, mas a implementacao
nao deve mostrar um botao que parece autenticar, nem uma recuperacao de senha
que nao tenha endpoint, callback e feedback real.

## Regras de futura implementacao

```text
Portal / Perfil
  -> AccessShell Foundation configurado pela surface Client
  -> useClientAuthSession / useClientLogin
  -> clientAuthApi
  -> backend de autenticacao
```

- O modal nao recria Header, Drawer, Footer, BottomTabBar ou AppShell.
- O `AccessShell` permanece uma capacidade generica; qualquer ampliacao dele
  exige avaliar reutilizacao e obter aprovacao antes de editar a Foundation.
- A surface Client escolhe apresentacao e fluxos pelo
  `frontend/client/shared-core/manifest/portal/access-shell.config.jsx`.
- Toda copy nova fica nos locales Client; labels e `aria-labels` tambem.
- Icones de interface usam somente o contrato SVG da Foundation; nao usar
  emoji ou Material Symbols.
- Theme -> semi-composed -> UI: nenhum valor visual literal vindo do Stitch
  deve ser copiado para TSX ou CSS Modules.
- Imagens e logo pertencem ao manifest/catalogo de assets, nao ao JSX.

## Pontos pendentes de decisao visual

Ainda nao sao decisoes de implementacao. Devem ser discutidos com o usuario
antes do proximo corte:

1. Se o painel editorial esquerdo permanece, fica mais discreto ou e removido.
2. Como a logo Royal deve aparecer e qual asset real a representa.
3. Se o divisor entre Google e e-mail ajuda a hierarquia ou se o acesso deve
   ter outra composicao.
4. Quanto da imagem editorial cabe na experiencia sem competir com o formulario.
5. Como a linguagem do modal se conecta ao Perfil sem transformar o Perfil em
   uma repeticao da landing page.

## Proximo passo

Primeiro discutir e fechar a direcao visual desta referencia. So depois mapear
o resultado escolhido para o `AccessShell` existente, os tokens/receitas da
Foundation, o manifest Client, locales e os estados reais de autenticacao.
