export class HTTPError extends Error {
    code: number
    constructor(message: string, code: number) {
        super(message)
        this.name = 'HttpError'
        this.message = message
        this.code = code
    }
}

export const isPostgresError = (error: any): boolean =>{
    return (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        'file' in error &&
        'line' in error &&
        'routine' in error
    )
}

export const isHttpError = (err: any) => 'code' in err


export type THTTPErr = typeof HTTPError