import axios, {AxiosError} from "axios";
import StatusCode from "status-code-enum";
import {HttpError, HttpRequestOutcome, isHttpError, makeSerializable} from "../http-error";

const REPO_SERVICE_URL = "http://localhost:3001"

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
        response = await axios.get(`${REPO_SERVICE_URL}/check?url=${url}`);
        return response.data as PublicRepoInfo;
    } catch (error) {
        const axiosError: AxiosError = <AxiosError>error;
        if (axiosError.response) {
            switch (axiosError.response.status) {
                case StatusCode.SuccessOK:
                case StatusCode.ClientErrorNotFound:
                    return {
                        message: `No valid code repo could be found at ${url}`,
                        httpError: {
                            status: StatusCode.ClientErrorNotFound,
                            message: axiosError.response.data?.toString()
                        }
                    };
                default:
                    return {
                        status: StatusCode.ServerErrorInternal,
                        message: axiosError.response.data?.toString()
                    }
            }
        }
        return {
            message: `Network error occurred calling ${url}`,
            underlyingError: makeSerializable(axiosError)
        }
    }

}