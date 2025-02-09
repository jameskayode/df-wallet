const { Container } = require("typedi"); // FIXED IMPORT
const { DataSource } = require("typeorm");

const { env } = require("../env");

const { db } = env;
const { pg } = db;

const dataSource = new DataSource({
    type: "postgres",
    username: pg.user,
    password: pg.pass,
    host: pg.host,
    database: pg.database,
    port: parseInt(pg.port, 10), // Ensure it's a number
    entities: ["dist/api/models/postgres/**/*.js"], // Change `.ts` to `.js`
    synchronize: false,
    logging: true,
    multipleStatements: true,
    ssl: (!env.isLocal && !env.isTest) ? { rejectUnauthorized: false } : false
});

const postgresLoader = async () => {
    Container.set("PostgreSQLConnection", dataSource); // Ensure Container is correctly imported

    await dataSource.initialize()
        .then(() => {
            console.log("✅  Connected to PostgreSQL database");
        })
        .catch((err) => {
            console.log(`❌  Error connecting to PostgreSQL database >> ${err}`);
        });
};

module.exports = { dataSource, postgresLoader };
