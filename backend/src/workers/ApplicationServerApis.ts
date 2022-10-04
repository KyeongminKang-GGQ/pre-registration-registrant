import logger from "@common/logger";
import axios, { AxiosInstance } from "axios";

export class ApplicationServerApis {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            // withCredentials: true,
            baseURL: process.env.APPLICATION_SERVER,
            // headers: {
            // "Access-Control-Allow-Origin": "*",
            // "Content-Type": "application/json",
            // },
        });
    }

    getPuuid = async (summonerName: string) => {
        logger.debug(`summonerName: ${summonerName}`);

        try {
            const response = await this.axiosInstance.get(
                `/application/v1/summoners/by-name/${encodeURIComponent(summonerName)}`,
            );
            const puuid = response.data.puuid;
            logger.debug(`get puuid: ${puuid}`);
            return response.data.puuid;
        } catch (err) {
            logger.error(err);

            const response = await this.axiosInstance.post(
                `/application/v1/summoners/by-name/${encodeURIComponent(summonerName)}`,
            );
            const puuid = response.data.puuid;
            logger.debug(`post puuid: ${puuid}`);
            return response.data.puuid;
        }
    };
}
