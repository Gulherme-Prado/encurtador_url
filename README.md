# URL Shortener API – Backend

API RESTful para encurtamento de URLs.  
Usuários autenticados podem listar, editar e remover seus próprios links.
Listagem inclui contagem de clicks no link encurtado.
Usuários anônimos podem apenas encurtar e acessar URLs.

---

## Tecnologias

- NestJS
- TypeScript
- TypeORM + PostgreSQL
- JWT para autenticação
- Docker + Docker Compose
- Swagger para documentação

---

## Como rodar o projeto (Docker)

### 1. Clone o repositório:

```bash
git clone https://github.com/Gulherme-Prado/encurtador_url
cd encurtador_url
```

### 2. Copie e edite o .env:

```bash
cp .env.example .env
Preencha com os dados necessários (informações do banco de dados, JWT_SECRET etc.)
```

### 3. Rode a aplicação com Docker Compose:

```bash
docker-compose up --build
```

### 4. Testes Unitários

```bash
npm install
npm run test
```

## Variáveis de ambiente (.env)

Veja .env.example, exemplo:

```bash
.env
DB_HOST=db  # Use 'db' se for usar docker-compose; 'localhost' se for rodar o Postgres localmente
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=url_shortener

JWT_SECRET=sua_chave_secreta
PORT=3000
```

## Documentação Swagger

Após subir o projeto, acesse:
http://localhost:3000/api

```bash
Endpoints principais:

POST /auth/register --- Criação de usuário

POST /auth/login	--- Login e geração de token

POST /urls/shorten --- Encurtar URL

GET /urls --- Listar URLs do usuário

PUT /urls/:id --- Atualizar URL

DELETE /urls/:id --- Deletar URL

GET /:shortCode	--- Redirecionamento
```

## Possíveis melhorias para escalar horizontalmente

1. **Garantir que as URLs curtas sejam únicas:**

   - Atualmente, o código é gerado com `nanoid()`, que é confiável para instâncias únicas.
   - Em múltiplas instâncias, poderíamos reforçar isso com validação no banco antes de salvar.

2. **Evitar concorrência em atualizações frequentes:**
   - No futuro, caso o número de acessos cresça muito, seria interessante usar uma fila (queue) para registrar cliques em segundo plano.
   - Isso evita que múltiplas instâncias concorram ao salvar no banco ao mesmo tempo, e melhora a performance geral.

## Principais desafios nessa escalabilidade:

- **Evitar conflito de URLs encurtadas entre instâncias**
- **Gerenciar deploys sem quebrar URLs já geradas**
- **Garantir que o banco de dados suporte o volume de escrita/leitura**
