import { copy, paste } from 'copy-paste'
import { pkgUpSync } from 'pkg-up'
import path from 'node:path'

export async function copyText(text: string) {
    return new Promise<void>((r, reject) =>
        copy(text, (err) => (err != null && reject(err)) || r())
    )
}
export async function pasteText(): Promise<string> {
    return new Promise((r, reject) =>
        paste((err, result) => (null == err ? r(result) : reject(err)))
    )
}
export function packagePath(cwd = __dirname) {
    const packagePath = pkgUpSync({ cwd })
    if (!packagePath) {
        throw new Error('can not find package path')
    }
    return packagePath
}
export function forTestPath(...rest: string[]) {
    return path.resolve(packagePath(), '.for_test', ...rest)
}
