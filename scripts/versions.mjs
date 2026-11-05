// Which ws release the Docs are built from, and when Latest becomes a Docs snapshot.
// The state is versions.json: { latest: the tag Latest is built from, archived: snapshot slugs, newest first }.

/** @typedef {{ latest: string | null, archived: string[] }} VersionsState */

/** @param {string} tag */
function parse(tag) {
  const match = tag.match(/^v(\d+)\.(\d+)\.(\d+)$/)
  if (!match) throw new Error(`${tag} is not a release tag like v0.8.0`)
  return match.slice(1).map(Number)
}

/**
 * The Docs version a tag belongs to: v0.8.2 → v0.8.
 * @param {string} tag
 */
export function minorSlug(tag) {
  const [major, minor] = parse(tag)
  return `v${major}.${minor}`
}

/**
 * Decides what a build does with an incoming release tag.
 * @param {VersionsState} state
 * @param {string} [tag] the released tag; none for a build of the site itself
 * @returns {{ archive: { slug: string, tag: string } | null, build: string | null, state: VersionsState }}
 */
export function planRelease(state, tag) {
  const unchanged = { archive: null, build: state.latest, state }
  if (!tag) return unchanged
  parse(tag)
  if (state.latest && compare(parse(tag), parse(state.latest)) <= 0) return unchanged
  const archive =
    state.latest && minorSlug(tag) !== minorSlug(state.latest)
      ? { slug: minorSlug(state.latest), tag: state.latest }
      : null
  return {
    archive,
    build: tag,
    state: { latest: tag, archived: archive ? [archive.slug, ...state.archived] : state.archived },
  }
}

/** @param {number[]} a @param {number[]} b */
function compare(a, b) {
  return a[0] - b[0] || a[1] - b[1] || a[2] - b[2]
}
