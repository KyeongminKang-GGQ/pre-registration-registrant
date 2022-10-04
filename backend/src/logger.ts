import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";

const logDirectory = "logs";
const { combine, timestamp, printf, colorize } = winston.format;

const enumerateFormatter = winston.format((info) => {
    if (info.message instanceof Error) {
        info.message = Object.assign(
            {
                message: info.message.message,
                stack: info.message.stack,
            },
            info.message,
        );
    }

    if (info instanceof Error) {
        return Object.assign(
            {
                message: info.message,
                stack: info.stack,
            },
            info,
        );
    }

    if (typeof info.message === "object") {
        info.message = JSON.stringify(info.message, null, 3);
    }

    return info;
});

const logFormatter = printf((info) => {
    return `[ ${info.level} ] ${info.timestamp} : ${info.message}`;
});

const logger = winston.createLogger({
    format: combine(timestamp(), logFormatter),
    transports: [
        new winstonDaily({
            level: "debug",
            datePattern: "YYYY-MM-DD",
            dirname: logDirectory,
            filename: "%DATE%.log",
            maxFiles: 30,
            zippedArchive: true,
        }),
    ],
});

if (process.env.ENVIRONMENT != "prod") {
    logger.add(
        new winston.transports.Console({
            level: "debug",
            format: combine(enumerateFormatter(), colorize(), logFormatter),
        }),
    );
}

export default logger;
