// Turns the Docs source of the ws repository (docs/*.md) into Starlight pages.

import path from 'node:path/posix'

import { docsPages, pageURL } from '../src/docs-pages.mjs'

const repository = 'https://github.com/anton-fomin/ws'

/**
 * @param {string} markdown a page of the Docs source
 * @param {{ file: string, tag: string }} context its path below docs/, and the ws tag it comes from
 * @returns {string} the Starlight page
 */
export function transformPage(markdown, { file, tag }) {
  const source = markdown.replace(/^﻿/, '').replace(/\r\n/g, '\n')
  const match = source.match(/^# (.+)\n+/)
  if (!match) throw new Error(`${file}: a page has to start with a "# Title" line`)
  /** @param {string} link */
  const rewrite = (link) => rewriteLink(link, file, tag)
  const body = mapOutsideCode(source.slice(match[0].length), (line) =>
    line
      .replace(/\]\(([^)\s]+)\)/g, (_, /** @type {string} */ link) => `](${rewrite(link)})`)
      .replace(/^( {0,3}\[[^\]]+\]:\s*)(\S+)/, (_, /** @type {string} */ label, /** @type {string} */ link) => label + rewrite(link)),
  )
  const editUrl = `${repository}/edit/main/docs/${file}`
  return `---\ntitle: ${JSON.stringify(match[1])}\neditUrl: ${JSON.stringify(editUrl)}\n---\n\n${body}`
}

/**
 * @param {string} link as written in the Docs source
 * @param {string} from the page it is on
 * @param {string} tag
 */
function rewriteLink(link, from, tag) {
  if (/^[a-z][a-z0-9+.-]*:/i.test(link) || link.startsWith('#') || link.startsWith('/')) return link
  const [target, hash = ''] = link.split(/(?=#)/)
  const resolved = path.join(path.dirname(from), target)
  if (resolved.startsWith('../')) return `${repository}/blob/${tag}/${path.join('docs', resolved)}${hash}`
  if (!docsPages.includes(resolved)) {
    throw new Error(`${from}: the link ${link} points at docs/${resolved}, which is not a page`)
  }
  const relative = path.relative(pageURL(from), pageURL(resolved))
  return relative ? `${relative}/${hash}` : hash || './'
}

/**
 * Applies `fn` to every line of `markdown` outside fenced code blocks
 * (``` or ~~~, indented or not).
 * @param {string} markdown
 * @param {(line: string) => string} fn
 */
function mapOutsideCode(markdown, fn) {
  /** @type {string | null} */
  let fence = null
  return markdown
    .split('\n')
    .map((line) => {
      const marker = line.match(/^\s*(`{3,}|~{3,})/)?.[1]
      if (fence) {
        if (marker && marker[0] === fence[0] && marker.length >= fence.length) fence = null
        return line
      }
      if (marker) {
        fence = marker
        return line
      }
      return fn(line)
    })
    .join('\n')
}

/** Directories of docs/ in ws that are for its contributors' agents, not for the site. */
const unpublished = ['agents/', 'adr/']

/**
 * Fails unless the Markdown files of the Docs source are exactly the pages of the page list.
 * @param {string[]} files every `.md` file below docs/, as paths relative to it
 * @param {string[]} pages the page list
 * @returns {string[]} the files to publish
 */
export function checkPages(files, pages = docsPages) {
  const published = files.filter((file) => !unpublished.some((dir) => file.startsWith(dir)))
  const unknown = published.filter((file) => !pages.includes(file))
  const missing = pages.filter((page) => !published.includes(page))
  const problems = [
    ...unknown.map((file) => `docs/${file} is not in the page list (src/docs-pages.mjs)`),
    ...missing.map((page) => `docs/${page} is in the page list but missing from ws`),
  ]
  if (problems.length) throw new Error(problems.join('\n'))
  return published
}
