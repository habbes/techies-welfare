import { CronJob } from "cron";
import { IAppServices } from "../core";

type Job = (app: IAppServices) => Promise<void>;

/**
 * Run the specified `job` function at the specified
 * cron `schedule`.
 * @param app 
 * @param schedule 
 * @param job 
 */
export function runJobOnSchedule(app: IAppServices, schedule: string, job: Job) {
    const cronJob = new CronJob(schedule, async () => await job(app));

    try {
        console.log("Scheduling job", job.name, schedule)
        cronJob.start();
    }
    catch(e) {
        console.error("Error running job", job.name, e);
        console.log('restarting', job.name);
        cronJob.start();
    }
}
