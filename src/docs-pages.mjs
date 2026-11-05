// Every page of the Docs, by its path below docs/ in the ws repository, in
// sidebar order. The build fails when the Docs source and this list disagree,
// so a page added to ws has to be added here too.

export const docsSidebar = [
  'getting-started.md',
  'layout.md',
  'commands.md',
  'configuration.md',
  {
    label: 'Integrations',
    items: [
      'integrations/index.md',
      'integrations/multiplexers.md',
      'integrations/fzf-zoxide.md',
      'integrations/local-files.md',
      'integrations/package-managers.md',
    ],
  },
  'tasks.md',
  'shell-completion.md',
  'coding-agents.md',
]

/** @type {string[]} */
export const docsPages = docsSidebar.flatMap((entry) => (typeof entry === 'string' ? [entry] : entry.items))

/**
 * A page's URL below /docs/, without slashes at either end: `integrations/index.md` → `integrations`.
 * @param {string} file
 */
export function pageURL(file) {
  return file.replace(/\.md$/, '').replace(/(^|\/)index$/, '')
}
