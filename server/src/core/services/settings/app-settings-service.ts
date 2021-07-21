import { IAppSettings } from "../../models";
import { IAppSettingsService } from "./types";

export class AppSettingsService implements IAppSettingsService {
    getAppSettings(): Promise<IAppSettings> {
        return Promise.resolve({
            monthlyContributionAmount: 1000,
            sendMonthlyReminders: true,
            monthlyReminderMessage: "Hi {firstName}. You have contributed a total of Ksh {totalContribution} so far. You have Ksh {arrears} in outstanding."
        });
    }

}