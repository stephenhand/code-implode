import {RequestHandler, Request, Response} from "express";
import axios, {AxiosResponse} from "axios";
import StatusCode from "status-code-enum";

type CheckQuery = {
    url: string
}

type PublicRepoInfo = {
    title: string,
    description: string,
    owner: string
}

type RepoCheckResponse = PublicRepoInfo | string

type GithubRepoResponse = {
    name: string
    description: string
    owner: {
        login: string
    }
}

export const getCheckHandler:RequestHandler<unknown, RepoCheckResponse, unknown, CheckQuery> = async (req: Request<unknown, RepoCheckResponse, unknown, CheckQuery>, response)=> {
    const urlParam = req.query.url;
    //Fix a website URL to use the API
    const apiUrl = urlParam.replace("www.github.com", "github.com")
                           .replace("github.com", "api.github.com/repos");
    const repoUrlDescription = `'${apiUrl}'${apiUrl !== urlParam ? ` (inferred from specified URL '${urlParam}')` : ""}`;
    try {
        const githubResponse = await axios.get<GithubRepoResponse>(apiUrl);
        console.log(`Response received from ${repoUrlDescription}`, githubResponse.status, githubResponse.data);
        response.send({
            owner: githubResponse.data.owner.login,
            title: githubResponse.data.name,
            description: githubResponse.data.description
        });
    }
    catch (error: any) {
        console.log(`Error contacting ${repoUrlDescription}`, error)
        if (error.response)    {
            const errorResponse: AxiosResponse<GithubRepoResponse> = error.response;
            switch (errorResponse.status) {
                case StatusCode.ClientErrorNotFound:
                    response
                        .status(StatusCode.ClientErrorNotFound)
                        .send(`Repo URL ${repoUrlDescription} could not be found`);
                    return;
                default:
                    response
                        .status(StatusCode.ServerErrorInternal)
                        .send(`Unexpected status code from repo URL ${repoUrlDescription}: ${errorResponse.status}\n${errorResponse.data}`);
                    return;
            }

        }
        else {
            response
                .status(StatusCode.ServerErrorInternal)
                .send(`Non HTTP error thrown querying repo URL ${repoUrlDescription}: ${error.message}`);
        }
    }

}