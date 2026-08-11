# JacacultMap

JacacultMap é uma plataforma para explorar e divulgar pontos e eventos culturais de uma região. O projeto é composto por um **aplicativo mobile** (React Native) e uma **API back-end** (Node.js/Express) que trabalham juntos para facilitar o acesso a eventos, espaços e informações culturais diretamente pelo celular, promovendo a cultura local de forma prática e acessível.

## Funcionalidades

- **Exploração de eventos** com busca por texto e filtros por categoria (social, turístico, intelectual, físico, artístico, virtual e gastronômico)
- **Página inicial** com destaques ("Novidades") e listagem paginada de eventos
- **Calendário de eventos** com navegação mensal e destaque de dias com eventos/favoritos
- **Favoritos**: marcar eventos como favoritos e visualizar a lista completa
- **Perfil personalizado** com foto de perfil (câmera/galeria) e dados do usuário (disponível apenas na versão mobile atualmente)
- **Seleção de interesses** para personalizar a experiência do usuário
- **Cadastro e login** com e-mail/senha ou **login com Google** (OAuth)
- **Área administrativa** para criação de eventos com imagens (banner, cabeçalho e até 3 imagens adicionais) e coordenadas geográficas
- **Tema claro/escuro** e interface responsiva para Android, iOS e web
- **Tela de status** que verifica a conexão com a API e tenta reconectar automaticamente

## Estrutura do Projeto

```
jacacultmap/
├── jacacultmap-app/       # Aplicativo mobile (React Native / Expo)
└── jacacultmap-backend/   # API back-end (Node.js / Express)
```

### Aplicativo (`jacacultmap-app/`)

- React Native + Expo (SDK 57) com expo-router para navegação
- TypeScript e NativeWind/Tailwind CSS para estilização
- Suporte a Android, iOS e Web (responsivo)

### Back-end (`jacacultmap-backend/`)

- Node.js + Express com autenticação JWT e bcrypt
- MongoDB (Mongoose) com índice geoespacial (`2dsphere`) para localização
- Login OAuth com Google e proteção CSRF via `express-session`

## Tecnologias Utilizadas

### Front-end

- [React Native](https://reactnative.dev/) e [Expo](https://expo.dev/)
- [expo-router](https://docs.expo.dev/router/introduction/) para navegação
- [NativeWind](https://www.nativewind.dev/) + [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/) para requisições HTTP
- [react-native-image-picker](https://github.com/react-native-image-picker/react-native-image-picker) para seleção de imagens

### Back-end

- [Node.js](https://nodejs.org/) e [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) com [Mongoose](https://mongoosejs.com/)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) e [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [google-auth-library](https://github.com/googleapis/google-auth-library-nodejs) para login com Google

## Como Executar

### Back-end

```bash
cd jacacultmap-backend
npm install
cp .env.example .env   # configure as variáveis de ambiente (ver abaixo)
npm run dev            # modo desenvolvimento (nodemon)
npm start              # modo produção
```

A API ficará disponível em `http://localhost:3000`.

### Aplicativo

```bash
cd jacacultmap-app
npm install
npx expo start         # iniciar o Expo
```

A partir do menu do Expo você pode abrir o app no Android, iOS ou no navegador (web).

> **Observação:** a URL da API utilizada pelo app é configurada em `app.json` (campo `extra.apiUrl`). Ajuste-a conforme o seu ambiente.

## Variáveis de Ambiente (Back-end)

Crie um arquivo `.env` na raiz de `jacacultmap-backend/` com as seguintes variáveis:

| Variável | Descrição |
| --- | --- |
| `PORT` | Porta do servidor (padrão: 3000) |
| `DATABASE_URL_CLUSTER_0` | String de conexão do MongoDB Atlas |
| `DB_NAME` | Nome do banco de dados |
| `JWT_SECRET` | Chave secreta para assinar os tokens JWT |
| `EXPRESS_SESSION_SECRET` | Chave secreta da sessão (OAuth/CSRF) |
| `DEVELOPMENT_URL_BACKEND` | URL do back-end em desenvolvimento |
| `DEVELOPMENT_URL_FRONTEND` | URL do front-end em desenvolvimento |
| `PRODUCTION_URL_FRONTEND` | URL do front-end em produção |
| `GOOGLE_CLIENT_ID` | Client ID do Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Client Secret do Google OAuth |

## Rotas da API

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/status` | Verifica o status da API |
| `GET` | `/` | Rota padrão (boas-vindas) |
| `POST` | `/signup` | Cadastro de usuário |
| `POST` | `/signin` | Login de usuário |
| `GET` | `/auth/google` | Inicia o fluxo de login com Google |
| `GET` | `/auth/google/callback` | Callback do OAuth do Google |
| `POST` | `/auth/google/useCode` | Troca o código de autorização pelo token |
| `GET` | `/tokenValidation` | Valida o token JWT |
| `GET` | `/get-user-data` | Retorna os dados do usuário autenticado |
| `POST` | `/update-user-data` | Atualiza dados do usuário |
| `GET` | `/events` | Lista eventos paginados |
| `GET` | `/events/:id` | Retorna um evento específico |
| `POST` | `/send-event` | Cria um novo evento (requer autenticação) |
| `POST` | `/upload-photo` | Envio de foto |
| `GET` | `/get-image-b64` | Recupera imagem em Base64 |

## Modelos de Dados

- **Usuários**: nome, e-mail, senha (hash), provedor de autenticação (`local`/`google`), papel (`user`, `event-manager` ou `admin`), foto de perfil, eventos favoritos, categorias favoritas e amigos
- **Eventos**: título, descrição, tipo (social, turístico, intelectual, físico, artístico, virtual, gastronômico), imagens (banner, cabeçalho e adicionais em Base64), data, localização (nome e coordenadas) e e-mail do criador

## Implantação

- **Front-end:** hospedado na [Vercel](https://vercel.com/) (`jacacultmap-app.vercel.app`) e também distribuído como app nativo via [EAS Build](https://expo.dev/eas)
- **Back-end:** hospedado no render

## Licença

Este projeto não possui licença definida. Consulte o mantenedor para mais informações.