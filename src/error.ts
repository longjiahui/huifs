export class ServiceError extends Error {
    public messages: any[]

    constructor(...messages: any[]) {
        const message = messages.map((m) => JSON.stringify(m)).join(' ')
        super(message)
        this.messages = messages
        this.message = message
    }
}
