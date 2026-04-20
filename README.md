# Éclat — Luxury Perfume E-commerce

Interactive perfume storefront with a full shopping flow:

- Home, About, Contact, Product detail, and Checkout pages
- Search and filter across Designer, Niche, and Middle Eastern fragrances
- 30 curated perfumes with men, women, and unisex options
- Clickable product cards/images, cart, and mock checkout transaction flow
- Feedback form for customer responses

## Run locally

Open `index.html` directly, or run:

```bash
python -m http.server 5500
```

Then visit `http://127.0.0.1:5500/index.html`.

## GitHub Pages deployment

This repository includes `.github/workflows/deploy-pages.yml`.

To publish:

1. Push this code to `main` (or `master`).
2. In GitHub repository settings, set **Pages** source to **GitHub Actions**.
3. The workflow deploys the site automatically.

## Add correct product photos

The app now expects local image files instead of third-party image URLs.

1. Create a folder: `assets/images`
2. Add one photo per product using these exact names:
   - `01.jpg`, `02.jpg`, ..., `30.jpg`
3. Commit and push the images to GitHub.
4. GitHub Pages will redeploy and show your photos.

Example mapping:
- `01.jpg` -> Dior Sauvage
- `02.jpg` -> Chanel Bleu de Chanel
- ...
- `30.jpg` -> Lattafa Yara
