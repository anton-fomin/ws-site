# AGENTS.md

The website for `ws` (Astro + Starlight, deployed to GitHub Pages at
ws.fomin.space). Read `GLOSSARY.md` for the vocabulary (Landing page, Docs,
Docs source, Latest, Docs snapshot) and `docs/adr/` before changing how Docs
are fetched or versioned. `docs/spec.md` is the specification.

## Commands

Run everything inside `nix develop`.

```
pnpm fetch-docs          # Docs source from ../ws into src/content/docs/docs/
pnpm test                # node --test: scripts/docs.test.mjs, scripts/versions.test.mjs
pnpm check               # astro check, including JSDoc types of scripts/*.mjs
pnpm build
```

## Rules

- Never write Docs text here: it belongs in `docs/` of the `ws` repository.
  Only the Landing page (`src/pages/index.astro`) and the 404 page are written
  in this repository.
- Never edit `versions.json`, `src/content/docs/v*/` or
  `src/content/versions/` by hand; the Deploy workflow owns them.
- Colours and fonts come from `src/styles/tokens.css`; Starlight is tinted in
  `src/styles/starlight.css`, not replaced.
- The site makes no third-party requests: fonts are self-hosted via
  `@fontsource`, and there is no analytics.
