import { Db, MongoClient } from "mongodb";
import AWS from "aws-sdk";
import logger from "@common/logger";

export class UserRepository {
    private client?: MongoClient;
    private database?: Db;
    private secretManager: AWS.SecretsManager;

    constructor() {
        this.secretManager = new AWS.SecretsManager({
            region: "ap-northeast-2",
        });
    }

    private connect = async (): Promise<void> => {
        try {
            logger.debug("connect()");
            let connectionString = process.env.MONGODB_CONNECTION_STRING;
            if (process.env.ENVIRONMENT) {
                const result = await this.secretManager
                    .getSecretValue({
                        SecretId:
                            "arn:aws:secretsmanager:ap-northeast-2:118166980108:secret:dev/plp/application/repository-connection-string-Gi5ExR",
                    })
                    .promise();
                connectionString = result.SecretString;
            }
            const databaseName = process.env.MONGODB_NAME;

            if (!connectionString || !databaseName)
                throw new Error("Invalid MongoDB setting variables");

            if (!this.client) {
                this.client = await MongoClient.connect(connectionString);
                logger.debug("connect() this.client");
            }

            if (!this.database) {
                this.database = this.client.db(databaseName);
                logger.debug("connect() this.database");
            }
            logger.debug(`connect() finish client=${this.client}, database=${this.database}`);
        } catch (err) {
            logger.error(err);
        }
    };

    findAll = async () => {
        logger.debug("findAll");
        await this.connect();
        if (!this.client || !this.database) throw new Error("database connection error");

        return await this.database
            .collection<{ email: string; puuid: string }>("preregisteredUsers")
            .find()
            .toArray();
    };

    findOne = async (email: string, puuid: string) => {
        logger.debug(`findOne: ${email}, ${puuid}`);
        await this.connect();
        if (!this.client || !this.database) throw new Error("database connection error");

        if (email) {
            return await this.database
                .collection<{ email: string; puuid: string }>("preregisteredUsers")
                .findOne({ email: email });
        } else if (puuid) {
            return await this.database
                .collection<{ email: string; puuid: string }>("preregisteredUsers")
                .findOne({ puuid: puuid });
        } else {
            throw new Error("email or puuid is required");
        }
    };

    insert = async (users: { email: string; puuid: string }[]): Promise<void> => {
        logger.debug(`insert: ${users}`);
        await this.connect();
        if (!this.client || !this.database) throw new Error("database connection error");

        await this.database.collection("preregisteredUsers").insertMany(users);
    };
}
