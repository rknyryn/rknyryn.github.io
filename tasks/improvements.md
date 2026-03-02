# Portfolio İyileştirme Görevleri

Son değerlendirme tarihi: 3 Mart 2026

## 🔴 Yüksek Öncelik (Production öncesi)

### 1. SEO & Metadata İyileştirmeleri
- [ ] Blog detay sayfası için dinamik `generateMetadata` ekle
  - Dosya: `app/blog/[slug]/page.tsx`
  - `title`: Post başlığı
  - `description`: İlk 160 karakter veya özel excerpt alanı
  - `keywords`: Post tags
  - OpenGraph image desteği

- [ ] Projeler sayfası için metadata
  - Dosya: `app/projects/page.tsx`
  - Dinamik title ve description

- [ ] Manifest.json ve site metadata
  - Site ikonu, theme color
  - Apple touch icon

### 2. Accessibility İyileştirmeleri
- [ ] Focus states iyileştirmesi
  - Daha belirgin outline renkleri (violet/sky temaya uygun)
  - Tüm interaktif elementlerde visible focus state

- [ ] Skip to content link ekle
  - Header'dan sonra, keyboard navigation için

- [ ] Heading hierarchy kontrolü
  - Tüm sayfalarda h1 → h2 → h3 sırası doğru mu kontrol et

- [ ] Color contrast audit
  - `text-zinc-400` ve `text-zinc-500` metinler WCAG AA standartlarını karşılıyor mu?
  - Gerekirse daha koyu tonlara geç

- [ ] ProjectCard semantic düzeltme
  - Link varsa içerik `<a>` içinde olmalı ama `<article>` semantiği korunmalı
  - Micro-data/structured data eklenebilir

### 3. Temel Sayfalar
- [ ] 404 Not Found sayfası
  - Dosya: `app/not-found.tsx`
  - Tasarım: Mevcut tema ile uyumlu, ana sayfaya dönüş linki

- [ ] Error boundary sayfası
  - Dosya: `app/error.tsx`
  - Global error handling

- [ ] About/Contact sayfası
  - Portfolio için önemli, kişisel bilgiler ve iletişim

### 4. Favicon & Icons
- [ ] Favicon ekle
  - `app/favicon.ico`
  - 16x16, 32x32, 48x48 boyutları

- [ ] Apple touch icon
  - `app/apple-icon.png`
  
- [ ] Web manifest icons
  - 192x192, 512x512

## 🟡 Orta Öncelik (Kullanıcı deneyimi)

### 5. Performance Optimizasyonları
- [ ] Blog markdown işleme cache mekanizması
  - `lib/content.ts` içinde memoization
  - Build-time static generation optimizasyonu

- [ ] Font loading stratejisi
  - `font-display: swap` kontrolü
  - Geist font'ları optimal mi?

- [ ] Dynamic imports
  - Büyük component'ler için lazy loading
  - Modal/dropdown gibi etkileşimli elementler

- [ ] Image optimization
  - Blog markdown'larında resim varsa next/image kullanımı
  - Blur placeholder'lar

### 6. Kod Kalitesi
- [ ] **Kullanılmayan dosyaları sil**
  - `components/features/blog/BlogCard.tsx` (kullanılmıyor)

- [ ] Magic number'ları düzelt
  - `top-[72px]` → CSS variable veya `top-18`
  - Header height tutarlılığı

- [ ] Body overflow inline style yerine CSS class
  - `document.body.style.overflow` → `overflow-hidden` class toggle
  - Daha temiz ve predictable

- [ ] Header className conditional fix
  - Line 43'te `isOpen` durumuna göre className zaten var, kontrol et

### 7. İçerik Geliştirmeleri
- [ ] Profile tagline iyileştir
  - Ne yaptığını açıklayan, daha bilgilendirici

- [ ] Blog post excerpt/summary alanı
  - Frontmatter'a `excerpt` field ekle
  - Liste görünümünde kullan

- [ ] Project detay sayfaları (opsiyonel)
  - Her proje için ayrı sayfa
  - Daha fazla görsel ve açıklama

- [ ] Meta description'lar gözden geçir
  - SEO-friendly, call-to-action içeren

## 🟢 Düşük Öncelik (Nice to have)

### 8. Analytics & Monitoring
- [ ] Analytics entegrasyonu
  - Google Analytics veya Vercel Analytics
  - Privacy-friendly alternatifler (Plausible, Fathom)

- [ ] Error tracking
  - Sentry veya benzer tool
  - Production error monitoring

- [ ] Web Vitals tracking
  - Core Web Vitals monitoring
  - Performance alerts

### 9. Tasarım İnce Ayarları
- [ ] Ana sayfa buton genişlikleri
  - `min-w-[160px]` hardcoded → içerikle orantılı veya flex-grow

- [ ] Blog list hover effect tutarlılığı
  - ProjectCard ile aynı seviyede refinement
  - Veya bilinçli olarak farklı tutulacaksa dokümante et

- [ ] Footer social icon tooltip'leri
  - Title attribute veya hover tooltip

- [ ] Mobile header height consistency
  - Content jump olmaması için sabit height

### 10. Ekstra Özellikler
- [ ] Dark mode toggle butonu (opsiyonel)
  - Şu anda system preference'a göre, manual switch eklenebilir

- [ ] Blog arama özelliği
  - Client-side search veya Algolia/similar

- [ ] Blog kategorileri/tag filtreleme
  - Tag'lara göre filtreleme UI

- [ ] RSS feed
  - Blog için RSS/Atom feed
  - `/feed.xml`

- [ ] Sitemap.xml
  - Next.js sitemap generation
  - SEO için önemli

- [ ] Reading progress bar
  - Blog detay sayfasında scroll progress

- [ ] View counter (opsiyonel)
  - Blog post görüntülenme sayısı
  - Vercel KV veya başka storage

### 11. Testing
- [ ] E2E testler
  - Playwright veya Cypress
  - Critical user flows

- [ ] Component testleri
  - React Testing Library
  - Önemli component'ler için

- [ ] Accessibility tests
  - Automated a11y testing (jest-axe)

### 12. Dokümantasyon
- [ ] README.md güncellemesi
  - Proje kurulumu
  - Geliştirme komutları
  - İçerik ekleme rehberi (blog yazma, proje ekleme)

- [ ] Contributing guidelines (opsiyonel)
  - Açık kaynak yapmayı düşünüyorsan

- [ ] Architecture documentation
  - Dizin yapısı açıklaması
  - i18n nasıl çalışıyor
  - Component pattern'leri

---

## 📝 Notlar

### Mevcut Hatalar (Lint)
- `components/layout/Header.tsx:102` → `top-[72px]` yerine `top-18` kullan
- `components/features/blog/BlogCard.tsx` → Dosya kullanılmıyor, silinecek

### Teknik Borç
- Inline style kullanımı (`document.body.style.overflow`)
- Magic number'lar (72px gibi)
- Cache mekanizması eksikliği

### Tasarım Kararları Dokümante Edilmeli
- Blog list'te neden daha subtle hover (proje kartlarına göre)?
- Semantic HTML tercihleri (article vs a tag)
- Gradient color palette rationale
