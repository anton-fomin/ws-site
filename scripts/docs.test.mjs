import assert from 'node:assert/strict'
import { test } from 'node:test'

import { transformPage } from './docs.mjs'

test('the first heading becomes the page title', () => {
  const page = transformPage('# Layout\n\nThe workspace root is the directory holding `ws.yaml`.\n', {
    file: 'layout.md',
    tag: 'v0.8.0',
  })
  assert.match(page, /^---\ntitle: "Layout"\n/)
  assert.doesNotMatch(page, /^# Layout$/m)
  assert.match(page, /\nThe workspace root is the directory holding `ws.yaml`.\n$/)
})

const tag = 'v0.8.0'

test('links to other pages become relative site URLs, keeping the anchor', () => {
  const page = transformPage(
    '# Getting started\n\nSee [Commands](commands.md), [local files](integrations/local-files.md#modes) and [integrations](integrations/index.md).\n',
    { file: 'getting-started.md', tag },
  )
  assert.match(page, /\[Commands\]\(\.\.\/commands\/\)/)
  assert.match(page, /\[local files\]\(\.\.\/integrations\/local-files\/#modes\)/)
  assert.match(page, /\[integrations\]\(\.\.\/integrations\/\)/)
})

test('links from a nested page climb out of its directory', () => {
  const page = transformPage(
    '# Integrations\n\n[Multiplexers](multiplexers.md), [`ws run`](../tasks.md), [`bare_dir`](../configuration.md)\n',
    { file: 'integrations/index.md', tag },
  )
  assert.match(page, /\[Multiplexers\]\(multiplexers\/\)/)
  assert.match(page, /\[`ws run`\]\(\.\.\/tasks\/\)/)
  assert.match(page, /\[`bare_dir`\]\(\.\.\/configuration\/\)/)
})

test('links to files of the repository outside docs/ go to GitHub at the tag', () => {
  const page = transformPage('# Coding agents\n\n[`skills/ws/SKILL.md`](../skills/ws/SKILL.md)\n', {
    file: 'coding-agents.md',
    tag,
  })
  assert.match(page, /\(https:\/\/github\.com\/anton-fomin\/ws\/blob\/v0\.8\.0\/skills\/ws\/SKILL\.md\)/)
})

test('links inside fenced code and absolute links are left alone', () => {
  const markdown = '# Tasks\n\n[herdr](https://herdr.dev)\n\n```md\n[x](commands.md)\n```\n'
  const page = transformPage(markdown, { file: 'tasks.md', tag })
  assert.match(page, /\[herdr\]\(https:\/\/herdr\.dev\)/)
  assert.match(page, /```md\n\[x\]\(commands\.md\)\n```/)
})

test('"Edit this page" opens the source file on main', () => {
  const page = transformPage('# Fzf\n\ntext\n', { file: 'integrations/fzf-zoxide.md', tag })
  assert.match(page, /\neditUrl: "https:\/\/github\.com\/anton-fomin\/ws\/edit\/main\/docs\/integrations\/fzf-zoxide\.md"\n/)
})

import { checkPages } from './docs.mjs'
import { docsPages } from '../src/docs-pages.mjs'

test('the Docs source matches the page list, ignoring the agent docs', () => {
  assert.doesNotThrow(() => checkPages([...docsPages, 'agents/domain.md', 'adr/0001-x.md']))
})

test('a page missing from the page list fails the build', () => {
  assert.throws(() => checkPages([...docsPages, 'recipes.md']), /recipes\.md.*not in the page list/s)
})

test('a listed page missing from the Docs source fails the build', () => {
  assert.throws(() => checkPages(docsPages.filter((page) => page !== 'layout.md')), /layout\.md.*missing/s)
})

test('a link to a page that does not exist fails the build', () => {
  assert.throws(
    () => transformPage('# Layout\n\nSee [commands](comands.md).\n', { file: 'layout.md', tag }),
    /layout\.md: .*comands\.md/,
  )
})

test('links in indented and tilde fences are code too', () => {
  const markdown = '# Tasks\n\n- an example:\n\n  ```md\n  [x](nowhere.md)\n  ```\n\n~~~\n[y](nowhere.md)\n~~~\n'
  const page = transformPage(markdown, { file: 'tasks.md', tag })
  assert.match(page, /\[x\]\(nowhere\.md\)/)
  assert.match(page, /\[y\]\(nowhere\.md\)/)
})

test('reference-style link definitions are rewritten like inline links', () => {
  const page = transformPage('# Layout\n\nSee [commands].\n\n[commands]: commands.md#run\n', { file: 'layout.md', tag })
  assert.match(page, /^\[commands\]: \.\.\/commands\/#run$/m)
})

test('a link to a file in docs/ that is not a page fails the build', () => {
  assert.throws(
    () => transformPage('# Layout\n\n![diagram](images/layout.png)\n', { file: 'layout.md', tag }),
    /layout\.md: .*images\/layout\.png/,
  )
})

test('CRLF line endings and a byte order mark are tolerated', () => {
  const page = transformPage('﻿# Layout\r\n\r\nText [c](commands.md).\r\n', { file: 'layout.md', tag })
  assert.match(page, /^---\ntitle: "Layout"\n/)
  assert.match(page, /\[c\]\(\.\.\/commands\/\)/)
})
