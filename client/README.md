## CHAT-APP — Client (React + Vite)

This is the React client for the CHAT-APP. It uses Vite, React 19, Tailwind, Zustand, React Query, and Stream Chat UI SDKs.

### Scripts

```bash
npm run dev       # start Vite dev server
npm run build     # build for production
npm run preview   # preview built app locally
npm run lint      # run ESLint
```

### Environment

Create `.env` in this `client/` folder:

```bash
VITE_STREAM_API_KEY=your_stream_api_key
# Optional: switch axios to env-based config if desired
# VITE_API_URL=http://localhost:8080
```

Stream key is required for initializing the web SDK in `src/lib/streamClient.js`.

### API base URL (axios)

`src/axios-config/axios.js` computes the base URL:

```js
// localhost: uses http://localhost:8080
// non-localhost: replace with your LAN IP if testing across devices
```

If you prefer using env variables, you can switch to the commented `VITE_API_URL` implementation in that file.

### Development

1) Install dependencies:

```bash
npm install
```

2) Start the dev server:

```bash
npm run dev
```

Default URL: `http://localhost:5173`

Ensure the API server runs at `http://localhost:8080` (or update axios base URL accordingly).

### Project structure (client)

- `src/`
  - `assets/` — images, lotties, logos
  - `axios-config/axios.js` — axios instance with credentials
  - `components/` — UI components
  - `configurations/` — app-level config
  - `hooks/` — custom hooks (auth/user status)
  - `lib/` — helpers, Stream client
  - `pages/` — route pages (Chat, Friends, Auth, etc.)
  - `store/` — Zustand stores (theme selector, etc.)

### Troubleshooting

- 401 Unauthorized or no cookie: API requires credentials. `axiosInstance` already sets `withCredentials: true`.
- CORS error: the server must allow `http://localhost:5173` and credentials.
- Stream errors (invalid key): confirm `VITE_STREAM_API_KEY` matches the server `STREAM_API_KEY` account.

### Building for production

```bash
npm run build
npm run preview
```

Serve the `dist/` folder behind your preferred static host. Set axios base URL to your deployed API.
