# CLAUDE.md — Template Gallery

**Status:** active
**Author:** OCS — Marty

Static React gallery for browsing OCS training flyer templates. Reads JSON exports from `flyer-template-system` and renders a filterable, searchable collection. Client-side only — no backend, no database. Deployed to Cloudflare Pages with Cloudflare Access (6 users).

This citizen is part of the OCS-Ecosystem federation (see https://github.com/martin-gleason/OCS-Ecosystem). Ecosystem-wide vocabulary, PR conventions, and merge strategy live at https://github.com/martin-gleason/OCS-Ecosystem/blob/main/docs/conventions.md — adopt by reference; deviations specific to this citizen are documented inline with explicit rationale.

This citizen is a **consumer of the FTS template-metadata JSON contract** (produced by `flyer-template-system`). It does not produce any contract of its own.

## Authorization Model

**This is non-negotiable. Read it before doing anything.**

The authoritative three-tier authorization protocol is defined in the ecosystem-level `CLAUDE.md` at https://github.com/martin-gleason/OCS-Ecosystem/blob/main/CLAUDE.md. Summarized:

1. Specs are context, not work orders.
2. Work begins ONLY when Marty gives explicit instruction in the current chat session.
3. Passing tests within a feature loop authorizes completing that loop — nothing more.
4. Moving to the next feature requires explicit authorization.
5. Do not start the next feature without Marty's go-ahead.

No template-gallery-specific extensions or deviations at this time.

## Internal spec

The full project spec, test plan, and detailed implementation notes live at [`docs/CLAUDE.md`](docs/CLAUDE.md). That file is the source of truth for project-internal concerns (architecture, dependencies, test approach, deployment specifics). This root-level file is the ecosystem-facing view: lifecycle status, author, ecosystem orientation, and authorization model.

-----

May 11, 2026

#AI/Claude
