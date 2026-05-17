# Éclat — Luxury Perfume E-commerce

Interactive perfume storefront with INR pricing, scent discovery, and modular JavaScript.

## Run locally

```bash
python -m http.server 5500
```

Open `http://127.0.0.1:5500/index.html`

## Project structure

- `products.json` — catalog data (30 fragrances)
- `scent-profiles.js` — scent families and note pyramids
- `js/core.js` — config, formatting, catalog loader
- `js/cart.js` — cart and order totals
- `js/catalog.js` — grid, filters, search
- `js/pdp.js` — product detail, similar scents, gallery
- `js/quiz.js` — scent finder quiz
- `js/checkout.js` — checkout flow
- `js/ui.js` — navigation, wishlist, quick drawer
- `app.js` — bootstrap
- `assets/images/` — product (`01.optimized.jpg`) and lifestyle (`01.lifestyle.optimized.jpg`) images

## Images

Run `scripts/fetch-images.ps1` to re-download stock photos from Pexels (free license).

## GitHub Pages

Push to `master`; workflow deploys to `gh-pages` automatically.
