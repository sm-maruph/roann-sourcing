# Roann Sourcing frontend

Responsive React homepage built with Vite, plain CSS, and Lucide icons.

## Run locally

```sh
cd frontend
npm install
npm run dev
```

On Windows PowerShell with script execution disabled, use `npm.cmd` instead of `npm`.

## Production

```sh
npm run build
npm run preview
```

## Structure

- `src/pages/` — homepage sections
- `src/layouts/` — shared page layout
- `src/components/` — header, footer, logo, and map
- `src/data/` — navigation and product content
- `src/styles/` — global and responsive styles
- `public/images/` — locally stored photography

## Live website content

Run the backend as well as Vite. The dev proxy forwards `/api` and `/media` to port 4000. In production the Express backend serves `frontend/dist`; use a single origin or proxy those paths to the backend.

- `/admin/login`: custom administrator sign in; manage page banners, products, categories/subcategories, partner logos, uploads and quote requests.
- `/mens`, `/womens`, `/girls`: read active products and categories from the database, including subcategory filters. Product quote forms submit to the backend inbox.
- `/contact`: submits enquiries directly to the backend inbox.
- `/`: reads the homepage banner and partner logos from the backend.
- `/about`, `/compliance`: read their banner images from the backend; other editorial content remains local.
- `/products`, `/kids`: local product family and sourcing information.

Set up the database and storage using [the backend instructions](../backend/README.md). A complete fresh-project SQL installer is at `../backend/supabase/setup.sql`. The custom user table is `admin_users`; Supabase Auth is not required.

The static catalog files in `src/data` are starter seed sources, not the live catalog. Database changes appear on page refresh. Product images render uploaded photography; products without images retain the existing sample illustrations. Keep the frontend `/images/` assets deployed for starter images and editorial sections.

Build with `npm run build`. Production hosting must provide an SPA fallback for public routes and `/admin/login`. Quote submission requires the API and reports success only after the request is saved. Other direct email links still open the visitor's email app.
