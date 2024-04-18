# LinguifAI
Projeto NLP 2 - 2023.2

## O que é o LinguifAI?
O LinguifAI nasceu na liga estudantil de Inteligência Artificial da Universidade Federal da Paraíba: Tech Artificial Inteligence League, a TAIL. O sistema foi idealizado tendo como base o objetivo de tornar o Processamento de Linguagem Natural mais acessível e prático, seja para os que não tem conhecimento aprofundado a respeito da área, ou apenas para usuários que buscam a praticidade de uma interface na execução de atividades relacionadas.

A partir disso, foi desenvolvida uma aplicação desktop que permite a utilização de uma interface na qual é possível a seleção de arquivos .csv de forma a serem utilizados para classificação ou treinamento de uma rede neural. O LinguifAI permite a classificação através da seleção de colunas específicas do arquivo e de seu classificador, e o treinamento através da coluna de entrada, coluna de label e parâmetros avançados, como Batch Size, Épocas e Taxa de Aprendizado.

## Tecnologias utilizadas:
O projeto utiliza das seguintes tecnologias e ferramentas:

### Front-End
* React
* React-Router
* Axios
* ElectronJs
* Tailwind

### Back-End
* Python
* Flask

## Como rodar a aplicação:

Primeiramente, instale as depencencias:

```bash
yarn
# ou
npm install
```

Após a conclusão da instalação, crie uma build para produção do front-end:

```bash
yarn build
# ou
npm run build
```

Por fim inicie o electron:

```bash
yarn electron
# ou
npm run electron
```

### To-do

#### 🚀 Tasks

- [x] Abrir CSV
- [x] Exibir Preview de N linhas do CSV
- [x] Escolher colunas de entrada
- [X] Selecionar classificador e enviar dados
- [x] Exibir resultado do classificador
- [x] Exportar resultado em csv?