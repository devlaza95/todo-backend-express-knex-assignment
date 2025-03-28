import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    legacyHeaders: false,
    standardHeaders: true,
});

export default  limiter;
