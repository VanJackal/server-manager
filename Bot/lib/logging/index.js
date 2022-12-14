const { format, transports, createLogger } = require('winston');
const { combine, timestamp, printf } = format;
const date = require('date-and-time')

const primaryFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} - ${level}: ${message}`;
})

const getDateString = () => {
    const now = new Date();
    const formatStr = "YYYYMMDDTHH-mm-ss-SSZ";
    return date.format(now, formatStr);
}

const logger = createLogger({
    format: combine(
        timestamp(),
        primaryFormat
    ),
    transports: [
        new transports.Console({handleExceptions:true}),
        new transports.File({ filename: `./Logging/${getDateString()}.primary.log`, handleExceptions:true })
    ],
    levels:{
        fatal:0,
        error:1,
        warn:2,
        info:3,
        debug:4,
        trace:5
    },
    level:"trace"
})

module.exports = {
    logger:logger
}