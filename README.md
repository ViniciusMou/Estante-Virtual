# Estante Virtual

API REST para gerenciamento de um acervo de livros, desenvolvida com **Node.js, Express e MySQL**.

O projeto permite cadastrar, consultar, buscar, atualizar, remover e registrar a venda de livros por meio de uma API conectada ao MySQL.

## 🚀 Funcionalidades

- Cadastro de livros
- Listagem de livros
- Busca de livros por ID
- Busca por título ou autor
- Paginação dos resultados
- Atualização de livros
- Remoção de livros
- Registro de vendas
- Controle de estoque
- Contagem de unidades vendidas
- Bloqueio de vendas sem estoque
- Validação dos dados recebidos
- Tratamento de erros
- Proteção das credenciais com variáveis de ambiente

## 🛠️ Tecnologias utilizadas

- **Node.js**
- **Express**
- **JavaScript**
- **MySQL**
- **MySQL2**
- **dotenv**
- **Git e GitHub**

## 🔌 Endpoints

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/` | Verifica se a API está funcionando |
| `GET` | `/livros` | Lista livros com busca e paginação |
| `GET` | `/livros/:id` | Busca um livro pelo ID |
| `POST` | `/livros` | Cadastra um novo livro |
| `POST` | `/livros/:id/vender` | Registra uma venda e atualiza o estoque |
| `PUT` | `/livros/:id` | Atualiza um livro existente |
| `DELETE` | `/livros/:id` | Remove um livro |

## 🔎 Busca e paginação

A rota `GET /livros` aceita os seguintes parâmetros de consulta:

| Parâmetro | Descrição | Valor padrão |
| --- | --- | --- |
| `busca` | Busca pelo título ou autor | — |
| `pagina` | Define a página dos resultados | `1` |
| `limite` | Define a quantidade de resultados por página | `20` |

O limite máximo permitido é de 100 livros por página.

Exemplo:

```http
GET /livros?busca=Hobbit&pagina=1&limite=10
```

## 💰 Registro de venda

A rota abaixo registra a venda de uma unidade:

```http
POST /livros/:id/vender
```

Quando a venda é realizada:

- a quantidade disponível diminui em uma unidade;
- o número de unidades vendidas aumenta em uma unidade;
- a venda é impedida quando o estoque está zerado;
- a API retorna erro quando o livro não existe.

Exemplo de resposta:

```json
{
  "mensagem": "Venda registrada com sucesso!"
}
```

## ✅ Validações

A API possui validações para os dados recebidos:

- título e autor são obrigatórios;
- preço deve ser um número válido e maior que zero;
- quantidade deve ser um número inteiro maior ou igual a zero;
- página e limite devem ser números inteiros maiores que zero;
- limite máximo de 100 livros por página;
- verificação da existência do livro;
- verificação de estoque antes da venda;
- bloqueio de vendas quando o estoque está zerado;
- tratamento de erros de banco de dados.

## 🗄️ Banco de dados

O projeto utiliza MySQL para armazenar os livros.

A aplicação acessa o banco com o pacote `mysql2`. As credenciais de conexão são carregadas por meio de variáveis de ambiente com o `dotenv`.

## 🔐 Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=sua_senha
DB_DATABASE=estante_virtual
DB_PORT=3306
```

O arquivo `.env` contém informações sensíveis e não deve ser enviado ao GitHub.

## ▶️ Como executar

### 1. Clone o repositório

```bash
git clone https://github.com/ViniciusMou/estante-virtual.git
```

### 2. Entre na pasta

```bash
cd estante-virtual
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure o banco

Crie o banco de dados no MySQL e configure as informações de conexão no arquivo `.env`.

### 5. Inicie a API

```bash
node server.js
```

A API ficará disponível em:

```text
http://localhost:3000
```

## 🎯 Objetivo

A Estante Virtual foi criada para colocar em prática conceitos de desenvolvimento backend por meio de um projeto com aplicação real.

Durante o desenvolvimento, são trabalhados conceitos como:

- criação de APIs REST;
- métodos e status HTTP;
- rotas e parâmetros;
- operações CRUD;
- consultas e integração com MySQL;
- busca e paginação;
- validação de dados;
- controle de estoque e vendas;
- tratamento de erros;
- variáveis de ambiente;
- versionamento com Git e GitHub.

## 📌 Status

**Em desenvolvimento.**

O projeto continuará recebendo melhorias conforme a evolução dos estudos em desenvolvimento backend.