
import winston from "winston";
import path from "path";

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return stack
    ? `${timestamp} [${level}]: ${message}\n${stack}`
    : `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "warn" : "debug",

  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), // captures stack trace
    logFormat
  ),

  transports: [
    // Console — only in development
    ...(process.env.NODE_ENV !== "production"
      ? [new winston.transports.Console({
          format: combine(colorize(), timestamp({ format: "HH:mm:ss" }), logFormat),
        })]
      : []),

    // error.log — only error level
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    // combined.log — everything
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

export default logger;