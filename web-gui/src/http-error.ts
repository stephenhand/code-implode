import StatusCode from "status-code-enum";

export type SerializableError = {
    name: string;
    message: string;
    stack: string
}

export type NetworkError = {
    message: string
    underlyingError: SerializableError
}

export function isNetworkError(instance: unknown): instance is NetworkError {
    if (!instance) return false;
    const networkError = instance as NetworkError;
    return typeof networkError.message === "string" &&
        !!networkError.underlyingError  &&
        typeof networkError.underlyingError.message === "string";
}

export type HttpError = {
    message: string,
    status: StatusCode
};

export function isHttpError(instance: unknown): instance is HttpError {
    return !!instance && !!(instance as HttpError).message && !!(instance as HttpError).status;
}

export type HttpRequestOutcome<T> = T | NetworkError | HttpError

export function makeSerializable(error: Error): SerializableError {
    return {
        name: error.name,
        message: error.message,
        stack: error.stack ?? ""
    };
}

