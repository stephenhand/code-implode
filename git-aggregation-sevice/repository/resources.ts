import {RequestHandler} from "express";
import axios, {AxiosResponse} from "axios";
import StatusCode from "status-code-enum";
import {PublicRepoInfo} from "./models";
import { RepoChecks} from "./check";

type CheckQuery = {
    url: string
}

type RepoCheckResponse = PublicRepoInfo | string

type GetCheckHandler = RequestHandler<unknown, RepoCheckResponse, unknown, CheckQuery>

export type RepositoryResources = {
    checkHandler:GetCheckHandler
}

export function repositoryResources(checks: RepoChecks): RepositoryResources {
    return {
        checkHandler: async (request, response) => {
            const urlParam = request.query.url;
            //Fix a website URL to use the API
            const apiUrl = urlParam.replace("www.github.com", "github.com")
                .replace("github.com", "api.github.com/repos");
            if (apiUrl !== urlParam) {
                console.info(`Replacing web url '${urlParam}' with API url '${apiUrl}' for purposes of check.`)
            }
            const repoUrlDescription = `'${apiUrl}'${apiUrl !== urlParam ? ` (inferred from specified URL '${urlParam}')` : ""}`;
            try {
                const repoInfo = await checks.checkRepoUrl("guest", apiUrl);
                if (repoInfo) {
                    response.send(repoInfo);
                } else {
                    response
                        .status(StatusCode.ClientErrorNotFound)
                        .send(`Repo URL ${repoUrlDescription} could not be found`);
                }
            } catch (error: any) {
                console.log(`Error contacting ${repoUrlDescription}`, error)
                if (axios.isAxiosError(error) && error.response) {
                    response
                        .status(StatusCode.ServerErrorInternal)
                        .send(`Unexpected status code from repo URL ${repoUrlDescription}: ${error.response.status}\n${error.response.data}`);
                } else {
                    response
                        .status(StatusCode.ServerErrorInternal)
                        .send(`Non HTTP error thrown querying repo URL ${repoUrlDescription}: ${error.message}`);
                }
            }
        }
    }
}