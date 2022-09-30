import moduleAlias from "module-alias";
moduleAlias.addAliases({
    "@config": `${__dirname}/config`,
    "@controllers": `${__dirname}/controllers`,
    "@repositories": `${__dirname}/models/repositories`,
    "@models": `${__dirname}/models`,
    "@routes": `${__dirname}/routes`,
    "@workers": `${__dirname}/workers`,
    "@common": `${__dirname}`,
});

import { createServer } from "http";
import { App } from "./app";
import { Request, Response, Router } from "express";

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = new App().app;
const server = createServer(app);

server.listen(PORT, () => {
    console.log(`Listening on :[${PORT}]...`);
});

const router = Router();
router.get("/preregistered-email", (req: Request, res: Response) => {
    console.log("[Server] request /preregistered-email");
});
