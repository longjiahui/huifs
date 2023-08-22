import { ServiceError } from './error.js'
import { paste } from 'copy-paste'

export function mixDataSourceOption(command) {
    return command
        .option(
            '-f --from <source>',
            '入参来源(默认从剪贴板) clipboard | stdin'
        )
        .option(
            '-ft --from-type <formatType>',
            '入参类型(默认text) binary | text'
        )
        .option('-d <data>', '指定参数')
}

export const FT_TEXT = 'text'
export const FT_BASE64 = 'base64'

export const FT_BINARY = 'binary'

export const FTS_TEXT = [FT_TEXT, FT_BASE64]
export const FTS_BINARY = [FT_BINARY]
export const FTS = [...FTS_TEXT, ...FTS_BINARY]

export const DS_CLIPBOARD = 'clipboard'
export const DS_STDIN = 'stdin'
export const DSS = [DS_CLIPBOARD, DS_STDIN]

export async function getDataFromDataSource(options) {
    let { from, data, fromType } = options
    from = from || DS_CLIPBOARD
    fromType = fromType || FT_TEXT
    if (!DSS.includes(from)) {
        throw new ServiceError('incorrect from: ', from)
    }
    if (!FTS.includes(fromType)) {
        throw new ServiceError('incorrect from type: ', fromType)
    }
    let text = ''
    if (from === DS_CLIPBOARD) {
        if (FTS_TEXT.includes(fromType)) {
            text = paste()
        } else if (fromType === FromType.binary) {
            // do not support yet
            console.debug('do not suppport yet')
            // return await clipboardy.read()
        }
    } else if (from === DS_STDIN) {
        text = data || ''
    }
    if (FT_BASE64 === fromType) {
        return atob(text)
    } else if (FT_TEXT === fromType) {
        return text
    } else {
        return text
    }
}
