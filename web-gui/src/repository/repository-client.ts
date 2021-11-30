import axios, {AxiosError} from "axios";
import StatusCode from "status-code-enum";
import {HttpError, HttpRequestOutcome, isHttpError, makeSerializable} from "../http-error";
import configuration from "../config/configuration";

export type PublicRepoInfo = {
    title: string,
    description: string,
    owner: string
}

export type RepoNotFoundError = {
    message: string
    httpError: HttpError
}

export function isRepoNotFoundError(instance: unknown): instance is RepoNotFoundError {
    return typeof (instance as RepoNotFoundError).message === "string" &&
        isHttpError((instance as RepoNotFoundError).httpError)
}

export type CheckRepoRequestOutcome = HttpRequestOutcome<PublicRepoInfo | RepoNotFoundError>

export async function checkRepoUrl(url: URL): Promise<CheckRepoRequestOutcome> {
    let response;
    try {
        response = await axios.get(`${configuration.GIT_AGGREGATION_SERVICE_HOST}/check?url=${url}`);
        return response.data as PublicRepoInfo;
    } catch (untypedError: any) {
        const error: Error = (untypedError instanceof Error) ? untypedError :
            new Error((untypedError ?? "no error payload").toString())
        if (axios.isAxiosError(error) && error.response) {
            switch (error.response.status) {
                case StatusCode.SuccessOK:
                case StatusCode.ClientErrorNotFound:
                    return {
                        message: `No valid code repo could be found at ${url}`,
                        httpError: {
                            status: StatusCode.ClientErrorNotFound,
                            message: error.response.data?.toString()
                        }
                    };
                default:
                    return {
                        status: StatusCode.ServerErrorInternal,
                        message: error.response.data?.toString()
                    }
            }
        }
        return {
            message: `Network error occurred calling ${url}`,
            underlyingError: makeSerializable(error)
        };
    }

}