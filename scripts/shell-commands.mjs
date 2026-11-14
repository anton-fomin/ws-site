// Pass shell fences through Markdown as inert markers. MarkdownContent replaces
// them with the same Astro component used on the Landing page, at build time.
const shellLanguages = new Set(['sh', 'shell', 'bash', 'zsh', 'fish', 'shellscript'])

export const shellCommands = {
  name: 'ws-shell-commands',
  /** @param {{ lang?: string | null, value: string }} node */
  code(node) {
    if (!shellLanguages.has(node.lang ?? '')) return
    const command = Buffer.from(node.value).toString('base64')
    return {
      type: /** @type {const} */ ('html'),
      value: `<ws-shell-command data-command="${command}"></ws-shell-command>`,
    }
  }
}

/** @param {string} html */
export function splitShellCommands(html) {
  /** @type {Array<{ html: string } | { command: string }>} */
  const parts = []
  const marker = /<ws-shell-command data-command="([A-Za-z0-9+/=]*)"><\/ws-shell-command>/g
  let offset = 0
  for (const match of html.matchAll(marker)) {
    parts.push({ html: html.slice(offset, match.index) })
    parts.push({ command: Buffer.from(match[1], 'base64').toString() })
    offset = match.index + match[0].length
  }
  parts.push({ html: html.slice(offset) })
  return parts
}
