import express from "express";
import cors from "cors";
import {getCheckHandler} from "./repository/check-resources";

const app = express();
const port = 3001

const allowedOrigins = ['http://localhost:3000'];

const options: cors.CorsOptions = {
    origin: allowedOrigins
};

app.use(cors(options));
app.get("/check", getCheckHandler);

app.listen(port);