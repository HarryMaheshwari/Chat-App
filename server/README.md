## CHAT-APP — Server (Express + MongoDB)

Express API for authentication, users/friends, and Stream Chat token issuance.

### Requirements

- Node.js 18+
- MongoDB (Atlas or local)

### Install

```bash
npm install
```

### Environment

Create `.env` in this `server/` folder:

```bash
PORT=8080
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-strong-secret
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
NODE_ENV=development
```

### Run

```bash
npm start
# starts with nodemon -> server.js -> app.js
```

Server listens on `process.env.PORT` (default 3000, recommended 8080 to match client axios).

### CORS

Configured in `app.js` to allow:

- origin: `http://localhost:5173`
- credentials: true

Ensure the client uses `withCredentials: true` (already set in axios instance).

### Routes

Base URL: `http://localhost:8080`

- Auth (`/auth`)
  - `POST /register` — `{ fullName, email, password }` → sets httpOnly cookie
  - `POST /login` — `{ email, password }` → sets httpOnly cookie
  - `GET /logout` — clears cookie
  - `GET /me` — returns authenticated user (requires cookie)
  - `POST /onboarding` — requires auth, updates profile and flags `isOnBoard`

- User (`/user`) — all require auth
  - `GET /recommended`
  - `GET /friends`
  - `POST /friend-request/:id`
  - `POST /friend-request/:id/accept`
  - `DELETE /friend-request/:id/cancel`
  - `DELETE /friend/:id/remove`
  - `GET /friend-requests`
  - `GET /outgoing-friend-requests`

- Chat (`/chat`)
  - `GET /token` — returns Stream Chat user token for `req.user`

### Auth

JWT is stored in an httpOnly cookie named `token`. The `protectedRoute` middleware validates it using `JWT_SECRET` and loads `req.user` from MongoDB.

### Stream Chat

Configured in `stream/stream-config.js` using `STREAM_API_KEY` and `STREAM_API_SECRET`.
- New or updated users are upserted to Stream during register/onboarding.
- Client requests `/chat/token` to obtain a user token for connecting the Stream SDK.

### Troubleshooting

- 401 Unauthorized: cookie missing/expired; re-login and ensure requests include credentials.
- CORS: check `origin` and `credentials` settings and client axios config.
- MongoDB connection: verify `MONGO_URI` and database network rules.
- Stream errors: ensure API key/secret are correct and environment allows server‑side secret usage.

