import { IAppServices } from "../core";

/**
 * Send contribution reminder to every user.
 * @param app
 */
export async function broadcastContributionReminder(app: IAppServices) {
    try {
        const settings = await app.settings.getAppSettings();
        await app.bulkMessages.send({
            recipients: ['all'],
            message: settings.monthlyReminderMessage
        });
    }
    catch (e) {
        console.error("Error occurred when broadcasting reminder", e);
    }
}