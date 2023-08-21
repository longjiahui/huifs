import { catchServiceError } from '@/error'
import { applyFileDescriptors, validateDescriptors } from '@/files'
import { forTestPath } from '@/utils'
import { readFile, writeFile } from 'fs-extra'
import { stdin } from 'mock-stdin'
import path from 'node:path'

describe('validateDescriptors', () => {
    test('update-yes', async () => {
        const input = stdin()
        const promise = validateDescriptors([
            {
                path: __filename,
                content: 'hello',
            },
        ])
        // timeout priority is lower than promise
        setTimeout(() => {
            input.send('y\n')
        })
        await promise
        input.send(null)
    })

    test('update-no', async () => {
        const input = stdin()
        const promise = validateDescriptors([
            {
                path: __filename,
                content: 'hello',
            },
        ])
        // timeout priority is lower than promise
        setTimeout(() => {
            input.send('n\n')
        })
        await promise.catch(catchServiceError)
        input.send(null)
    })

    test('create-yes', async () => {
        const input = stdin()
        const promise = validateDescriptors([
            {
                path: path.resolve(__dirname, 'donotexists.file'),
                content: 'hello',
            },
        ])
        // timeout priority is lower than promise
        setTimeout(() => {
            input.send('y\n')
        })
        await promise
        input.send(null)
    })

    test('create-no', async () => {
        const input = stdin()
        const promise = validateDescriptors([
            {
                path: path.resolve(__dirname, 'donotexists.file'),
                content: 'hello',
            },
        ])
        // timeout priority is lower than promise
        setTimeout(() => {
            input.send('n\n')
        })
        await promise.catch(catchServiceError)
        input.send(null)
    })
})

describe('applyFileDescriptors', () => {
    test('update', async () => {
        // prepare file
        const p = forTestPath('test')
        await writeFile(p, 'mark$1mark$1mark')
        // update
        const toBeInsert = 'helloworld'
        await applyFileDescriptors([
            {
                path: p,
                content: `$1${toBeInsert}`,
                execRegExp: new RegExp('(\\$1)', 'g'),
            },
        ])
        console.debug((await readFile(p)).toString('utf-8'))
    })
})
