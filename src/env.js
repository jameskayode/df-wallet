const path = require("path");
const dotenv = require("dotenv");
const pkg = require("../package.json");
const { getOsEnv, normalizePort } = require("./lib/env/utils");

/**
 * Load .env file or for tests the .env.test file.
 */
dotenv.config({
    path: path.join(
        process.cwd(),
        `.env${process.env.NODE_ENV === "test" ? ".test" : ""}`
    ),
});

const env = {
    isProduction: ["prod", "production"].includes(process.env.NODE_ENV),
    isDevelopment: ["dev", "development"].includes(process.env.NODE_ENV),
    isLocal: process.env.NODE_ENV === "local",
    isTest: process.env.NODE_ENV === "test",

    app: {
        name: pkg.name,
        displayName: pkg.displayName,
        version: pkg.version,
        port: normalizePort(process.env.PORT || undefined)
    },
    db: {
        mongo: {
            host: getOsEnv("MONGODB_HOST"),
            port: normalizePort(getOsEnv("MONGODB_PORT")),
            user: getOsEnv("MONGODB_USERNAME"),
            pass: getOsEnv("MONGODB_PASSWORD"),
            database: getOsEnv("MONGODB_DATABASE"),
        },
        pg: {
            host: getOsEnv("PG_HOST"),
            port: normalizePort(getOsEnv("PG_PORT")),
            user: getOsEnv("PG_USERNAME"),
            pass: getOsEnv("PG_PASSWORD"),
            database: getOsEnv("PG_DATABASE"),
        },
    },
    cache: {
        redis: {
            host: getOsEnv("REDIS_HOST"),
            port: normalizePort(getOsEnv("REDIS_PORT")),
            user: getOsEnv("REDIS_USERNAME"),
            pass: getOsEnv("REDIS_PASSWORD"),
        }
    }
};

module.exports = { env };
