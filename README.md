# Portfolio

A minimal, high-performance personal portfolio website built with Next.js and Tailwind CSS.
Fully static, deployable to GitHub Pages, with built-in multi-language support (English & Turkish).

## Features

✨ **Minimal Design** – Centered layout with clean typography  
🌐 **Multi-language** – English & Turkish with client-side switching  
📱 **Responsive** – Mobile-first design, works on all screen sizes  
⚡ **Static Export** – Zero backend, GitHub Pages compatible  
🎨 **Dark Mode** – Built-in light/dark mode support  
📊 **Lightweight** – TypeScript, Tailwind CSS, no bloat  

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **Internationalization:** Client-side React Context
- **Deployment:** GitHub Pages (static export)

## Project Structure

```
portfolio/
├── app/               # Next.js routes (page.tsx, layout.tsx)
├── components/        # Reusable UI components
│   ├── layout/       # Navbar, Footer
│   ├── i18n/         # Language provider & switcher
│   ├── features/     # Feature-specific components
│   └── ui/           # Generic UI components
├── data/             # JSON data files
│   ├── profile.json  # Profile, bio, skills, socials
│   ├── locales/      # Translation files (en.json, tr.json)
│   └── projects/     # Per-language project data
├── styles/           # Global CSS & Tailwind config
└── public/           # Static assets
```

## Pages

- **Home** – Landing page with hero & featured projects
- **About** – Bio, skills, and profile info
- **Projects** – Full project portfolio grid
- **Contact** – Contact prompt with email CTA
- **Blog** – Placeholder (ready for content)

## Quick Start

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm run start
```

Static output is generated in the `/out` folder.

## Deployment to GitHub Pages

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `/out` folder to your GitHub Pages branch:
   ```bash
   # Option 1: Push /out folder directly
   git subtree push --prefix out origin gh-pages

   # Option 2: Use GitHub Actions (recommended)
   # Create .github/workflows/deploy.yml
   ```

## Internationalization (i18n)

### Supported Languages

- **English** (en) – Default
- **Turkish** (tr)

### How It Works

- Single build for all languages
- Language selection stored in `localStorage` and persists across sessions
- Translations lazy-loaded on demand
- Switch language via buttons in the Navbar (no page reload)

### Adding Translations

1. Add key to `data/locales/en.json` and `data/locales/tr.json`
2. Use in components:
   ```tsx
   const { t } = useTranslation();
   <p>{t("section.key")}</p>
   ```

## Customization

### Update Profile

Edit `data/profile.json` with your info:
```json
{
  "name": "Your Name",
  "role": "Your Role",
  "bio": "Your bio...",
  "skills": ["Skill1", "Skill2"],
  "socials": { "github": "...", "linkedin": "..." }
}
```

### Add Projects

Edit `data/projects/projects.en.json` and `data/projects/projects.tr.json`:
```json
[
  {
    "title": "Project Title",
    "description": "Brief description",
    "tags": ["tag1", "tag2"],
    "link": "https://..."
  }
]
```

### Update Translations

Edit `data/locales/en.json` and `data/locales/tr.json` to add or change translations.

## Design Philosophy

- **Function over decoration** – Clean UI, no unnecessary effects
- **Mobile-first** – Optimized for small screens
- **Performance** – Static export means instant load
- **Accessibility** – Semantic HTML, keyboard navigation

## Performance

- **Lighthouse:** 90+ score (static export = fast)
- **Bundle size:** Minimal (no external UI libraries)
- **SEO:** Full metadata on all pages
- **Build time:** < 10 seconds

## File Size Optimization

- CSS is tree-shaken by Tailwind – only used utilities included
- TypeScript compiled to minimal JavaScript
- Images are static and optimized
- No font loading delays

## TypeScript Path Aliases

Cleaner imports with configured aliases:

```tsx
// Instead of:
import Navbar from "../../../components/layout/Navbar"

// Use:
import Navbar from "@components/layout/Navbar"
```

Configured aliases:
- `@components/*` – components folder
- `@data/*` – data folder
- `@styles/*` – styles folder
- `@public/*` – public folder

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## License

MIT – Feel free to use this template for your portfolio.

## Contributing

Contributions welcome! Please keep changes minimal and focused on the original design philosophy.

---

**Built with ❤️ using Next.js & Tailwind CSS**