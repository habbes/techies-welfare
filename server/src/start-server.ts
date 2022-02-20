import { bootstrap, loadAppConfigFrom } from "./core";
import { createServer } from "./server";
import { mountRestApi } from "./rest-api";
import { mountFlutterwaveWebhooks } from "./webhooks";

async function startServer() {
    try {
        const config = loadAppConfigFrom(process.env);
        const app = await bootstrap(config);
        const server = createServer();

        mountRestApi(server, "/api", app);

        mountFlutterwaveWebhooks(server, config.flutterwaveWebhooksRoot);

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
