# الدفتر - Arabic News Website Prototype

A complete Arabic RTL news website prototype built with Next.js, TypeScript, and TailwindCSS.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **TailwindCSS 4**
- **Almarai** Arabic font (Google Fonts via `next/font`)
- RTL-first responsive design
- Static mock data (no backend)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── layout.tsx          # Root layout (RTL, Almarai font)
│   ├── not-found.tsx       # 404 page
│   ├── breaking/           # Breaking news page
│   ├── section/[slug]/     # Section pages (9 sections)
│   ├── news/[slug]/        # Article detail pages
│   ├── infographic/[slug]/ # Infographic pages with carousel
│   ├── file/[slug]/        # Special file pages
│   ├── author/[slug]/      # Author profile pages
│   ├── tag/[slug]/         # Tag listing pages
│   ├── series/[slug]/      # Series pages
│   ├── search/             # Search page with filters
│   ├── about/              # About page
│   ├── editorial-policy/   # Editorial policy
│   ├── privacy/            # Privacy policy
│   ├── terms/              # Terms of service
│   └── contact/            # Contact form
├── components/             # Reusable UI components
│   ├── Header.tsx          # Sticky header with nav
│   ├── Footer.tsx          # Site footer
│   ├── MobileDrawerMenu.tsx
│   ├── BreakingTicker.tsx  # Breaking news ticker
│   ├── HeroSlider.tsx      # Hero image slider
│   ├── SectionBlock.tsx    # Section with featured + list
│   ├── NewsCard.tsx        # News card (3 variants)
│   ├── TabsMostRead.tsx    # Most read / Latest tabs
│   ├── Breadcrumbs.tsx
│   ├── ShareBar.tsx        # Social share buttons
│   ├── BookmarkButton.tsx  # localStorage bookmark
│   ├── FontSizeControls.tsx
│   ├── ThemeProvider.tsx   # Dark/Light mode
│   ├── RelatedList.tsx
│   └── Carousel.tsx        # Image carousel
└── data/                   # Static mock CMS data
    ├── types.ts
    ├── sections.ts         # 9 news sections
    ├── authors.ts          # 6 authors
    ├── tags.ts             # 15 tags
    ├── articles.ts         # 60 articles
    ├── breaking.ts         # 10 breaking items
    ├── infographics.ts     # 8 infographics
    ├── special-files.ts    # 4 special files
    ├── series.ts           # 3 series
    └── index.ts            # Exports + helper functions
```

## Features

- **Full RTL Arabic layout** with Almarai font
- **Dark/Light mode** toggle (persisted via localStorage)
- **Breaking news ticker** with auto-scroll
- **Hero slider** with auto-advance
- **9 news sections** with dedicated pages
- **60+ articles** with full detail pages
- **Infographic gallery** with carousel
- **Special files** hub
- **3 article series**
- **Search** with section filters and sorting
- **Bookmark/Read Later** via localStorage
- **Font size controls** (small/medium/large)
- **Author profiles**
- **Tag-based browsing**
- **Responsive design** (mobile, tablet, desktop)
- **Accessibility** basics (aria-labels, semantic HTML)

## Sections

| Slug | Arabic Name |
|------|------------|
| events-today | أحداث اليوم |
| country-affairs | شؤون البلد |
| market-movement | حركة السوق |
| style-stars | ستايل ونجوم |
| inside-goal | جوّه الجون |
| egypt-reality | الواقع المصري |
| special-file | ملف خاص |
| infographic | الانفو جراف |
| people-street | الناس والشارع |

## Series

| Slug | Arabic Name |
|------|------------|
| first-guide | دليلك الأول |
| shot-comment | لقطة وتعليق |
| mind-logic | بالعقل والمنطق |
