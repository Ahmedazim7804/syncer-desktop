export interface HttpErrorObject {
    status: number;
    error: string;
    message: string;
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