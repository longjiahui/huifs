import { copy, paste } from 'copy-paste'
import { pkgUpSync } from 'pkg-up'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from './fs.js'

export async function copyText(text) {
    return new Promise((r, reject) =>
        copy(text, (err) => (err != null && reject(err)) || r())
    )
}
export async function pasteText() {
    return new Promise((r, reject) =>
        paste((err, result) => (null == err ? r(result) : reject(err)))
    )
}
export function packagePath(
    cwd = path.dirname(fileURLToPath(import.meta.url))
) {
    const packagePath = pkgUpSync({ cwd })
    if (!packagePath) {
        throw new Error('can not find package path')
    }
    return path.dirname(packagePath)
}
// string[]
export function forTestPath(...rest) {
    return path.resolve(packagePath(), '.for_test', ...rest)
}
// string[]
export function forExistsTestFile(...rest) {
    const p = forTestPath(...rest)
    fs.ensureFileSync(p)
    return p
}
// string[]
export function forExistsTestDir(...rest) {
    const p = forTestPath(...rest)
    fs.ensureDirSync(p)
    return p
}
