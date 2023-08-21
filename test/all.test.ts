import { ServiceError, catchServiceError } from '@/error'
import { forTestPath } from '@/utils'
import { ensureDir, rmdir } from 'fs-extra'

beforeAll(async () => {
    process.on('uncaughtException', (err) => {
        return catchServiceError(err)
    })
})

beforeEach(async () => {
    await ensureDir(forTestPath())
})
afterEach(async () => {
    await rmdir(forTestPath())
})

test('all', () => {})
