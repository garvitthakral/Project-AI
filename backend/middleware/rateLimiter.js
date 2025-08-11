import rateLimit from "express-rate-limit";

export const requestLimiter = rateLimit({
    windowMS: 1 * 60 * 1000,
    max: 5,
    message: { error: "Too many requests, please try again later."},
    standardHeaders: true,
    legacyHeaders: false,
});
