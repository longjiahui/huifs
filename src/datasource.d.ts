import type { Command } from 'commander'
export declare enum DataSource {
    cilpboard = 'clipboard',
    base64 = 'base64',
}
export declare enum FromType {
    binary = 'binary',
    text = 'text',
}

export const FT_TEXT = 'text'
export const FT_BASE64 = 'base64'

export const FT_BINARY = 'binary'

export const FTS_TEXT: number[]
export const FTS_BINARY: number[]
export const FTS: number[]

export const DS_CLIPBOARD = 'clipboard'
export const DS_STDIN = 'stdin'
export const DSS: number[]

export interface DataSourceOptions {
    from?: DataSource | string
    fromType?: FromType | string
    base64Data?: string
}
export declare function mixDataSourceOption(command: Command): Command
export declare function getDataFromDataSource(
    options: DataSourceOptions
): Promise<string>
