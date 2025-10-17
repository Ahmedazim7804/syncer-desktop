export class SyncerError<T> extends Error {
    constructor(public message: string, public data: T, public nameOfError: string | undefined = undefined, public stack: string | undefined = undefined) {
        super(message);
        this.message = message;
        this.data = data;
        this.name = nameOfError ?? ('SyncerError of type ' + typeof data);
        this.stack = stack;
    }
}

export interface Toast {
    title: string;
    description: string;
    type: 'error' | 'success' | 'info' | 'warning';
}

export interface ToastsOnError extends Toast {
    title: string;
    description: string;
    type: 'error';
}

export interface ToastsOnSuccess extends Toast {
    title: string;
    description: string;
    type: 'success';
}

export interface ToastsOnStatusCodes {
    200: ToastsOnSuccess | undefined;
    400: ToastsOnError | undefined;
    401: ToastsOnError | undefined;
    403: ToastsOnError | undefined;
    404: ToastsOnError | undefined;
    500: ToastsOnError | undefined;
    503: ToastsOnError | undefined;
}

export enum AuthErrors {
    UNAUTHORIZED = 'Unauthorized',
    CONNECTION_ERROR = 'Connection error',
    UNKNOWN_ERROR = 'Unknown error',
    MUST_LOGOUT = 'Must logout',
}