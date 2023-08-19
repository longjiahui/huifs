import { ServiceError } from '@/error'

beforeAll(() => {
    process.addListener('uncaughtExceptionMonitor', (err) => {
        if (err instanceof ServiceError) {
            console.warn(...err.messages)
        } else {
            throw err
        }
    })
})

test('all', () => {})
