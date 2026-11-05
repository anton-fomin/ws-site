# ws-site

The public website for `ws`, the multi-repo git worktree CLI, at ws.fomin.space. It exists to convince developers who have never heard of `ws` to try it, and to give existing users a reference to look things up in.

## Language

### The site

**Landing page**:
The single page at the site root that explains the problem `ws` solves and gets a newcomer to install it.
_Avoid_: Home page, homepage, marketing page

**Docs**:
The multi-page reference section of the site, one page per topic of `ws`.
_Avoid_: Documentation site, manual, wiki

**Docs source**:
The Markdown files under `docs/` in the `ws` repository from which the Docs are built; the only place docs text is written.
_Avoid_: Content, README (the README is a separate, shorter overview)

**Docs version**:
The Docs as they stood at one release of `ws`, built from that release's Docs source.
_Avoid_: Docs release, snapshot

**Latest**:
The Docs version of the newest `ws` release, served at unversioned URLs.
_Avoid_: Current, stable, main

**Docs snapshot**:
A frozen, committed copy of an older Docs version, kept in this repository and never edited by hand.
_Avoid_: Archive, backup

**Version switcher**:
The control in the Docs that moves the reader between Docs versions.
_Avoid_: Version picker, version dropdown

### Audiences

**Newcomer**:
A developer who works across several repositories per project and does not yet know `ws`; the Landing page's reader.
_Avoid_: Prospect, visitor, lead

**User**:
Someone who already runs `ws` and comes to the Docs to look something up.
_Avoid_: Customer, reader

### Borrowed from ws

Terms such as workspace, branch directory, worktree, local files, integration and task keep the meaning the `ws` README gives them. The site never renames them.
