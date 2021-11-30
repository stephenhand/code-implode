export type Workspace = {
    id: string,
    owner: string,
    description: string
}

export type PublicRepoInfo = {
    title: string,
    description: string,
    owner: string,
    workspaces?: Workspace[]
}