import express from "express";
import cors from "cors";
import { repositoryResources, RepositoryResources} from "./repository/resources";
import { Pool } from "pg";
import { repositoryChecks} from "./repository/check";
import { gitRepositoryClient} from "./repository/git-repositiory-client";
import {workspaceDataAccess} from "./repository/workspace-data-aceess";


const pool = new Pool({
    user: "postgres",
    database: "git_aggregation",
    host: "localhost",
    password: "borkage"
});


const app = express();
const port = 3001

const allowedOrigins = ['http://localhost:3000'];

const options: cors.CorsOptions = {
    origin: allowedOrigins
};

app.use(cors(options));

const repoResources: RepositoryResources = repositoryResources(
    repositoryChecks(
        gitRepositoryClient(),
        workspaceDataAccess(pool)
    )
)

app.get("/check", repoResources.checkHandler);

app.listen(port);