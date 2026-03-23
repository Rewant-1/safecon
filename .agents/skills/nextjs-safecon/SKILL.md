---
name: SafeCon Next.js Coding Standards
description: Enforces project-wide conventions for the SafeCon PDF/Image toolkit built on Next.js 16 App Router, Tailwind CSS v4, TypeScript
---

# SafeCon — Coding Skill

## Tech Stack
- **Framework**: Next.js 16 (App Router, `src/` directory)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (using `@theme inline` and CSS variables)
- **Fonts**: Geist Sans + Geist Mono via `next/font/google`

## Architecture Rules

### File Organisation
```
src/
├── app/           # Route pages — thin wrappers calling hooks + components
├── components/
│   ├── ui/        # Generic reusable: Button, Slider, Badge, ProgressBar
│   └── tools/     # Tool-specific: FileDropzone, ImagePreview, PageThumbnail
├── lib/           # Pure business logic — NO React imports allowed
├── hooks/         # Custom React hooks — bridge between lib/ and components/
```

### Core Principles
1. **`lib/` must be React-free** — only pure functions/classes using Web APIs (Canvas, Blob, FileReader). This keeps them unit-testable with Vitest without JSDOM.
2. **`hooks/` bridge lib ↔ UI** — each hook manages state, calls lib functions, and exposes `{ progress, error, result, process }`.
3. **Pages are thin** — `app/*/page.tsx` composes components + hooks, no business logic.
4. **100% client-side** — all processing happens in the browser. No API routes, no server actions. Use `'use client'` on interactive pages/components.
5. **Static export** — the project targets `output: 'export'` in `next.config.ts`.

### Component Guidelines
- All interactive components must start with `'use client'`
- Use `aria-label`, `role`, keyboard nav for WCAG AA
- Prefer composition over prop-drilling
- File inputs must validate MIME type + size before processing

### Styling
- Use Tailwind utility classes; avoid inline `style=` attributes
- Dark mode is the default (background `#09090B`, foreground `#FAFAFA`)
- Use CSS variables defined in `globals.css` via `@theme inline`
- Animations: use Tailwind's `transition-*` + `animate-*` utilities

### Import Aliases
- Use `@/*` to reference `src/*` directory

### Testing
- `vitest` for unit tests in `lib/`
- Test files co-locate next to source: `lib/compress.test.ts`
- Use `describe/it/expect` from vitest

### Performance
- Lazy-load heavy libs (`pdfjs-dist` ~2MB) via `next/dynamic` or dynamic `import()`
- Revoke `URL.createObjectURL()` after use to prevent memory leaks
- Use `canvas.toBlob()` over `toDataURL()` for large images

### Key Libraries
| Library | Purpose |
|---------|---------|
| `pdf-lib` | Create/modify PDFs (Images→PDF) |
| `pdfjs-dist` | Render PDF pages to canvas (PDF→Images) |
| `jszip` | Bundle extracted images into ZIP |
| `file-saver` | Trigger browser downloads |
| `react-dropzone` | Drag-and-drop file input |
