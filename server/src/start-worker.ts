import { bootstrap, loadAppConfigFrom } from "./core";
import { runJobOnSchedule, broadcastContributionReminder } from "./worker";

async function startWorker() {
    try {
        const config = loadAppConfigFrom(process.env);
        const app = await bootstrap(config);
        
        console.log("Starting worker jobs...");
        runJobOnSchedule(app, config.monthlyReminderSchedule, broadcastContributionReminder);
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
}

startWorker();
