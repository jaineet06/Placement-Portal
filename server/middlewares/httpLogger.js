
import logger from "../configs/logger.js";

const httpLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

    if (res.statusCode >= 500) logger.error(message);
    else if (res.statusCode >= 400) logger.warn(message);
    else if (duration > 1000) logger.warn(`SLOW REQUEST - ${message}`);
    else logger.info(message);
  });

  next();
};

export default httpLogger;