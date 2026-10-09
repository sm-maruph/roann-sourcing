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

## Pages

- `/` — homepage
- `/about` — About Us, with mission, vision, story, strengths, global reach, people, values, and compliance sections
- `/products` — product families, six apparel services, sourcing strengths, and enquiry links. Category cards, the category picker, and service cards open keyboard-accessible detail dialogs.
- `/mens` — men’s catalog with 40 sample styles across T-shirts, denim, trousers, sweaters, and boxers. Link directly to a category with `/mens?category=denim` (other values: `t-shirts`, `trousers`, `sweaters`, `boxers`). Filters combine choices within a group and narrow results across groups; sorting and mobile filter drawers are supported. Quote forms validate input and prepare a draft in the visitor’s email app; no backend submission occurs.
- `/womens` — women’s catalog with 20 sample styles across T-shirts, leggings, sweaters, and lingerie. Category links use `/womens?category=leggings` (other values: `t-shirts`, `sweaters`, `lingerie`). Uses the shared catalog filtering, sorting, history, and email-quote workflow, with a distinct layout based on the women’s reference. Sample data lives in `src/data/womens.js`; original product illustrations are rendered by `WomensGarmentPreview` and `GarmentPreview`. Configure the SPA fallback for this route too.
- `/girls` — girls’ catalog with 18 sample styles across T-shirts, denim, and sweaters (`?category=t-shirts`, `denim`, or `sweaters`). Includes style, fabric, color, and age-group dropdowns, interactive color swatches, and category-specific sourcing banners. Selected colors are included in the email quote draft. Sample data lives in `src/data/girls.js`; product cards use original garment illustrations. Configure the SPA fallback for `/girls` as well.

Men’s catalog content lives in `src/data/mens.js`. Product artwork is original SVG sample illustration in `src/components/GarmentPreview.jsx`, with illustrative stock photos in the category banners. Replace sample specifications and artwork with approved product data and photography before using this as a live catalog. Configure hosting with the same SPA fallback for `/mens`.

The shared navigation connects all three pages. Production hosting should serve `index.html` for `/about` and `/products` (SPA fallback). Product links and search results lead to the corresponding category on `/products`. The pages use illustrative Pexels and Unsplash photography. Team details and compliance enquiries open keyboard-accessible dialogs; email links use the configured contact address. Certification marks are visual reference placeholders and should be replaced with verified partner documentation and approved assets before publication.

Product cards open accessible native dialogs. Navigation links scroll to sections, search filters the product collections, and contact links open an email enquiry. The contact email, location, statistics, and partner names are reference content and should be confirmed before launch. Photography is illustrative Unsplash imagery; replace with your own production assets for an exact visual match. The logo and world map are vector approximations of the supplied reference.
