import assert from 'node:assert/strict'
import { test } from 'node:test'

import { shellCommands, splitShellCommands } from './shell-commands.mjs'

test('shell fences render through the shared component without changing command text', () => {
  for (const lang of ['sh', 'shell', 'bash', 'zsh', 'fish', 'shellscript']) {
    const command = '# setup\necho "<tag> & café"\nws fetch\n'
    const node = shellCommands.code({ lang, value: command })
    assert.ok(node)
    assert.equal(node.type, 'html')
    assert.deepEqual(splitShellCommands(`<p>Before</p>${node.value}<p>After</p>`), [
      { html: '<p>Before</p>' }, { command }, { html: '<p>After</p>' },
    ])
  }
})

test('configuration, directory trees and output stay unchanged', () => {
  const nodes = [
    { type: 'code', lang: 'yaml', value: 'logs:\n  enabled: true' },
    { type: 'code', lang: 'nix', value: '{ packages = []; }' },
    { type: 'code', value: 'workspace/\n  api/' },
    { type: 'code', value: 'api | listening on :8080' },
  ]
  for (const node of nodes) assert.equal(shellCommands.code(node), undefined)
})

test('multiple commands retain the surrounding HTML', () => {
  const nodes = [
    { type: 'code', lang: 'sh', value: 'ws fetch' },
    { type: 'code', lang: 'sh', value: 'ws run dev' },
  ]
  const markers = nodes.map(node => shellCommands.code(node)?.value)
  assert.deepEqual(splitShellCommands(`<blockquote>${markers[0]}<p>Next</p>${markers[1]}</blockquote>`), [
    { html: '<blockquote>' }, { command: 'ws fetch' }, { html: '<p>Next</p>' },
    { command: 'ws run dev' }, { html: '</blockquote>' },
  ])
})
