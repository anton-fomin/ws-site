// Writes the Docs source of a ws checkout into src/content/docs/docs/ as Latest.
//
//   pnpm fetch-docs                             # from ../ws, links to GitHub at main
//   pnpm fetch-docs --from .ws-src --tag v0.8.0       # what CI does

import fs from 'node:fs/promises'
import path from 'node:path'
import { parseArgs } from 'node:util'

import { checkPages, transformPage } from './docs.mjs'

const { values } = parseArgs({
  options: {
    from: { type: 'string', default: '../ws' },
    tag: { type: 'string', default: 'main' },
  },
})

const source = path.resolve(values.from, 'docs')
const target = path.resolve('src/content/docs/docs')

const files = (await fs.readdir(source, { recursive: true }))
  .map((file) => file.split(path.sep).join('/'))
  .filter((file) => file.endsWith('.md'))
  .sort()
const published = checkPages(files)

await fs.rm(target, { recursive: true, force: true })
for (const file of published) {
  const page = transformPage(await fs.readFile(path.join(source, file), 'utf8'), { file, tag: values.tag })
  await fs.mkdir(path.dirname(path.join(target, file)), { recursive: true })
  await fs.writeFile(path.join(target, file), page)
}
// The JSON Schema of ws.yaml, published at /schema/ws.json for editors. Releases
// older than the schema have none, and then the site simply has no schema yet.
const schema = path.resolve(values.from, 'schema/ws.schema.json')
const schemaTarget = path.resolve('public/schema/ws.json')
await fs.rm(path.dirname(schemaTarget), { recursive: true, force: true })
if (await fs.stat(schema).then(() => true, () => false)) {
  await fs.mkdir(path.dirname(schemaTarget), { recursive: true })
  await fs.copyFile(schema, schemaTarget)
}
console.log(`wrote ${published.length} pages from ${source} (${values.tag}) to ${target}`)
