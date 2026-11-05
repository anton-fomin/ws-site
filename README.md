# ws-site

The website for [ws](https://github.com/anton-fomin/ws) at https://ws.fomin.space:
a Landing page plus the Docs, built with Astro and Starlight.

- [Specification](docs/spec.md)
- [Decisions](docs/adr/)
- [Glossary](GLOSSARY.md)

## Development

`nix develop` provides node, pnpm, vhs, tmux and just.

```
pnpm install
pnpm fetch-docs          # Latest from ../ws/docs, the sibling checkout
pnpm dev                 # http://localhost:4321
pnpm test                # the docs transform and the release plan
pnpm check               # types
pnpm build               # dist/
```

The Docs text is not written here. It lives in `docs/` of the `ws`
repository; `pnpm fetch-docs --from <ws checkout> --tag <tag>` copies it into
`src/content/docs/docs/` (ignored by git), with titles taken from each page's
first heading and `.md` links rewritten to site URLs. Every page has to be
named in `src/docs-pages.mjs`, which is also the sidebar.

`versions.json` records which `ws` release Latest is built from and which
older minors are kept as Docs snapshots under `src/content/docs/v*/`. Both are
written by the Deploy workflow, never by hand: see
[ADR 0003](docs/adr/0003-versioned-docs-with-committed-snapshots.md).

The terminal demo is recorded with VHS ([demo/](demo/README.md)); the social
preview image is rendered from [design/og.svg](design/README.md).

## Deploy

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on a push
to `main`, on a `ws-release` dispatch from the `ws` release workflow, and on a
manual run, which can name a release tag to process. Every run processes the
newest `ws` release, so it is safe to re-run.
