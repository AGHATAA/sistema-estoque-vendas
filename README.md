# 🛒 Sistema de Estoque e Vendas

Sistema web desenvolvido para **gerenciamento de produtos, controle de estoque e registro de vendas**, com integração entre uma interface web, uma API REST e banco de dados SQL Server.

O projeto foi desenvolvido com foco em colocar em prática conceitos de **desenvolvimento web, APIs, banco de dados relacionais, operações CRUD, integração entre front-end e back-end e controle de transações**.

---

## 📋 Sobre o projeto

O **Sistema de Estoque e Vendas** permite centralizar operações relacionadas ao cadastro de produtos, acompanhamento do estoque e realização de vendas.

A aplicação possui uma interface web desenvolvida em HTML, CSS e JavaScript, conectada a um back-end desenvolvido com Node.js e Express.

O sistema utiliza o **Microsoft SQL Server** para armazenamento dos usuários, produtos, vendas e itens das vendas.

### Principais áreas do sistema

- 🔐 Login
- 👤 Cadastro de usuários
- 📦 Cadastro de produtos
- 📊 Controle de estoque
- 🛒 Caixa registradora
- 💰 Registro de vendas
- 🗃️ Armazenamento dos dados no SQL Server

---

## ✨ Funcionalidades

### 🔐 Usuários

- Cadastro de novos usuários
- Validação de campos obrigatórios
- Verificação de e-mail já cadastrado
- Login utilizando e-mail e senha
- Armazenamento do usuário autenticado no `localStorage`

### 📦 Produtos

- Cadastro de produtos
- Identificação por código
- Controle de preço
- Controle de quantidade em estoque
- Ativação/inativação de produtos
- Consulta de produtos

### 📊 Estoque

- Visualização dos produtos cadastrados
- Consulta das quantidades disponíveis
- Atualização da quantidade após uma venda

### 🛒 Caixa

- Busca de produtos pelo código
- Definição da quantidade desejada
- Verificação de disponibilidade em estoque
- Adição de produtos ao carrinho
- Agrupamento de produtos repetidos
- Remoção de produtos da compra
- Cálculo automático dos subtotais
- Cálculo do valor total da compra
- Finalização da venda

### 💰 Vendas

Ao finalizar uma compra, o sistema:

1. Valida o usuário e os produtos.
2. Verifica se os produtos existem.
3. Verifica se estão ativos.
4. Verifica a quantidade disponível no estoque.
5. Calcula o valor total da venda.
6. Registra a venda.
7. Registra os itens da venda.
8. Atualiza o estoque.
9. Confirma a transação no banco de dados.

O processo utiliza **transações do SQL Server**, permitindo desfazer as operações caso ocorra um erro durante a finalização da venda.

---

## 🛠️ Tecnologias utilizadas

### Front-end

- HTML5
- CSS3
- JavaScript
- Fetch API
- LocalStorage

### Back-end

- Node.js
- Express.js
- CORS
- API REST

### Banco de dados

- Microsoft SQL Server
- SQL
- Transações
- Relacionamentos entre tabelas

### Ferramentas

- Visual Studio Code
- Git
- GitHub
- npm

---

## 🏗️ Arquitetura do projeto

O projeto utiliza uma estrutura separando a interface web do back-end da aplicação.

```text
sistema-estoque-vendas/
│
├── backend/
│   │
│   ├── src/
│   │   │
│   │   ├── config/
│   │   │   └── database.js
│   │   │
│   │   ├── routes/
│   │   │   ├── produtos.js
│   │   │   ├── usuarios.js
│   │   │   └── vendas.js
│   │   │
│   │   └── server.js
│   │
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
├── cadastro_produto.html
├── caixa_reg.html
├── estoque.html
├── index.html
├── login.html
├── .gitignore
└── README.md
```

---

## 🔄 Fluxo da aplicação

```text
                    ┌──────────────────┐
                    │     Usuário      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │      Login       │
                    │   / Cadastro     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Sistema Web     │
                    └────────┬─────────┘
                             │
             ┌───────────────┼────────────────┐
             │               │                │
             ▼               ▼                ▼
      ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
      │   Produtos  │ │   Estoque   │ │    Caixa    │
      └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
             │               │                │
             └───────────────┼────────────────┘
                             ▼
                    ┌──────────────────┐
                    │   API Express    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   SQL Server     │
                    └──────────────────┘
```

---

## 🗄️ Estrutura de dados

O sistema utiliza tabelas relacionadas para organizar os dados.

### Usuários

Armazena os usuários cadastrados no sistema.

Principais informações:

- `IdUsuario`
- `Nome`
- `Email`
- `Senha`

### Produtos

Armazena os produtos disponíveis no sistema.

Principais informações:

- `IdProduto`
- `Nome`
- `CodigoProduto`
- `Preco`
- `Quantidade`
- `Categoria`
- `Ativo`

### Vendas

Armazena os registros das vendas realizadas.

Principais informações:

- `IdVenda`
- `IdUsuario`
- `DataVenda`
- `ValorTotal`

### ItensVenda

Relaciona cada venda aos produtos vendidos.

Principais informações:

- `IdItemVenda`
- `IdVenda`
- `IdProduto`
- `Quantidade`
- `PrecoUnitario`
- `Subtotal`

---

## 🔌 Principais rotas da API

### Produtos

```text
GET /produtos
```

Consulta os produtos cadastrados.

### Usuários

```text
POST /usuarios
```

Realiza o cadastro de um usuário.

```text
POST /usuarios/login
```

Realiza o login.

### Vendas

```text
POST /vendas
```

Finaliza uma venda e realiza as operações necessárias no banco de dados.

Também existe uma rota para consulta de produto pelo código:

```text
GET /vendas/produto/:codigoProduto
```

---

## ⚙️ Como executar o projeto

### Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

- [Node.js](https://nodejs.org/)
- Microsoft SQL Server
- npm
- Git

---

### 1. Clone o repositório

```bash
git clone https://github.com/AGHATAA/sistema-estoque-vendas.git
```

Entre na pasta:

```bash
cd sistema-estoque-vendas
```

---

### 2. Entre no back-end

```bash
cd backend
```

---

### 3. Instale as dependências

```bash
npm install
```

---

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` dentro da pasta `backend`.

Exemplo:

```env
DB_SERVER=seu_servidor
DB_PORT=sua_porta
DB_DATABASE=SistemaEstoqueVendas
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
```

> ⚠️ O arquivo `.env` contém informações sensíveis e não deve ser enviado para o GitHub.

---

### 5. Inicie o servidor

```bash
npm start
```

Se estiver tudo configurado corretamente, o servidor será iniciado em:

```text
http://127.0.0.1:3000
```

A API deverá apresentar:

```text
API do Sistema de Estoque e Vendas funcionando!
```

---

## 🔒 Segurança

Informações sensíveis, como credenciais de acesso ao banco de dados, são armazenadas por meio de variáveis de ambiente.

O arquivo `.env` está incluído no `.gitignore` para evitar que credenciais sejam publicadas no repositório.

> Para um ambiente de produção, recomenda-se utilizar práticas adicionais de segurança, como hash de senhas, autenticação baseada em tokens, controle de permissões e gerenciamento seguro de secrets.

---

## 🤝 Colaboração

O projeto foi desenvolvido de forma colaborativa.

As páginas da interface web foram desenvolvidas com contribuição do colaborador responsável pela construção das páginas HTML, enquanto a evolução e integração do sistema foram realizadas posteriormente com apoio de ferramentas de Inteligência Artificial.

### Contribuições

- Desenvolvimento e estruturação das páginas HTML
- Construção e integração do back-end
- Integração com SQL Server
- Desenvolvimento das rotas da API
- Implementação do cadastro e login
- Implementação do controle de estoque
- Implementação do caixa e registro de vendas
- Integração entre front-end, API e banco de dados

---

## 🎯 Objetivos de aprendizado

Este projeto foi desenvolvido como uma aplicação prática para estudar e aplicar conceitos de:

- Desenvolvimento web
- JavaScript
- Node.js
- Express
- APIs REST
- SQL Server
- Banco de dados relacionais
- CRUD
- Transações
- Integração front-end e back-end
- Git e GitHub
- Organização de projetos

---

## 🚧 Próximas melhorias

Algumas melhorias podem ser implementadas futuramente, como:

- 🔐 Criptografia/hash das senhas
- 🔑 Autenticação com JWT
- 👥 Controle de permissões por usuário
- 📱 Melhorias adicionais de responsividade
- 📈 Dashboard de vendas
- 📊 Relatórios gerenciais
- 🔎 Filtros avançados no estoque
- 🧾 Histórico detalhado de vendas
- 🛡️ Melhorias de segurança da API
- 🧪 Testes automatizados

---

## Como executar

### Pré-requisitos

- Node.js
- SQL Server
- Git
- VS Code (recomendado)

### 1. Clone o projeto

git clone ...

### 2. Instale as dependências

cd backend
npm install

### 3. Configure o banco de dados

Crie o banco:
SistemaEstoqueVendas

Configure o arquivo .env com suas credenciais.

### 4. Inicie o backend

npm start

O servidor será iniciado em:

http://127.0.0.1:3000

### 5. Execute o frontend

Abra o index.html utilizando o Live Server.


## 👩‍💻 Autora

**Aghata Roberta Tavares Damasceno**

Estudante de Análise e Desenvolvimento de Sistemas, com foco em desenvolvimento de sistemas, banco de dados, SQL Server e análise de dados.

### 🔗 Links

- GitHub: https://github.com/AGHATAA
- LinkedIn: https://www.linkedin.com/in/aghata-roberta-damasceno

---

## 📌 Status do projeto

**Em desenvolvimento.**

O sistema possui as principais funcionalidades de cadastro, autenticação, gerenciamento de produtos, controle de estoque e registro de vendas implementadas.

## 🤝 Colaboradores

- Aghata Roberta Tavares Damasceno — desenvolvimento e integração do sistema
- Lucas — desenvolvimento das interfaces HTML
