<<<<<<< HEAD
## CHAT-APP

A full‑stack chat application with a React (Vite) client and an Express/MongoDB server, integrated with Stream Chat for real‑time messaging and video.

### Monorepo layout

- `client/`: React app (Vite)
- `server/`: Express API, MongoDB, JWT auth, Stream Chat integration

See detailed guides:

- Client README: `client/README.md`
- Server README: `server/README.md`

## Prerequisites

- Node.js 18+ and npm
- MongoDB (Atlas or local)
- Stream Chat account and API keys

## Quick start

1) Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

2) Configure environment variables

Create `server/.env` with:

```bash
PORT=8080
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-strong-secret
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
NODE_ENV=development
```

Create `client/.env` with:

```bash
VITE_STREAM_API_KEY=your_stream_api_key
# Optional: if you switch axios to env-based config
# VITE_API_URL=http://localhost:8080
```

Notes:
- The client axios is currently configured to call `http://localhost:8080` in dev. Set `PORT=8080` on the server to match.
- CORS is configured to allow `http://localhost:5173` with credentials.

3) Run dev servers (two terminals)

Terminal A (API):

```bash
cd server
npm start
```

Terminal B (Client):

```bash
cd client
npm run dev
```

Open the client at the URL Vite prints (default `http://localhost:5173`).

## API overview

Base URL: `http://localhost:8080`

- `POST /auth/register`
  - body: `{ fullName, email, password }`
  - sets httpOnly auth cookie and returns user data

- `POST /auth/login`
  - body: `{ email, password }`
  - sets httpOnly auth cookie and returns user data

- `GET /auth/logout`
  - clears auth cookie

- `GET /auth/me` (auth)
  - returns authenticated user

- `POST /auth/onboarding` (auth)
  - body: `{ fullName, bio, profilePicture, nativeLanguage, learningLanguage, location }`

- `GET /user/recommended` (auth)
- `GET /user/friends` (auth)
- `POST /user/friend-request/:id` (auth)
- `POST /user/friend-request/:id/accept` (auth)
- `DELETE /user/friend-request/:id/cancel` (auth)
- `DELETE /user/friend/:id/remove` (auth)
- `GET /user/friend-requests` (auth)
- `GET /user/outgoing-friend-requests` (auth)

- `GET /chat/token` (auth)
  - returns a Stream Chat user token for the authenticated user

Auth is enforced via the `token` httpOnly cookie (JWT), validated by `protectedRoute` middleware.

## Client configuration

- Stream client uses `VITE_STREAM_API_KEY` via `client/src/lib/streamClient.js`.
- Axios base URL is computed in `client/src/axios-config/axios.js` and defaults to `http://localhost:8080` in development.

## Server scripts

From `server/package.json`:

```json
{
  "scripts": {
    "start": "npx nodemon server.js"
  }
}
```

The server entry boots `server/app.js` through `server/server.js` and listens on `process.env.PORT` (set to 8080 above).

## Troubleshooting

- 401 Unauthorized: ensure the `token` cookie is set; calls requiring auth need `withCredentials: true` (already configured in axios).
- CORS issues: confirm server `CORS` allows `http://localhost:5173` and credentials, and client calls include credentials.
- Stream errors: verify `STREAM_API_KEY`/`STREAM_API_SECRET` and that the user exists in Stream (created on register/onboarding).

## License

ISC (as per `server/package.json`).


=======
# Chat-App
A chat app with video call feature
>>>>>>> 0cf8547742adc57fdbd39268de1304c3af142d25
