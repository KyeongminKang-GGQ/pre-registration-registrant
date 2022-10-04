import { UserRepository } from "@common/repositories/UserRepository";
import { NextFunction, Request, Response, Router } from "express";
import axios from "axios";
import logger from "@common/logger";
import { ApplicationServerApis } from "@workers/ApplicationServerApis";

const AUTHORIZED = [
    "kyeongmin.kang@ggq.gg",
    "seungmin.ha@ggq.gg",
    "ilhong.jang@ggq.gg",
    "garham.kwon@ggq.gg",
];

export class Routes {
    create = (): Router => {
        const router = Router();
        const userRepository = new UserRepository();
        const applicationServerApis = new ApplicationServerApis();

        router.use("/*", (req: Request, res: Response, next: NextFunction) => {
            res.header("Access-Control-Allow-Origin", process.env.LOCAL_WEB_SERVER);
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
            res.setHeader(
                "Access-Control-Allow-Headers",
                "X-Requested-With,Content-Type,Content-Language,Authorization",
            );
            next();
        });

        router.get("/health", async (req: Request, res: Response) => {
            res.status(200).json({
                server: process.env.LOCAL_SERVER,
                port: process.env.PORT,
            });
        });

        router.get("/summoners/by-name/:summonerName", async (req: Request, res: Response) => {
            try {
                res.status(200).json({
                    puuid: await applicationServerApis.getPuuid(req.params.summonerName),
                });
            } catch (err) {
                res.status(400).send({
                    errorMessage: err.errorMessage,
                });
            }
        });

        router.get("/preregistered-email", async (req: Request, res: Response) => {
            try {
                if (!req.query.email && !req.query.puuid) {
                    res.status(200).json(await userRepository.findAll());
                } else {
                    const user = await userRepository.findOne(
                        <string>req.query.email,
                        <string>req.query.puuid,
                    );
                    console.log(user);
                    if (!user) {
                        res.status(200).json({
                            status: "SUCCESS",
                            info: user,
                        });
                    } else {
                        res.status(400).send({
                            errorMessage: "이미 등록된 이메일입니다.",
                        });
                    }
                }
            } catch (err) {
                console.log(err);
                res.status(500).send({
                    errorMessage: err.message,
                });
            }
        });

        router.post("/preregistered-email", async (req: Request, res: Response) => {
            const authorization = req.headers.authorization;
            if (authorization) {
                const bearer = authorization.split(" ");
                const accessToken = bearer[1];
                logger.debug(`accessToken: ${accessToken}`);

                try {
                    const userInfoResponse = await axios.get(
                        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`,
                        {
                            headers: {
                                accept: "application/json",
                            },
                        },
                    );

                    const email = userInfoResponse.data.email;
                    if (AUTHORIZED.includes(email)) {
                        logger.debug(`${email} is authorized`);
                    } else {
                        logger.error(`${email} is notauthorized`);
                        res.status(401).send({
                            errorMessage: `${email} is notauthorized`,
                        });
                        return;
                    }
                } catch (err) {
                    res.status(401).send({
                        errorMessage: err.response.data,
                    });
                    return;
                }
            } else {
                res.status(401).send({
                    errorMessage: "Authorization is empty",
                });
                return;
            }

            console.log("Save email: ", req.body);

            try {
                await userRepository.insert(<{ email: string; puuid: string }[]>req.body);
                res.status(200).send({
                    status: "SUCCESS",
                });
            } catch (err) {
                console.log(err);
                res.status(500).send({
                    errorMessage: err.message,
                });
            }
        });

        return router;
    };
}
