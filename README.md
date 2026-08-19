# Estante Virtual

API REST para gerenciamento de um acervo de livros, desenvolvida com **Node.js, Express e MySQL**.

O projeto permite cadastrar, consultar, atualizar e remover livros através de uma API conectada a um banco de dados MySQL.

## 🚀 Funcionalidades

* Cadastro de livros
* Listagem de livros
* Busca de livro por ID
* Atualização de livros
* Remoção de livros
* Validação dos dados recebidos pela API
* Tratamento de erros
* Integração com banco de dados MySQL
* Utilização de variáveis de ambiente para proteger as credenciais do banco

## 🛠️ Tecnologias utilizadas

* **Node.js**
* **Express**
* **MySQL**
* **MySQL2**
* **dotenv**
* **JavaScript**
* **Git e GitHub**

## 🔌 Endpoints

| Método   | Endpoint      | Descrição                          |
| -------- | ------------- | ---------------------------------- |
| `GET`    | `/`           | Verifica se a API está funcionando |
| `GET`    | `/livros`     | Lista todos os livros              |
| `GET`    | `/livros/:id` | Busca um livro pelo ID             |
| `POST`   | `/livros`     | Cadastra um novo livro             |
| `PUT`    | `/livros/:id` | Atualiza um livro existente        |
| `DELETE` | `/livros/:id` | Remove um livro                    |

## 📋 Validações

A API possui validações para os dados enviados no cadastro e na atualização de livros.

Entre elas:

* título obrigatório;
* autor obrigatório;
* preço obrigatório;
* preço deve ser um número válido;
* preço deve ser maior que zero;
* quantidade obrigatória;
* quantidade deve ser um número válido;
* quantidade deve ser um número inteiro;
* quantidade não pode ser negativa;
* verificação de livro inexistente;
* tratamento de erros de conexão e consultas ao banco de dados.

## 🗄️ Banco de dados

A aplicação utiliza **MySQL** para armazenar os dados dos livros.

A conexão é realizada utilizando o pacote `mysql2` e as informações de acesso são carregadas através de variáveis de ambiente com `dotenv`.

As credenciais do banco não ficam diretamente no código-fonte.

## 🔐 Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as configurações do seu banco de dados:

```env
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=seu_banco
DB_PORT=3306
```

> O arquivo `.env` deve permanecer fora do repositório e estar incluído no `.gitignore`.

## ▶️ Como executar

### 1. Clone o repositório

```bash
git clone https://github.com/ViniciusMou/Estante-Virtual.git
```

### 2. Acesse a pasta

```bash
cd Estante-Virtual
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure o banco de dados

Crie o banco de dados MySQL e configure as variáveis de ambiente no arquivo `.env`.

### 5. Inicie o servidor

```bash
node server.js
```

Se a conexão com o banco estiver correta, o terminal deverá informar que o servidor está rodando e que a conexão com o MySQL foi realizada.

A API estará disponível em:

```text
http://localhost:3000
```

## 🎯 Objetivo do projeto

A Estante Virtual começou como um projeto de estudo em JavaScript e evoluiu para uma **API REST utilizando Node.js, Express e MySQL**.

O projeto foi desenvolvido para colocar em prática conceitos de desenvolvimento backend, incluindo:

* criação de APIs REST;
* métodos HTTP;
* rotas e parâmetros;
* operações CRUD;
* integração com banco de dados;
* consultas SQL;
* validação de dados;
* tratamento de erros;
* variáveis de ambiente;
* organização de código;
* utilização do Git e GitHub.

## 📌 Status

**Em desenvolvimento.**

O projeto continuará evoluindo com novas funcionalidades e melhorias conforme o aprendizado em desenvolvimento backend.
