import { copyText, pasteText } from '../src/utils.js'
import {
    getDataFromDataSource,
    DS_CLIPBOARD,
    FT_BASE64,
    DS_STDIN,
} from '../src/datasource.js'
import { catchServiceError } from '../src/error.js'

describe('datasource', () => {
    it('incorrect from option', async () => {
        await getDataFromDataSource({
            from: 'hello',
            base64Data: '',
        })
            .then(() => {
                expect(true).toBe(false)
            })
            .catch(catchServiceError)
        // should not execute
    })

    it('get text datasource from clipboard', async () => {
        const original = await pasteText()
        const testText = 'hello world'
        await copyText(testText)
        try {
            expect(
                await getDataFromDataSource({
                    from: DS_CLIPBOARD,
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
                from: DS_STDIN,
                fromType: FT_BASE64,
                data: btoa(data),
            })
        ).toBe(data)
    })
})
