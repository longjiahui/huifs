export declare class ServiceError extends Error {
    messages: any[];
    constructor(...messages: any[]);
}
export declare function catchServiceError<T>(err: T, _level?: 'debug' | 'error' | 'warn' | 'info'): void;
