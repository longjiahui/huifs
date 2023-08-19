import { copyText, pasteText } from '@/utils'
import { DataSource, getDataFromDataSource } from '@/datasource'
import { ServiceError } from '@/error'

describe('datasource', () => {
    it('incorrect from option', async () => {
        try {
            await getDataFromDataSource({
                from: 'hello',
                base64Data: '',
            })
            // should not execute
            expect(true).toBe(false)
        } catch (err) {
            if (!(err instanceof ServiceError)) {
                throw err
            }
        }
    })

    it('get text datasource from clipboard', async () => {
        const original = await pasteText()
        const testText = 'hello world'
        await copyText(testText)
        try {
            expect(
                await getDataFromDataSource({
                    from: DataSource.cilpboard,
                })
            ).toBe(testText)
        } finally {
            await copyText(original)
        }
    })

    it('get text datasource from base64', async () => {
        const data = 'hello world'
        expect(
            await getDataFromDataSource({
                from: DataSource.base64,
                base64Data: btoa(data),
            })
        ).toBe(data)
    })
})