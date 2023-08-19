import fs from 'fs-extra'
import { ServiceError } from '@/error'
import { confirm } from '@inquirer/prompts'
import path from 'node:path'

interface Descriptor {
    // type: 'update' | 'new'
    path: string
    // when create 'new'
    content?: string
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
            return !!d.content || !!d.execRegExp
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
}
