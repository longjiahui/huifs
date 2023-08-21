import { catchServiceError } from '@/error'
import { applyFileDescriptors, validateDescriptors } from '@/file'
import { forExistsTestDir, forExistsTestFile, forTestPath } from '@/utils'
import { readFile, rmdir, writeFile } from 'fs-extra'
import { stdin } from 'mock-stdin'
import path from 'node:path'

beforeEach(async () => {
    await rmdir(forExistsTestDir(), { recursive: true })
    forExistsTestDir()
})

afterEach(async () => {
    await rmdir(forExistsTestDir(), { recursive: true })
})

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
        const p = forExistsTestFile('test')
        const originalContent = 'mark$1mark$1mark'
        await writeFile(p, originalContent)
        // update
        const toBeInsert = 'helloworld'
        const input = stdin()
        const promise = applyFileDescriptors([
            {
                path: p,
                content: `$1${toBeInsert}`,
                execRegExp: new RegExp('(\\$1)', 'g'),
            },
        ])
        setTimeout(() => {
            input.send('y\n')
        })
        await promise
        input.send(null)
        expect((await readFile(p)).toString('utf-8')).toBe(
            originalContent.replace(/\$1/g, `$1${toBeInsert}`)
        )
    })

    test('create', async () => {
        // prepare file
        const p = forExistsTestFile('test')
        // create
        const content = 'helloworld'
        const input = stdin()
        const promise = applyFileDescriptors([
            {
                path: p,
                content,
            },
        ])
        setTimeout(() => {
            input.send('y\n')
        })
        await promise
        input.send(null)
        expect((await readFile(p)).toString('utf-8')).toBe(content)
    })

    test('create-force', async () => {
        const p = forTestPath('test')
        // create
        const content = 'helloworld'
        await applyFileDescriptors([
            {
                path: p,
                content,
                forceCreate: true,
            },
        ])
        expect((await readFile(p)).toString('utf-8')).toBe(content)
    })
    test('update-force', async () => {
        // prepare file
        const p = forExistsTestFile('test')
        const originalContent = 'mark$1mark$1mark'
        await writeFile(p, originalContent)
        // update
        const toBeInsert = 'helloworld'
        await applyFileDescriptors([
            {
                path: p,
                content: `$1${toBeInsert}`,
                execRegExp: new RegExp('(\\$1)', 'g'),
                forceReplace: true,
            },
        ])
        expect((await readFile(p)).toString('utf-8')).toBe(
            originalContent.replace(/\$1/g, `$1${toBeInsert}`)
        )
    })
})
