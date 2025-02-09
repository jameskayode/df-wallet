const compression = require("compression");
const cors = require("cors");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const { env } = require("../env");

const { mongoDBLoader } = require("./mongodb");
const { postgresLoader } = require("./postgres");
const { redisLoader } = require("./redis");

const { app: appInfo } = env;

const corsOptions = {
    origin(origin, callback) {
        callback(null, true);
    },
    optionsSuccessStatus: 200,
};

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 50, // Limit each IP
});

const expressConfig = async (app) => {
    app.use(cors(corsOptions));
    app.use(limiter);
    app.use(compression());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(helmet());
    app.use(
        helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
            },
        })
    );

    await postgresLoader();
    await mongoDBLoader();
    await redisLoader();

    app.get("/", (req, res) => res.send(`${appInfo.displayName} - v${appInfo.version}`));
};

module.exports = expressConfig;
