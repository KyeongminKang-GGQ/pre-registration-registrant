import { Db, MongoClient } from "mongodb";

export class UserRepository {
    private client?: MongoClient;
    private database?: Db;

    private connect = async (): Promise<void> => {
        const connectionString = process.env.MONGODB_CONNECTION_STRING;
        const databaseName = process.env.MONGODB_NAME;

        if (!connectionString || !databaseName)
            throw new Error("Invalid MongoDB setting variables");

        if (!this.client) {
            this.client = await MongoClient.connect(connectionString);
        }

        if (!this.database) {
            this.database = this.client.db(databaseName);
        }
    };

    findPreregisteredUser = async (email: string) => {
        await this.connect();
        if (!this.client || !this.database) throw new Error("database connection error");

        return await this.database
            .collection<{ email: string; puuid: string }>("preregisteredUsers")
            .findOne({ email: email });
    };

    insertPreregisteredUsers = async (user: { email: string; puuid: string }): Promise<void> => {
        await this.connect();
        if (!this.client || !this.database) throw new Error("database connection error");

        await this.database.collection("preregisteredUsers").insertOne(user);
    };
}
