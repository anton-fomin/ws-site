# Astro with Starlight builds the site

The site is one Astro project. Starlight renders the Docs, and the Landing page is a custom Astro page in the same project. It was the only candidate in which both a hand-designed Landing page and a full docs section (search, sidebar, dark/light mode, table of contents) work with no extra effort. Node is a build-time dependency only.

## Considered Options

- **VitePress**: comparable docs features, but a custom Landing page fights its default theme.
- **Zola**: a single Rust binary that fits the Nix setup, but search and docs navigation would have to be built by hand.
- **mdBook**: the Rust-ecosystem default for docs, but it has no real Landing page.
