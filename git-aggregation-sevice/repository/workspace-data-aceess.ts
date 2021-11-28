import {Pool} from "pg";
import {Workspace} from "./models";

const WORKSPACE_BY_REPO_SQL = "SELECT workspace_id, description FROM repository_workspaces WHERE owner=$1 AND git_url=$2"

export type WorkspaceDataAccess = {
    getWorkspacesByOwnerAndRepo: (owner: string, repo: string) => Promise<Workspace[]>
}

export function workspaceDataAccess(pool: Pool): WorkspaceDataAccess {
    return {
        async getWorkspacesByOwnerAndRepo(owner: string, repo: string) {
            return (await pool.query(WORKSPACE_BY_REPO_SQL, [owner, repo]))
                .rows
                .map<Workspace>(record => ({
                    owner,
                    description:record["description"],
                    id:record["workspace_id"]
                }));
        }
    }
}