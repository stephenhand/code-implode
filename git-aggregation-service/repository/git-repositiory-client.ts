import axios, {AxiosResponse, AxiosError} from "axios";
import {PublicRepoInfo} from "./models";
import StatusCode from "status-code-enum";

type GithubRepoResponse = {
    name: string
    description: string
    owner: {
        login: string
    }
}

export type GitRepositoryClient = {
    queryRepo: (repoUrl: string) => Promise<PublicRepoInfo | undefined>
}

export function gitRepositoryClient() {
    return {
        async queryRepo(repoUrl: string) {
            try {
                const githubResponse = await axios.get<GithubRepoResponse>(repoUrl);
                console.debug(`Response received from ${repoUrl}`, githubResponse.status, githubResponse.data);
                return {
                    owner: githubResponse.data.owner.login,
                    title: githubResponse.data.name,
                    description: githubResponse.data.description
                }
            }
            catch (error: any) {
                if (axios.isAxiosError(error)
                    && error.response
                    && error.response.status === StatusCode.ClientErrorNotFound
                ) {
                    return;
                }
            }
        }
    }
}