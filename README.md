# QueryLab

Test, debug and master SQL.

QueryLab is a SQL playground, interview, and learning SaaS UI. This first version runs entirely in the browser with a mock SQL engine. Stitch HTML in `querylab_dashboard/`, `querylab_sql_playground/`, and `querylab_sql_interview/` remains as visual reference. ([Link](https://querylab-cjy.pages.dev/dashboard))

## Local development

```bash
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173

```bash
npm run build
npm run lint
npm run preview
```

## Environment variables

Copy `.env.example`. Do not commit `.env`.

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend API base URL |
| `VITE_APP_NAME` | Product name |
| `VITE_USE_MOCK_API` | `true` uses local mock services |

Never put database credentials in `VITE_*` variables.

## Docker

```bash
docker compose up --build
```

- Frontend: http://localhost:4173
- API stub: http://localhost:8080
- Postgres: localhost:5432 (`querylab` / `querylab`)

The API container is a stub that returns HTTP 501. The frontend mock engine does not query this database.

## Routes

- `/dashboard`
- `/playground`
- `/playground/:projectId`
- `/interview`
- `/interview/:questionId`
- `/projects`
- `/history`
- `/settings`
