import fs, { ensureFile, ensureFileSync, readFile, writeFile } from 'fs-extra'
import { ServiceError } from '@/error'
import { confirm } from '@inquirer/prompts'
import path from 'node:path'

interface Descriptor {
    // type: 'update' | 'new'
    path: string
    content: string
    // when Update 'append'
    execRegExp?: RegExp

    // when create default false
    forceCreate?: boolean
    // when update defualt false
    forceReplace?: boolean
}

export async function validateDescriptors(ds: Descriptor[]) {
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

export async function applyFileDescriptors(ds: Descriptor[]) {
    await validateDescriptors(ds)
    await Promise.all(
        ds.map(async (d) => {
            const p = path.resolve(d.path)
            await ensureFile(p)
            if (d.execRegExp) {
                // replace some
                const originalContent = (await readFile(p)).toString('utf-8')
                await writeFile(
                    p,
                    originalContent.replace(d.execRegExp, d.content)
                )
            } else {
                // replace all
                await writeFile(p, d.content)
            }
        })
    )
}
