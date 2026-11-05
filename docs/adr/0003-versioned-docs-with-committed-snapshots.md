# Versioned Docs, older versions as committed snapshots

The Docs are versioned per minor release of `ws`, with a Version switcher, even before 1.0. A patch release replaces its minor's Docs version. The latest release's Docs source is fetched from `ws` at build time and served at unversioned URLs (`/docs/…`). Each older minor is a Docs snapshot under `/v0.N/docs/…`, kept forever with an "outdated version" banner. The `starlight-versions` plugin provides the switcher, banner, per-version sidebar and per-version search filtering. It expects older versions as snapshot directories committed to the site repository, which it creates itself (rewriting internal links to the version prefix). So when a new minor release arrives, the release-triggered workflow archives the outgoing version with the plugin and commits that snapshot here before building. There is no unreleased ("next") version: every Docs version describes something installable. The first Docs version is the `ws` release that introduces `docs/`; earlier releases get none.

## Considered Options

- **Rebuild every version from its tag on each build, still with the plugin.** Rejected: it relies on undocumented plugin internals (one archive per run, link rewriting during archiving).
- **One Astro build per tag with its own `base`, merged into one deploy.** Rejected: fully reproducible from tags, but the switcher, banner and cross-version search would be our own code to maintain.

## Consequences

- Snapshots are build outputs that happen to be committed. They are never edited by hand; ADR 0001 still holds for where Docs are written.
- A patch release to an *older* minor (v0.8.3 after v0.9 exists) does not refresh that minor's snapshot. That is accepted; refresh it by hand if it ever matters.
- The plugin describes itself as early-stage, so upgrades of Starlight may wait on it.
