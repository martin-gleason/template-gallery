# Template Gallery

Staff-facing React gallery for browsing OCS training flyer templates. Reads static JSON exported from `flyer-template-system` and renders a filterable, searchable collection. No backend.

Part of the [OCS-Ecosystem](https://github.com/martin-gleason/OCS-Ecosystem) federation — a downstream consumer of the FTS template-metadata JSON contract.

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

Full project spec and test plan live in `docs/CLAUDE.md`. Ecosystem-wide conventions live in the [OCS-Ecosystem conventions doc](https://github.com/martin-gleason/OCS-Ecosystem/blob/main/docs/conventions.md).

## License & usage

Internal Cook County Juvenile Probation tool. Not licensed for external use or redistribution. Contents may include references to sworn-staff training materials; treat as sensitive.
