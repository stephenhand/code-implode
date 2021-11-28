CREATE TABLE IF NOT EXISTS repository_workspaces (
    owner varchar(256),
    git_url varchar(256),
    workspace_id varchar(256),
    description varchar(256),
    PRIMARY KEY(owner, git_url, workspace_id)
);
