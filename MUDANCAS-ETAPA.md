# Mudanças desta etapa

Este documento resume, em detalhes, as mudanças implementadas recentemente na aplicação `Fut Carrara`.

O foco desta etapa foi tornar a experiência mais limpa no mobile, reduzir ruído visual na tela de elenco e deixar a navegação principal mais acessível.

## 1. Navegação principal no rodapé

Foi criada uma navegação fixa na parte inferior da tela para acesso rápido às áreas principais do app.

### O que ela faz

- Exibe atalhos para `Início`, `Elenco`, `Sorteio` e `Resultado`.
- Fica fixa no rodapé, visível em qualquer tela.
- Destaca a rota atual com estado visual ativo.
- Respeita a área de safe area do celular para não ficar colada na borda do aparelho.

### Impacto prático

- Remove a dependência da seta de voltar no canto superior esquerdo.
- Facilita o uso com uma mão no celular.
- Mantém a navegação sempre disponível, mesmo quando o usuário está no final da página.

## 2. Tela de elenco virou somente visualização

A tela de elenco foi simplificada para funcionar apenas como vitrine da lista do grupo.

### O que saiu da tela

- Formulário de adicionar jogador.
- Botão de foco no estado vazio para criar o primeiro jogador pela interface.
- Controles de editar a classificação do jogador.
- Controle para aposentar/reativar jogadores.
- Ação de apagar jogador.
- Caixa de confirmação de remoção.

### O que ficou

- Lista de jogadores em modo leitura.
- Nome do jogador como informação principal.
- Indicação visual de aposentado quando o jogador não está ativo.
- Filtro de status com apenas duas opções: `Em atividade` e `Aposentados`.

### Comportamento padrão

- A tela abre mostrando apenas jogadores em atividade.
- Jogadores aposentados só aparecem quando o filtro de `Aposentados` é selecionado.
- A interface fica mais leve e menos poluída para consulta rápida.

## 3. Indicador de meio ponto voltou e foi reposicionado

Os jogadores com skill de meio ponto continuam sendo destacados na visualização.

### Como ficou o marcador

- A seta volta a aparecer para skills como `0.5`, `1.5`, `2.5`, `3.5` e `4.5`.
- A cor do marcador foi ajustada para o mesmo verde claro usado no título `Elenco`.
- O marcador foi deslocado para a direita do card do jogador.
- Ele fica visualmente separado do nome, para não competir com a leitura principal.

### Objetivo da mudança

- Manter a informação da skill sem misturar o marcador com o nome.
- Preservar a leitura limpa do card.
- Deixar o destaque de meio ponto mais coerente com o resto da identidade visual.

## 4. Tela de sorteio ficou mais estável no mobile

A tela de sorteio recebeu ajustes de layout e comportamento para não atrapalhar a leitura dos jogadores.

### Ajustes de navegação e espaço

- O conteúdo ganhou mais espaço inferior global para não ficar encoberto pela navegação fixa.
- A área do sorteio foi ajustada para respeitar a barra inferior.
- O footer do sorteio foi elevado para ficar acima da navegação principal.

### Ajuste de UX para o estado vazio

- Quando não há jogadores selecionados, o aviso `0 selecionados / Toque nos jogadores que vão jogar.` deixa de ficar fixo sobre a lista.
- Nesse estado, a mensagem aparece em fluxo normal, como um card dentro da página.
- Quando há seleção, o footer continua fixo para manter os formatos e a ação de limpar sempre acessíveis.

### Resultado

- Os jogadores não ficam cobertos pelo aviso.
- A área útil de seleção fica mais confortável no celular.
- O usuário entende melhor o estado atual sem perder espaço de leitura.

## 5. Tela de resultado foi alinhada ao mobile

A tela de resultado estava visualmente mais larga que as demais telas e foi ajustada para ficar consistente.

### O que mudou

- A largura máxima da página foi alinhada ao padrão mobile do app.
- O layout ficou com a mesma sensação de densidade das outras telas.

### Benefício

- A tela deixou de parecer “aberta demais” em celular.
- A leitura ficou mais uniforme entre as rotas.
- O resultado visual ficou mais compatível com o restante da aplicação.

## 6. Resultado transitório foi limpo ao entrar no sorteio

O app usava um resultado transitório para mostrar a tela de resultado após o sorteio.

### O ajuste feito

- Ao entrar na tela de sorteio, o último resultado transitório é limpo.
- Isso evita que a tela de resultado reapareça antes de um novo sorteio.

### Por que isso importa

- Deixa o fluxo mais previsível.
- Evita confusão visual para o admin.
- Garante que a tela de resultado só apareça quando houver um sorteio novo.

## 7. Elenco com filtros mais simples

O filtro do elenco foi reduzido para deixar a navegação mais direta.

### O que mudou

- O filtro de status agora tem apenas duas opções.
- `Todos` foi removido.
- O padrão da tela é `Em atividade`.

### Efeito prático

- Jogadores aposentados não aparecem por padrão.
- A consulta fica mais objetiva.
- O usuário só vê aposentados quando realmente quiser verificar esse grupo.

## 8. Resultado visual mais limpo em cards e headers

Além dos ajustes de navegação, a visualização de nomes e cartões foi mantida consistente com a nova proposta minimalista.

### Direção adotada

- Menos ações na tela de elenco.
- Mais foco na leitura dos nomes.
- Destaques visuais apenas quando realmente ajudam a entender o estado do jogador.

## 9. O que foi validado

As mudanças foram checadas com build de produção ao longo da implementação.

### Garantias mantidas

- O build continua passando.
- A lógica de sorteio não foi alterada.
- A persistência de elenco e resultado continua funcionando.

## 10. Próximo passo

O próximo passo planejado é transformar a aplicação em PWA.

### Direção para a próxima fase

- Tornar o app instalável no celular.
- Melhorar a experiência offline.
- Preparar o projeto para uso mais frequente durante o fut, com acesso rápido pelo ícone do aparelho.
