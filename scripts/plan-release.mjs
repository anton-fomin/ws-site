// The CI side of planRelease: reads versions.json, prints the plan as GitHub
// step outputs, and with --write stores the new state.
//
//   node scripts/plan-release.mjs [tag] >> "$GITHUB_OUTPUT"
//   node scripts/plan-release.mjs --write [tag]

import { readFile, writeFile } from 'node:fs/promises'
import { parseArgs } from 'node:util'

import { planRelease } from './versions.mjs'

const { values, positionals } = parseArgs({ options: { write: { type: 'boolean' } }, allowPositionals: true })
const file = new URL('../versions.json', import.meta.url)
const plan = planRelease(JSON.parse(await readFile(file, 'utf8')), positionals[0] || undefined)

if (values.write) {
  await writeFile(file, `${JSON.stringify(plan.state, null, 2)}\n`)
} else {
  console.log(`archive_slug=${plan.archive?.slug ?? ''}`)
  console.log(`archive_tag=${plan.archive?.tag ?? ''}`)
  console.log(`build=${plan.build ?? ''}`)
}
