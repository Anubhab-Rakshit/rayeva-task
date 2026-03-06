import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom format for readable console logs
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

export const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
    ),
    transports: [
        // Always log to console with colors in dev
        new winston.transports.Console({
            format: combine(colorize(), consoleFormat)
        }),
        // Add file logs so there's an audit trail
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});
