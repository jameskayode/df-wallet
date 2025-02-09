const express = require("express");
const expressConfig = require("./config/express");
const { env } = require("./env");
require("dotenv").config();


(async () => {
    const { app: appInfo } = env;

    const app = express();
    
    await expressConfig(app);
    
    app.listen(appInfo.port, () => {
        console.log(`${appInfo.displayName}, v${appInfo.version} is started on port ${appInfo.port}`);
    });
})();
