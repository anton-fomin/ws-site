import assert from 'node:assert/strict'
import { test } from 'node:test'

import { planRelease } from './versions.mjs'

test('a new minor release archives the outgoing Latest as a Docs snapshot', () => {
  const plan = planRelease({ latest: 'v0.8.2', archived: ['v0.7'] }, 'v0.9.0')
  assert.deepEqual(plan, {
    archive: { slug: 'v0.8', tag: 'v0.8.2' },
    build: 'v0.9.0',
    state: { latest: 'v0.9.0', archived: ['v0.8', 'v0.7'] },
  })
})

test('a patch release replaces Latest without a snapshot', () => {
  assert.deepEqual(planRelease({ latest: 'v0.8.0', archived: ['v0.7'] }, 'v0.8.1'), {
    archive: null,
    build: 'v0.8.1',
    state: { latest: 'v0.8.1', archived: ['v0.7'] },
  })
})

test('the first release with docs becomes Latest', () => {
  assert.deepEqual(planRelease({ latest: null, archived: [] }, 'v0.8.0'), {
    archive: null,
    build: 'v0.8.0',
    state: { latest: 'v0.8.0', archived: [] },
  })
})

test('a release older than Latest leaves everything as it is', () => {
  const state = { latest: 'v0.9.1', archived: ['v0.8'] }
  for (const tag of ['v0.8.3', 'v0.9.0', 'v0.9.1']) {
    assert.deepEqual(planRelease(state, tag), { archive: null, build: 'v0.9.1', state }, tag)
  }
})

test('a build without a release rebuilds Latest, or nothing before the first release', () => {
  const state = { latest: 'v0.9.1', archived: ['v0.8'] }
  assert.deepEqual(planRelease(state), { archive: null, build: 'v0.9.1', state })
  const empty = { latest: null, archived: [] }
  assert.deepEqual(planRelease(empty), { archive: null, build: null, state: empty })
})

test('a tag that is not a release fails', () => {
  assert.throws(() => planRelease({ latest: null, archived: [] }, 'nightly'), /nightly is not a release tag/)
})
