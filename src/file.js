import fs from './fs.js'
import { ServiceError } from './error.js'
import { confirm } from '@inquirer/prompts'
import path from 'node:path'

// ds : Descriptor[]
export async function validateDescriptors(ds) {
    // filter
    ds = ds
        .filter((d) => {
            return !!d.content
        })
        .map((d) => ({ ...d, path: path.resolve(d.path) }))
    // 1 校验
    if (
        (
            await Promise.all(
                ds.map(async (d) => {
                    if (!fs.existsSync(d.path)) {
                        if (!d.forceCreate) {
                            if (
                                !(await confirm({
                                    message: `是否创建文件: ${d.path}`,
                                    default: true,
                                }))
                            ) {
                                return false
                            }
                        }
                    } else {
                        if (!d.forceReplace) {
                            if (
                                !(await confirm({
                                    message: `是否覆盖文件: ${d.path}`,
                                    default: true,
                                }))
                            ) {
                                return false
                            }
                        }
                    }
                    return true
                })
            )
        ).some((r) => !r)
    ) {
        throw new ServiceError('abort')
    }
}

// ds: Descriptor[]
export async function applyFileDescriptors(ds) {
    await validateDescriptors(ds)
    await Promise.all(
        ds.map(async (d) => {
            const p = path.resolve(d.path)
            await fs.ensureFile(p)
            if (d.execRegExp) {
                // replace some
                const originalContent = (await fs.readFile(p)).toString('utf-8')
                await fs.writeFile(
                    p,
                    originalContent.replace(d.execRegExp, d.content)
                )
            } else {
                // replace all
                await fs.writeFile(p, d.content)
            }
        })
    )
}
