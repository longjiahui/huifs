import { validateDescriptors } from '@/files'
import { stdin } from 'mock-stdin'

test('validate file descriptors', async () => {
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
