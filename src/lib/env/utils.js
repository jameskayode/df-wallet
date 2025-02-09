const { join } = require("path");

const delimiter = ",";
const environmentPaths = {
    production: "dist",
    staging: "dist",
    development: "dist",
    dev: "dist",
    prod: "dist",
    local: "dist",
};

function getOsEnv(key) {
    if (typeof process.env[key] === "undefined") {
        throw new Error(`Environment variable ${key} is not set.`);
    }
    return process.env[key].toString();
}

function getOsEnvWithDefault(key, defaultValue) {
    return process.env[key] || defaultValue;
}

function getOsEnvOptional(key) {
    return process.env[key];
}

function getPath(path) {
    const environment = process.env.NODE_ENV || "local";
    const outputDir = environmentPaths[environment] || "src";

    if (outputDir === "src") {
        return join(process.cwd(), path);
    } else {
        return join(process.cwd(), path.replace("src/", "dist/").slice(0, -3) + ".js");
    }
}

function getPaths(paths) {
    return paths.map(p => getPath(p));
}

function getOsPath(key) {
    return getPath(getOsEnv(key));
}

function getOsPathWithDefault(key, defaultValue) {
    if (process.env[key]) {
        return getPath(getOsEnv(key));
    } else {
        return getPath(defaultValue);
    }
}

function getOsPaths(key) {
    return getPaths(getOsEnvArray(key));
}

function getOsPathsWithDefault(key, defaultValue) {
    if (process.env[key]) {
        return getPaths(getOsEnvArray(key));
    } else {
        return getPaths(defaultValue.split(delimiter));
    }
}

function getOsEnvArray(key) {
    return process.env[key] ? process.env[key].split(delimiter) : [];
}

function toNumber(value) {
    return parseInt(value, 10);
}

function toBool(value) {
    return value === "true";
}

function normalizePort(port) {
    if (port === undefined) { return undefined; }
    const parsedPort = parseInt(port, 10);
    if (isNaN(parsedPort)) { // named pipe
        return port;
    }
    if (parsedPort >= 0) { // port number
        return parsedPort;
    }
    return false;
}

module.exports = {
    getOsEnv,
    getOsEnvWithDefault,
    getOsEnvOptional,
    getPath,
    getPaths,
    getOsPath,
    getOsPathWithDefault,
    getOsPaths,
    getOsPathsWithDefault,
    getOsEnvArray,
    toNumber,
    toBool,
    normalizePort
};
