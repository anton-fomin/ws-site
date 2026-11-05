# Docs source lives in the ws repository

The Docs text is written as Markdown under `docs/` in `anton-fomin/ws`, one file per page, and this repository only renders it. The README there shrinks to a short overview that links to the site. Docs therefore change in the same pull request as the behaviour they describe, and a release of `ws` is what updates the site.

## Considered Options

- **Split the existing README by headings at build time.** Rejected: one 865-line file is too long to read as a page, and splitting by heading level breaks whenever a section is restructured.
- **Move the docs into this repository.** Rejected: docs and code would drift, since a behaviour change could merge without its docs.
- **Maintain both by hand.** Rejected: guaranteed drift.

## Consequences

- This repository holds only the Landing page, layout, styling and build. Its build fetches the Docs source from `ws` at a release tag (ADR 0003).
- `docs/` in `ws` is shared with documentation for its contributors' coding agents (`docs/agents/`, and `docs/adr/` by convention), which is not published. So the Docs source is not "everything under `docs/`". It is exactly the pages named in this repository's page list (`src/docs-pages.mjs`), and the build fails when a page exists in `ws` but not in the list, or the other way round. A new page therefore needs a change in both repositories.
- Docs pages link to each other with relative `.md` links, so they work on GitHub as well. The build rewrites those links to site URLs, and rewrites links to other files of `ws` to GitHub at the tag.
