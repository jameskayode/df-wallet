const { createClient } = require("redis");
const {Container} = require("typedi");

const { env } = require("../env");

const { cache } = env;
const { redis } = cache;

const redisConfig = {
    url: `redis${(!env.isLocal && !env.isTest) ? "s" : ""}://${[
        redis.user && redis.user,
        redis.pass && `:${redis.pass}`,
        redis.host && `@${redis.host}`,
        redis.port && `:${redis.port}`
    ].filter(Boolean).join("")}`,
    connectTimeout: 10000, // in milliseconds
    socket: {
        reconnectStrategy: function (retries) {
            if (retries > 20) {
                console.log("❌  Too many attempts to reconnect. Redis connection was terminated");
                return new Error("Too many retries.");
            }
            return retries * 500;
        },
    }
};

let redisClient;

const redisLoader = async () => {
    try {
        redisClient = createClient(redisConfig);

        await redisClient.connect();
        await redisClient.ping();

        Container.set("RedisConnection", redisClient);

        redisClient.on("ready", () => {
            console.log("✅  Redis client is ready!");
        });

        redisClient.on("error", (err) => {
            console.log(`❌  Error with Redis connection: ${err}`);
        });

        redisClient.on("end", () => {
            console.log("⛔️  Disconnected from Redis cache");
        });

        redisClient.on("reconnecting", (attempt) => {
            console.log(`🔄  Reconnecting attempt: ${attempt.attempt}`);
        });

        console.log("✅  Connected to Redis cache");
    } catch (err) {
        console.log(`❌  Error connecting to Redis cache >> ${err}`);
    }
};

module.exports = { redisConfig, redisClient, redisLoader };
