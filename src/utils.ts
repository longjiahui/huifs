import { copy, paste } from 'copy-paste'

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
