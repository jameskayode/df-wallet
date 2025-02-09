const { Container } = require("typedi");
const { DataSource } = require("typeorm");
const { env } = require("../env");

const { db } = env;
const { mongo } = db;

// Construct MongoDB connection URL
const urlSchema = (!env.isLocal && !env.isTest) ? "mongodb+srv://" : "mongodb://";
const credentials = db.mongo.user && db.mongo.pass ? `${db.mongo.user}:${db.mongo.pass}@` : "";
const queryParams = (!env.isLocal && !env.isTest) ? "?tls=true&authSource=admin" : "";
const url = `${urlSchema}${credentials}${db.mongo.host}:${db.mongo.port}/${db.mongo.database}${queryParams}`;

console.log("MongoDB Connection URL:", url); // For debugging


// Handle missing credentials
if (!mongo.user || !mongo.pass) {
    console.warn("MongoDB credentials are missing. Authentication may fail.");
}

// Configure the DataSource
const dataSource = new DataSource({
    type: "mongodb",
    url,
    database: mongo.database,
    port: parseInt(mongo.port, 10),
    entities: ["dist/api/models/mongo/**/*.js"],
    synchronize: false,
    logging: true,
    ssl: (!env.isLocal && !env.isTest),
    authSource: "admin" // Add this for remote connections
});

// MongoDB Loader Function
const mongoDBLoader = async () => {
    Container.set("MongoDBConnection", dataSource);

    try {
        await dataSource.initialize();
        console.log("✅  Connected to MongoDB database");
    } catch (err) {
        console.error(`❌  Error connecting to MongoDB database >> ${err.message}`);
        if (err.message.includes("Authentication failed")) {
            console.error("Check your MongoDB username and password.");
        }
        if (err.message.includes("getaddrinfo ENOTFOUND")) {
            console.error("Check your MongoDB host configuration.");
        }
    }
};

module.exports = { dataSource, mongoDBLoader };