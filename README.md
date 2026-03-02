# Portfolio

A modern, minimalist portfolio website built with Next.js 16, TypeScript, and Tailwind CSS.
Features bilingual support (EN/TR), dark mode, and blog functionality with markdown support.

## ✨ Features

- 🎨 **Modern Design** – Glassmorphism, gradient effects, refined typography
- 🌐 **Bilingual** – English & Turkish with seamless client-side switching
- 📱 **Fully Responsive** – Optimized for mobile, tablet, and desktop
- ⚡ **Static Export** – GitHub Pages ready, zero backend
- 🌙 **Dark Mode** – System preference with smooth transitions
- 📝 **Blog System** – Markdown-based with reading time & series support
- 🚀 **Performance** – Optimized builds, minimal JavaScript

## 🛠 Tech Stack

- **Framework:** Next.js 16.1.6 (App Router, Static Export)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4 + @tailwindcss/typography
- **Content:** Markdown (gray-matter, remark, remark-html)
- **i18n:** Custom React Context implementation
- **Deployment:** GitHub Pages via GitHub Actions

## 📁 Project Structure

```
portfolio/
├── app/                    # Next.js App Router pages
│   ├── blog/              # Blog routes (list & [slug])
│   ├── projects/          # Projects page
│   ├── layout.tsx         # Root layout with fonts
│   └── page.tsx           # Home page
├── components/
│   ├── features/          # Feature-specific components
│   │   ├── blog/         # Blog list, detail, cards
│   │   ├── home/         # Hero, featured projects
│   │   └── projects/     # Project cards, list
│   ├── i18n/             # LanguageProvider, LanguageSwitcher
│   ├── layout/           # Header, Footer
│   └── ui/               # Generic UI (Section)
├── data/
│   ├── blogs/            # Markdown blog posts (en/, tr/)
│   ├── locales/          # Translation JSON (en.json, tr.json)
│   ├── projects/         # Project data (projects.en.json, projects.tr.json)
│   └── profile.json      # Personal info, socials
├── lib/
│   └── content.ts        # Markdown processing, blog utilities
├── public/               # Static assets
├── styles/
│   └── globals.css       # Global styles, prose styling
└── tasks/
    └── improvements.md   # Future enhancements roadmap
```

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build static site
npm run build

# Output will be in /out folder
```

## 📦 Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages.

### Setup Steps

1. **Create GitHub repository** named `yourusername.github.io`

2. **Enable GitHub Pages**:
   - Go to repo Settings → Pages
   - Source: GitHub Actions

3. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/yourusername.github.io.git
   git push -u origin main
   ```

4. **Automatic deployment**: GitHub Actions will build and deploy automatically on every push to `main`

Your site will be live at: `https://yourusername.github.io`

### Manual Build & Deploy

```bash
npm run build
# Deploy /out folder to your hosting provider
```

## 🌐 Internationalization (i18n)

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