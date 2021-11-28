import {WorkspaceDataAccess} from "./workspace-data-aceess";
import {GitRepositoryClient} from "./git-repositiory-client";
import {Workspace} from "./models";

export type PublicRepoInfo = {
    title: string,
    description: string,
    owner: string,
    workspaces?: Workspace[]
}

export type RepoChecks = {
    checkRepoUrl: (owner: string, repUrl: string) => Promise<PublicRepoInfo | undefined>
}

export function repositoryChecks(gitRepoClient: GitRepositoryClient, workspaceDataAccess: WorkspaceDataAccess): RepoChecks {
    return {
        async checkRepoUrl(owner: string, repUrl: string) {
            const repoInfo = await gitRepoClient.queryRepo(repUrl);
            if (!repoInfo) {
                return; // Repo not found
            }
            try {
                repoInfo.workspaces = await workspaceDataAccess.getWorkspacesByOwnerAndRepo(owner, repUrl);
                console.info(`${repoInfo.workspaces.length} workspaces for repo '${repUrl}' owned by '${owner}'. Check data will not include workspace information`)
                console.debug(repoInfo.workspaces.map(w => w.id));
            }
            catch (dbError) {
                console.warn(`Error querying workspaces for repo '${repUrl}' owned by '${owner}'. Check data will not include workspace information`, dbError)
            }
            return repoInfo;
        }
    }
}