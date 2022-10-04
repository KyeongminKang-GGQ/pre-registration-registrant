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

import dotenv from "dotenv";
import logger from "@common/logger";
console.log(`start with env: ${process.env.ENVIRONMENT}`);

// If ENV_PATH isn't null, set it as dotenv file.
switch (process.env.ENVIRONMENT) {
    case "dev": {
        dotenv.config({
            path: ".env.dev",
        });
        break;
    }
    case "stg": {
        dotenv.config({
            path: ".env.stg",
        });
        break;
    }
    case "prod": {
        dotenv.config({
            path: ".env.prod",
        });
        break;
    }
    default: {
        dotenv.config();
    }
}

console.log(`local web server: ${process.env.LOCAL_WEB_SERVER}`);
const PORT = process.env.PORT || 3000;
const app = new App().app;
const server = createServer(app);

server.listen(PORT, () => {
    logger.debug(`Listening on :[${process.env.ENVIRONMENT}], [${PORT}]...`);
});
