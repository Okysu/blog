import { execSync } from 'node:child_process'
import { copyFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
await mkdir(resolve(root, 'vendor'), { recursive: true })
await copyFile(
  resolve(root, 'valaxy-theme-editorial/artifacts/valaxy-theme-editorial-0.1.0.tgz'),
  resolve(root, 'vendor/valaxy-theme-editorial-0.1.0.tgz'),
)
// The checked-in tarball lets CI and Docker install the same portable package.
execSync('pnpm add ./vendor/valaxy-theme-editorial-0.1.0.tgz', { cwd: root, stdio: 'inherit' })
