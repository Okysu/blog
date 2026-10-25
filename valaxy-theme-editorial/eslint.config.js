// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: false,
    test: false,
    formatters: true,
    markdown: false,
  },
  {
    ignores: [
      'temp/**',
      '**/*/.valaxy',
      '**/public/feed.{json,xml}',
      '**/public/atom.xml',
      '**/public/valaxy-fuse-list.json',
    ],
  },
)
