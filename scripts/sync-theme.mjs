import { execSync } from 'node:child_process'
import { copyFile, mkdir, readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { version } = JSON.parse(await readFile(resolve(root, 'valaxy-theme-editorial/theme/package.json'), 'utf8'))
if (!/^\d+\.\d+\.\d+(?:-[a-z\d.-]+)?$/i.test(version))
  throw new Error('Invalid theme package version')
const archiveName = `valaxy-theme-editorial-${version}.tgz`
await mkdir(resolve(root, 'vendor'), { recursive: true })
await copyFile(
  resolve(root, 'valaxy-theme-editorial/artifacts', archiveName),
  resolve(root, 'vendor', archiveName),
)
// The checked-in tarball lets CI and Docker install the same portable package.
execSync(`pnpm add ./vendor/${archiveName}`, { cwd: root, stdio: 'inherit' })
