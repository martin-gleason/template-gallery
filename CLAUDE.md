# CLAUDE.md — Template Gallery

**Status:** active
**Author:** OCS — Marty

Static React gallery for browsing OCS training flyer templates. Reads JSON exports from `flyer-template-system` and renders a filterable, searchable collection. Client-side only — no backend, no database. Deployed to Cloudflare Pages with Cloudflare Access (6 users).

This citizen is part of the OCS-Ecosystem federation. The four ecosystem hooks every citizen reads from:

- **Charter:** https://github.com/martin-gleason/OCS-Ecosystem/blob/main/CLAUDE.md
- **Conventions:** https://github.com/martin-gleason/OCS-Ecosystem/blob/main/docs/conventions.md (vocabulary, ID grammar, branch naming, commit format, merge strategy — adopt by reference; deviations documented inline below with explicit rationale)
- **Locked decisions:** https://github.com/martin-gleason/OCS-Ecosystem/blob/main/docs/locked-decisions.md
- **PR review log:** https://github.com/martin-gleason/OCS-Ecosystem/blob/main/pr-review-log.md (Marty's 5% learning practice — every merged PR gets an entry; surface politely if missing/stale before review)

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

## F-numbering

Template Gallery had no F-numbering at the time of its v1.0 ship. Per Phase 4c retrofit (chore `C1`, 2026-05-24), feature work prior to this retrofit is **grandfathered** — no retroactive F-numbers assigned.

- **`main` at the time of Phase 4c retrofit = v1.0 ship.** All work landed prior to chore `C1` (the conventions retrofit) is grandfathered; no retroactive F-numbers.
- **Next new feature branch becomes `F1`.** Subsequent features increment from there per `docs/conventions.md` §2.
- **Branch grammar going forward:** `F<N>/<topic>` or `F<N>-T<M>/<topic>` per ecosystem conventions.
- **No in-flight feature branches** as of Phase 4c — the three stale PRs (`global-share`, `user-testing`, and a third) were pruned on 2026-05-24 prior to this retrofit, so `C1-T2` (branch rename) is a no-op for this citizen.

Deployment note: Template Gallery ships on **Cloudflare Pages with Cloudflare Access** (6-user gate). This was corrected in the workspace README via the infrastructure-pass PR (#31); the previous "GitHub Pages" / "public" framing in older docs is stale.

## Internal spec

The full project spec, test plan, and detailed implementation notes live at [`docs/CLAUDE.md`](docs/CLAUDE.md). That file is the source of truth for project-internal concerns (architecture, dependencies, test approach, deployment specifics). This root-level file is the ecosystem-facing view: lifecycle status, author, ecosystem orientation, and authorization model.

-----

May 11, 2026

#AI/Claude
