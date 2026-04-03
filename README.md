# Template Gallery

Staff-facing React gallery for browsing OCS training flyer templates. Reads static JSON exported from `flyer-template-system` and renders a filterable, searchable collection. No backend.

**Stack:** React 19, Vite 7, TypeScript, Radix UI, CSS Modules  
**Deployed to:** Cloudflare Pages (Cloudflare Access, 6 users)  
**Tests:** 24 passing (Vitest + Testing Library)

## Development

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # Production build → dist/
npm test          # Run test suite
```

## Documentation

Full project spec and test plan live in `docs/CLAUDE.md`.
