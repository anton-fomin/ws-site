// @ts-check
import { readFileSync } from 'node:fs'

import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightVersions from 'starlight-versions'

import { minorSlug } from './scripts/versions.mjs'
import { docsSidebar, pageURL } from './src/docs-pages.mjs'

/** @type {import('./scripts/versions.mjs').VersionsState} */
const versions = JSON.parse(readFileSync(new URL('./versions.json', import.meta.url), 'utf8'))

/** `integrations/index.md` → `docs/integrations` */
const slug = (/** @type {string} */ file) => `docs/${pageURL(file)}`

const sidebar = docsSidebar.map((entry) =>
  typeof entry === 'string'
    ? slug(entry)
    : {
        label: entry.label,
        items: entry.items.map((file) =>
          file === `${pageURL(file)}/index.md` ? { label: 'Overview', slug: slug(file) } : slug(file),
        ),
      },
)

export default defineConfig({
  site: 'https://ws.fomin.space',
  redirects: { '/docs': '/docs/getting-started/' },
  integrations: [
    starlight({
      title: 'ws',
      description: 'One branch, every repo. Multi-repo git worktree workspaces.',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/anton-fomin/ws' }],
      customCss: [
        '@fontsource-variable/inter',
        '@fontsource/jetbrains-mono/400.css',
        '@fontsource/jetbrains-mono/700.css',
        './src/styles/tokens.css',
        './src/styles/starlight.css',
      ],
      sidebar,
      // The site has its own not-found page, styled like the Landing page.
      disable404Route: true,
      head: [
        { tag: 'meta', attrs: { property: 'og:image', content: 'https://ws.fomin.space/og.png' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
      ],
      // The plugin needs at least one older Docs version; until a second minor
      // release exists there is nothing to switch to.
      plugins: versions.archived.length
        ? [
            starlightVersions({
              current: { label: versions.latest ? `${minorSlug(versions.latest)} (latest)` : 'Latest' },
              versions: versions.archived.map((slug) => ({ slug })),
            }),
          ]
        : [],
    }),
  ],
})
