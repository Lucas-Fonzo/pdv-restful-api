# desafio-backend-05-pdv
![](https://i.imgur.com/xG74tOh.png)

# Desafio Módulo 5 - Backend

Seja bem vindo(a) ao desafio do módulo 5.

Sua tarefa como desenvolvedor(a) será criar uma API para um PDV (Frente de Caixa). Esse será um projeto piloto, ou seja, no futuro outras funcionalidades serão implementadas.


**Importante 1: O diretório ".github" e seu conteúdo não podem ser alterados e muito menos excluídos**

**Importante 2: Sempre que a validação de uma requisição falhar, responda com código de erro e mensagem adequada à situação, ok?**

**Importante 3: Para endpoints de cadastro/atualização os objetos de requisição devem conter as propriedades equivalentes as colunas das tabelas.**

**Exemplo:**

```javascript
// Corpo da requisição para cadastro de usuário (body)
{
    "nome": "José",
    "email": "jose@email.com",
    "senha": "jose"
}
```

**ATENÇÃO: Todos os endpoints deverão atender os requisitos citados acima.**

## **Banco de dados**

Você precisa criar um Banco de Dados PostgreSQL chamado `pdv`.

**IMPORTANTE: Deverá ser criado no projeto o arquivo SQL que deverá ser o script contendo os comandos de criação das tabelas respeitando os nomes das tabelas e colunas respectivamente, além de, conter os comandos para a inserção das categorias que devem ser previamente cadastradas (estão citadas na 1ª Sprint no item Listar Categorias).**

## **Requisitos obrigatórios**

-   A API a ser criada deverá acessar o banco de dados a ser criado `pdv` para persistir e manipular os dados de categorias, clientes, pedidos, produtos e usuários utilizados pela aplicação.
-   O campo id das tabelas no banco de dados deve ser auto incremento, chave primária e não deve permitir edição uma vez criado.
-   Qualquer valor monetário deverá ser representado em centavos (Ex.: R$ 10,00 reais = 1000)

## **Status Codes**

Abaixo, listamos os possíveis **_status codes_** esperados como resposta da API.

```javascript
// 200 (OK) = requisição bem sucedida
// 201 (Created) = requisição bem sucedida e algo foi criado
// 204 (No Content) = requisição bem sucedida, sem conteúdo no corpo da resposta
// 400 (Bad Request) = o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido
// 401 (Unauthorized) = o usuário não está autenticado (logado)
// 403 (Forbidden) = o usuário não tem permissão de acessar o recurso solicitado
// 404 (Not Found) = o servidor não pode encontrar o recurso solicitado
// 500 (Internal Server Error) = erro inesperado do servidor
```

<details>
<summary>1ª Sprint</summary>
<br>

<details>
<summary><b>Banco de Dados</b></summary>
<br>

Crie as seguintes tabelas e colunas abaixo: 

**ATENÇÃO! Os nomes das tabelas e das colunas a serem criados devem seguir exatamente os nomes listados abaixo.**

-   usuarios
    -   id
    -   nome
    -   email (campo único)
    -   senha
-   categorias
    -   id
    -   descricao

</details>

<details>
<summary><b>Listar categorias</b></summary>

#### `GET` `/categoria`

Essa é a rota que será chamada quando o usuário quiser listar todas as categorias cadastradas.

As categorias a seguir precisam ser previamente cadastradas para que sejam listadas no endpoint de listagem das categorias.

## **Categorias**

-   Informática
-   Celulares
-   Beleza e Perfumaria
-   Mercado
-   Livros e Papelaria
-   Brinquedos
-   Moda
-   Bebê
-   Games

</details>

<details>
<summary><b>Cadastrar usuário</b></summary>

#### `POST` `/usuario`

Essa é a rota que será utilizada para cadastrar um novo usuário no sistema.

Critérios de aceite:

    - Validar os campos obrigatórios: 
        - nome
        - email
        - senha
    - A senha deve ser criptografada utilizando algum algoritmo de criptografia confiável.
    - O campo e-mail no banco de dados deve ser único para cada registro, não permitindo dois usuários possuírem o mesmo e-mail.

</details>

<details>
<summary><b>Efetuar login do usuário</b></summary>

#### `POST` `/login`

Essa é a rota que permite o usuário cadastrado realizar o login no sistema.

Critérios de aceite:

    - Validar se o e-mail e a senha estão corretos para o usuário em questão.
    - Gerar um token de autenticação para o usuário.

</details>

<details>
<summary><b>Redefinir senha do usuário</b></summary>

#### `PATCH` `/usuario/redefinir`

Essa é a rota que permite o usuário cadastrado redefinir a senha.

Critérios de aceite:

    - Validar os campos obrigatórios: 
        - email
        - senha_antiga
        - senha_nova
    - A senha antiga não pode ser igual a senha nova.
    - Validar se o e-mail e a senha antiga estão corretos para o usuário em questão.
    - Alterar a senha no banco de dados para a nova senha informada.
    - Como forma de segurança, enviar e-mail alertando o usuário que a senha foi alterada.

</details>

---

## **ATENÇÃO**: Todas as funcionalidades (endpoints) a seguir, a partir desse ponto, deverão exigir o token de autenticação do usuário logado, recebendo no header com o formato Bearer Token. Portanto, em cada funcionalidade será necessário validar o token informado.

---

<details>
<summary><b>Detalhar perfil do usuário logado</b></summary>

#### `GET` `/usuario`

Essa é a rota que permite o usuário logado a visualizar os dados do seu próprio perfil, de acordo com a validação do token de autenticação.

</details>

<details>
<summary><b>Editar perfil do usuário logado</b></summary>

#### `PUT` `/usuario`

Essa é a rota que permite o usuário logado atualizar informações de seu próprio cadastro, de acordo com a validação do token de autenticação.

Critérios de aceite:

    - Validar os campos obrigatórios: 
        - nome
        - email
        - senha
    - A senha deve ser criptografada utilizando algum algoritmo de criptografia confiável.
    - O campo e-mail no banco de dados deve ser único para cada registro, não permitindo dois usuários possuírem o mesmo e-mail.

</details>

<details>
<summary><b>Efetuar deploy da aplicação</b></summary>
<br>

Fazer deploy do projeto e disponibilizar a URL para o líder técnico.

</details>

</details>

---

## Aulas úteis:

-   [Git e fluxo de trabalho em equipe](https://aulas.cubos.academy/turma/73903d2c-8b7c-47d3-82dd-c4adc00a61f9/aulas/d0e2ddf7-825d-4f57-9711-c724d89907d6)
-   [Envio de e-mails](https://aulas.cubos.academy/turma/73903d2c-8b7c-47d3-82dd-c4adc00a61f9/aulas/a79dfe9d-1310-451e-9b3d-24abb227ae51)
-   [Validações e boas práticas](https://aulas.cubos.academy/turma/73903d2c-8b7c-47d3-82dd-c4adc00a61f9/aulas/87ad0871-c643-41da-b286-1fccc266d8dc)
-   [Deploy](https://aulas.cubos.academy/turma/8e525417-a33a-46f6-9476-9fcdfe375f99/aulas/36da6c7a-cd72-4519-8d18-54b9e873be1f)
-   [Revisão de deploy](https://aulas.cubos.academy/turma/73903d2c-8b7c-47d3-82dd-c4adc00a61f9/aulas/8bc52018-acc3-4469-9b69-e4810e56dda3)
-   [Upload de arquivos](https://aulas.cubos.academy/turma/73903d2c-8b7c-47d3-82dd-c4adc00a61f9/aulas/51cf4150-b269-4d78-aaa8-9394a30eaae6)

###### tags: `back-end` `módulo 5` `nodeJS` `PostgreSQL` `API REST` `desafio`
