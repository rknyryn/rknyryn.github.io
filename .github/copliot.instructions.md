# Portfolio Project – Technical Instructions

## 1. Project Goal

Build a minimal, high-performance personal portfolio website using Next.js App Router.
The site is fully static and deployable to GitHub Pages without any backend.

**Design:** Minimal centered layout (Design A) with clean typography and responsive mobile-first design.

---

## 2. Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4 (mobile-first, dark mode support)
- **i18n:** Client-side React Context with lazy-loaded JSON locale files
- **Rendering:** Static Site Generation (SSG only, `output: 'export'`)
- **Deployment:** GitHub Pages static hosting

---

## 3. Project Structure

```
portfolio/
├── app/
│   ├── layout.tsx              # Root layout with fonts, global CSS, providers
│   ├── page.tsx                # Home/landing page
│   ├── about/page.tsx          # About page
│   ├── projects/page.tsx       # Projects listing page
│   ├── blog/page.tsx           # Blog placeholder
│   └── contact/page.tsx        # Contact page
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Header with nav links and language switcher
│   │   └── Footer.tsx          # Footer with copyright and social links
│   ├── i18n/
│   │   ├── LanguageProvider.tsx    # Context provider for i18n state
│   │   └── LanguageSwitcher.tsx    # EN/TR language toggle buttons
│   ├── features/
│   │   ├── home/
│   │   │   ├── LocalizedHome.tsx           # Hero section
│   │   │   └── FeaturedProjectsTitle.tsx   # Localized "Featured Projects" heading
│   │   ├── projects/
│   │   │   ├── ProjectCard.tsx             # Project card component (with localized link)
│   │   │   ├── LocalizedProjects.tsx       # Projects grid (fetches locale-specific data)
│   │   │   └── LocalizedProjectsPage.tsx   # Projects page wrapper
│   │   ├── about/
│   │   │   └── LocalizedAbout.tsx          # About page content
│   │   └── contact/
│   │       └── LocalizedContact.tsx        # Contact page content
│   └── ui/
│       └── Section.tsx         # Reusable section wrapper
├── data/
│   ├── profile.json                   # Language-neutral profile (name, bio, skills, socials)
│   ├── locales/
│   │   ├── en.json                    # English translations (nested keys: nav.*, home.*, etc.)
│   │   └── tr.json                    # Turkish translations
│   └── projects/
│       ├── projects.en.json           # English project metadata
│       └── projects.tr.json           # Turkish project metadata
├── styles/
│   └── globals.css             # Tailwind imports, CSS variables, global styles
├── public/
│   └── images/                 # Static images
└── typescript config, eslint, tailwind, postcss configs
```

---

## 4. Architecture Rules

### 4.1 Server Components vs Client Components

- **Prefer Server Components** for pages and data-fetching logic
- Use **Client Components** (`"use client"`) only when:
  - Calling React hooks (`useTranslation()`, `useState`, `useEffect`)
  - Handling user interactivity (clicks, form submissions)
  - Accessing browser APIs

### 4.2 Localization Pattern

1. **Server page** renders client component(s) that call `useTranslation()`
2. **Client component** receives locale context and renders localized content
3. **Locale files** loaded lazily via `LanguageProvider.tsx` on first use
4. **localStorage** persists user's language selection across sessions

Example:
```tsx
// Server page
export default function HomePage() {
  return (
    <div>
      <LocalizedHome />  {/* Client component that calls useTranslation() */}
    </div>
  );
}

// Client component
"use client";
export default function LocalizedHome() {
  const { t } = useTranslation();
  return <h1>{t("home.title")}</h1>;
}
```

### 4.3 Data Wiring

- All project data comes from JSON files, not hardcoded
- Language-neutral data (profile, skills) in `profile.json`
- Locale-specific content in `locales/*.json` and `projects/projects.*.json`
- Components import and use data via path aliases (`@data/profile.json`)

---

## 5. Internationalization (i18n)

### Implementation

- **Client-side only** – no server-side locale prefix routing
- Single build for all languages
- React Context (`LanguageProvider`) manages state
- JSON locale files lazy-loaded on demand
- User's selection persists in `localStorage`

### Adding Translations

1. Add key to `data/locales/en.json` and `data/locales/tr.json`:
   ```json
   {
     "section": {
       "key": "English text here"
     }
   }
   ```

2. Use in component:
   ```tsx
   const { t } = useTranslation();
   <p>{t("section.key")}</p>
   ```

### Supported Languages

- **en** – English (default)
- **tr** – Turkish

Switch via Navbar language buttons (no page reload required).

---

## 6. Styling Rules

- **Tailwind CSS v4** – utility-first approach
- **Mobile-first** – design for small screens first, then enhance for larger
- **Dark mode** – CSS variables and Tailwind dark: classes
- **No animations** – kept minimal per design philosophy
- **Spacing scale** – use Tailwind's standard scale (px, 1-6, etc.)
- **Global styles** in `styles/globals.css` only

---

## 7. TypeScript Path Aliases

Configured in `tsconfig.json` for cleaner imports:
- `@components/*` → `./components/*`
- `@data/*` → `./data/*`
- `@styles/*` → `./styles/*`
- `@public/*` → `./public/*`

Example: `import Navbar from "@components/layout/Navbar"`

---

## 8. Pages & Metadata

Each page must export `Metadata` object via Next.js Metadata API:
```tsx
export const metadata: Metadata = {
  title: "Page Title - Portfolio",
  description: "Page description for SEO",
};
```

---

## 9. Building & Deployment

### Development
```bash
npm run dev
```
Runs on `http://localhost:3000`

### Production Build
```bash
npm run build
```
Generates static output in `/out` folder

### GitHub Pages Deployment

1. Ensure `output: 'export'` in `next.config.ts` ✓
2. Run `npm run build` to generate `/out` folder
3. Push `/out` folder to GitHub Pages branch (or use GitHub Actions)

---

## 10. Performance & Quality

- **Target:** Lighthouse 90+
- **Static export** ensures fast initial load and CDN compatibility
- **Lazy locale loading** – translations only loaded when language is selected
- **Minimal JavaScript** – prefer Server Components
- **No external assets** – all images/icons served from `/public`

---

## 11. Design Philosophy

- **Minimal:** Centered layout, clean whitespace, minimal UI chrome
- **Fast:** Static only, no API calls or computation
- **Accessible:** Semantic HTML, keyboard navigation
- **Responsive:** Mobile-first, works on all screen sizes
- **Function over decoration:** No animations, no unnecessary effects

---

## 12. Future Enhancements (Deferred)

- ❌ Server-side locale prefix routing (`/en/...`, `/tr/...`) – adds complexity; client-side sufficient
- ❌ Blog posts via MDX – markup not yet needed; placeholder works
- ❌ Newsletter signup – requires backend; static only
- ❌ Analytics – evaluate privacy-first options (Plausible, Fathom) if needed

---

## Contributing

- Keep changes minimal and focused
- Maintain TypeScript strictness
- Test responsive design on mobile
- Verify i18n works for all new strings
- Run `npm run build` before committing