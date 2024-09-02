# Documentação do Projeto

## Visão Geral
Este projeto é uma API RESTful construída usando Node.js e Express, com integração ao banco de dados PostgreSQL e gerenciamento de autenticação via JWT. A API oferece funcionalidades para gerenciar usuários, clientes, produtos, categorias e pedidos.

## Estrutura do Projeto

### Arquivos e Diretórios Principais

- **index.js**: Ponto de entrada da aplicação, onde o servidor é inicializado.
- **configs.js**: Configurações da aplicação, incluindo variáveis de ambiente.
- **conexao.js**: Configura a conexão com o banco de dados usando o `pg` e `knex`.
- **rotas.js**: Define todas as rotas da API e associa aos controladores.
- **autenticacao.js**: Middleware responsável por verificar o token JWT nas requisições protegidas.
- **vercel.json**: Arquivo de configuração para deploy na plataforma Vercel.
- **controladores**: Contém os controladores que lidam com a lógica das diferentes entidades, como `Usuario`, `Cliente`, `Produto`, `Categoria`, e `Pedido`.
- **categorias.sql**: Script SQL para criar a tabela de categorias no banco de dados.
- **tabela.sql**: Script SQL para criar as tabelas do banco de dados.
- **.gitignore**: Arquivo que especifica quais arquivos e diretórios devem ser ignorados pelo Git.
- **README.md**: Arquivo principal de documentação do projeto.

### Dependências Principais

- **express**: Framework para construção de APIs em Node.js.
- **pg**: Cliente PostgreSQL para Node.js.
- **knex**: Query builder para SQL.
- **bcrypt**: Biblioteca para criptografia de senhas.
- **jsonwebtoken**: Biblioteca para geração e verificação de tokens JWT.
- **dotenv**: Carrega variáveis de ambiente de um arquivo `.env`.
- **nodemailer**: Biblioteca para envio de e-mails.
## Configuração e Execução

### Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para configurar a aplicação. As seguintes variáveis devem estar definidas no arquivo `.env`:

- `SERVER_PORT`: Porta onde o servidor irá rodar.
- `JWT_SECRET`: Segredo usado para gerar tokens JWT.
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: Detalhes de conexão com o banco de dados PostgreSQL.
- `KEY_ID`, `APP_KEY`, `BUCKET`, `ENDPOINT_S3`: Variáveis relacionadas ao armazenamento S3.
- `EMAIL_USER`, `EMAIL_PASS`: Credenciais do serviço de e-mail usado para envio de notificações.
- `BASE_URL`: URL base do sistema, utilizada para construção de links nos e-mails.

### Inicializando o Servidor

Para iniciar o servidor, execute o seguinte comando:


node index.js
O servidor será inicializado na porta definida na variável de ambiente `SERVER_PORT` (ou na porta 3000, caso não esteja definida).

### Configuração do Banco de Dados

Os scripts SQL encontrados em `categorias.sql` e `tabela.sql` devem ser executados no banco de dados para criar as tabelas necessárias.

- **categorias.sql**: Cria a tabela de categorias.
- **tabela.sql**: Cria as demais tabelas necessárias para o funcionamento da API.

### Middleware de Autenticação

O middleware `autenticacao.js` verifica se o token JWT fornecido nas requisições é válido e, caso seja, permite que a requisição prossiga. Caso contrário, retorna uma resposta de erro 401.


## Rotas e Funcionalidades

## **ATENÇÃO**: Todas as funcionalidades (endpoints) a seguir, a partir desse ponto, deverão exigir o token de autenticação do usuário logado, recebendo no header com o formato Bearer Token. Portanto, em cada funcionalidade será necessário validar o token informado.

### Usuário

- **POST /login**: Realiza o login do usuário e retorna um token JWT.
- **POST /usuario**: Cadastra um novo usuário.
- **GET /usuario**: Retorna os detalhes do usuário autenticado.
- **PUT /usuario**: Atualiza os dados do usuário autenticado.
- **PATCH /usuario/redefinir**: Permite ao usuário redefinir sua senha. 


### Cliente

- **POST /cliente**: Cadastra um novo cliente.
- **GET /cliente**: Lista todos os clientes.
- **GET /cliente/:id**: Obtém os detalhes de um cliente específico.
- **PUT /cliente/:id**: Atualiza os dados de um cliente específico.

### Produto

- **POST /produto**: Cadastra um novo produto.
- **GET /produto**: Lista todos os produtos, com opção de filtrar por categoria.
- **GET /produto/:id**: Obtém os detalhes de um produto específico.
- **PUT /produto/:id**: Atualiza os dados de um produto específico.
- **DELETE /produto/:id**: Exclui um produto.
- **PATCH /produto/:id/imagem**: Atualiza a imagem de um produto.

### Categoria

- **GET /categoria**: Lista todas as categorias.

### Pedido

- **POST /pedido**: Cadastra um novo pedido.
- **GET /pedido**: Lista todos os pedidos, com opção de filtrar por cliente.

---



## Contribuindo

### Como Contribuir

1. Faça um fork deste repositório.
2. Crie uma nova branch (`git checkout -b feature/nova-funcionalidade`).
3. Faça suas alterações e commit (`git commit -m 'Adiciona nova funcionalidade'`).
4. Envie para a branch original (`git push origin feature/nova-funcionalidade`).
5. Abra um Pull Request.

### Padrões de Código

O projeto segue os padrões de código recomendados para projetos Node.js, usando ESLint para garantir a qualidade e consistência do código.

## Deployment

### Render

O projeto está configurado para ser implantado na plataforma Render. 

Para acessar a API no ambiente de produção, use o seguinte link: [https://desafio-backend-final-dds-t16-grupo-8.onrender.com](https://desafio-backend-final-dds-t16-grupo-8.onrender.com).
