import { bootstrap, loadAppConfigFrom } from "./core";
import { createServer } from "./server";
import { mountRestApi } from "./rest-api";

async function startServer() {
    try {
        const config = loadAppConfigFrom(process.env);
        const app = await bootstrap(config);
        const server = createServer(app);

        mountRestApi(server, "/api");

        server.listen(config.port, () => {
            console.log(`Server listening on port ${config.port}`);
        });
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
}

startServer();
