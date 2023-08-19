import { ServiceError } from '@/error'
import { Command } from 'commander'
import { paste } from 'copy-paste'

export enum DataSource {
    cilpboard = 'clipboard',
    base64 = 'base64',
}
export enum FromType {
    binary = 'binary',
    text = 'text',
}

export interface DataSourceOptions {
    from?: DataSource | string
    fromType?: FromType | string
    base64Data?: string
}

export function mixDataSourceOption(command: Command) {
    return command
        .option(
            '-f --from <source>',
            '入参来源(默认从剪贴板) clipboard | base64'
        )
        .option(
            '-ft --from-type <formatType>',
            '入参类型(默认text) binary | text'
        )
        .option('-b --base64-data <data>', '指定base64数据')
}

export async function getDataFromDataSource(options: DataSourceOptions) {
    let { from, base64Data, fromType } = options
    from = from || DataSource.cilpboard
    fromType = fromType || FromType.text
    if (!Object.values<string>(DataSource).includes(from)) {
        throw new ServiceError('incorrect from: ', from)
    }
    if (!Object.values<string>(FromType).includes(fromType)) {
        throw new ServiceError('incorrect from type: ', fromType)
    }
    if (from === DataSource.cilpboard) {
        if (fromType === FromType.text) {
            return paste()
        } else if (fromType === FromType.binary) {
            // do not support yet
            console.debug('do not suppport yet')
            // return await clipboardy.read()
        }
    } else if (from === DataSource.base64) {
        return (base64Data && atob(base64Data)) || ''
    }
    return ''
}
