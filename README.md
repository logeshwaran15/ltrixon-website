# Ltrixon

Official website for **Ltrixon** — a software development company delivering scalable web, mobile, and cloud solutions.

Live: https://ltrixon.com

## Stack

- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: PHP (MySQL) — lead capture, project/client admin panel, OpenAI-powered chat assistant

## Project Structure

```
├── src/            # React application source
├── public/          # Static assets (favicon, robots.txt, sitemap.xml, .htaccess)
├── backend/         # PHP API endpoints (admin, leads, projects, chat)
└── dist/            # Production build output (generated, not committed)
```

## Local Development

### Frontend

```bash
npm install
npm run dev
```

App runs at `http://localhost:8080`.

### Backend

The `backend/` folder is plain PHP and expects a MySQL database. Run it via XAMPP/Apache (or any PHP server) pointed at the `backend/` folder.

1. Copy `backend/.env.example` to `backend/.env` and fill in your values:
   ```
   OPENAI_API_KEY=your-openai-api-key
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=ltrixon_lk
   ```
2. Import `backend/database.sql` into your MySQL database.
3. Serve the `backend/` folder (e.g. via XAMPP) so it's reachable at a URL like `http://localhost/backend`.

### Connecting frontend to backend

The frontend calls the API via `VITE_API_BASE_URL` (see [src/lib/api.ts](src/lib/api.ts)), which defaults to the relative path `/backend`. For local development where the frontend and backend run on different ports, create a `.env` file at the project root:

```
VITE_API_BASE_URL=http://localhost/backend
```

In production, when both the built frontend and the `backend/` folder are deployed together under the same domain, no override is needed — the relative default just works.

## Build

```bash
npm run build
```

Runs a TypeScript check followed by a Vite production build. Output is written to `dist/`.

To preview the production build locally:

```bash
npm run preview
```

## Deployment (MilesWeb / shared hosting)

1. Run `npm run build` locally.
2. Upload the **contents** of `dist/` to your hosting `public_html/` (or the target domain's document root).
3. Upload the `backend/` folder alongside it (e.g. `public_html/backend/`), including a `backend/.env` created from `backend/.env.example` with your production OpenAI key and MySQL credentials.
4. Import `backend/database.sql` into the MySQL database created on MilesWeb (via phpMyAdmin/cPanel), and update `backend/.env` with the DB name/user/password MilesWeb assigns you.
5. Ensure `.htaccess` (already included in `dist/`) is present in the document root — it enables SPA routing.
6. `.env` files are never committed to the repository; set them directly on the server via FTP/File Manager.

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | frontend build/`.env` | Base URL for backend API calls (optional, defaults to `/backend`) |
| `OPENAI_API_KEY` | `backend/.env` | Powers the AI chat assistant |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | `backend/.env` | MySQL connection |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run build:dev` | Build in development mode |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests (Vitest) |
