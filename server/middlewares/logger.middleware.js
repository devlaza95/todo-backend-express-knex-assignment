import winston from "winston";

const infoLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
})

export default infoLogger;
