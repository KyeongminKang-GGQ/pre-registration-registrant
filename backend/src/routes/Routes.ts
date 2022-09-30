import { UserRepository } from "@common/repositories/UserRepository";
import { NextFunction, Request, Response, Router } from "express";

export class Routes {
    create = (): Router => {
        const router = Router();
        const userRepository = new UserRepository();

        router.use("/*", (req: Request, res: Response, next: NextFunction) => {
            if (process.env.ENVIRONMENT != "prod") {
                res.header("Access-Control-Allow-Origin", "http://localhost:8080");
            } else {
                // TOOD Add Access-Control-Allow-Origin for PROD Domain
            }
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
            res.setHeader(
                "Access-Control-Allow-Headers",
                "X-Requested-With,Content-Type,Content-Language,Authorization",
            );
            // TODO Check Access-Control-Allow-Credentials
            //response.setHeader('Access-Control-Allow-Credentials', true);
            next();
        });

        router.get("/preregistered-email", async (req: Request, res: Response) => {
            console.log("Get email: ", req.query.email);

            const user = await userRepository.findPreregisteredUser(<string>req.query.email);
            console.log(user);
            if (!user) {
                res.status(200).send();
            } else {
                res.status(400).send({
                    errorMessage: "이미 등록된 이메일입니다.",
                });
            }
        });

        router.post("/preregistered-email", async (req: Request, res: Response) => {
            console.log("Save email: ", req.body);

            await userRepository.insertPreregisteredUsers(req.body);
            res.status(200).send();
        });

        return router;
    };
}
