import rateLimit from 'express-rate-limit'
import AppError from "#utils/AppError.js";

export const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    handler: (req, res, next) => {
        next(
            new AppError("Too many attempts. Please try again later", 429)
        )
    }
})

export const loginRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    handler: (req, res, next) => {
        next(
            new AppError("Too many login attempts. Please try again later", 429)
        )
    }
})