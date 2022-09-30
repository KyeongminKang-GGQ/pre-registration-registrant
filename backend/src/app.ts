import express, { Application } from "express";
import bodyParser from "body-parser";
import { Routes } from "@routes/Routes";

export class App {
    app: Application;

    constructor() {
        this.app = express();
        this.setMiddleWare();
        this.setRouter();
    }

    private setMiddleWare = (): void => {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    };

    private setRouter = async (): Promise<void> => {
        try {
            this.app.use(new Routes().create());
        } catch (error) {
            process.exit(1);
        }
    };
}
