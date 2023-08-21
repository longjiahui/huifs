export class ServiceError extends Error {
    public messages: any[]

    constructor(...messages: any[]) {
        const message = messages.map((m) => JSON.stringify(m)).join(' ')
        super(message)
        this.messages = messages
        this.message = message
    }
}
export function catchServiceError<T>(
    err: T,
    _level: 'debug' | 'error' | 'warn' | 'info' = 'debug'
) {
    if (err instanceof ServiceError) {
        // console[_level]('service error: ', ...err.messages)
    } else {
        throw err
    }
}
