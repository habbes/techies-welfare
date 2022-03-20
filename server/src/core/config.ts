type SmsProvider = "local" | "at";
type EmailProvider = "local" | "sendgrid";

export interface AppConfig {
    /**
     * Port that the http server will listen on
     */
    port: number;
    /**
     * MongoDB Database URI
     */
    dbUri: string;
    /**
     * MongoDB database name
     */
    dbName: string;
    /**
     * base url of the web app
     */
    webAppBaseUrl: string;
    /**
     * The sms provider to use
     */
    smsProvider: SmsProvider;
    /**
     * Africa's Talking username
     */
    atUsername: string;
    /**
     * Africa's Talking API Key
     */
    atApiKey: string;
    /**
     * The short code or alphanumeric Sender ID from which
     * SMS via Africa's Talking API are sent
     */
    atSmsSender: string;
    /**
     * Root path of Africa's Talking callback URLS
     * this should be a random and secret string for security
     * to avoid attackers sending fake notifications to our app
     */
    atWebhooksRoot: string;
    /**
     * The email provider to use for sending emails
     */
    emailProvider: EmailProvider;
    /**
     * SendGrid API key
     */
     sendGridApiKey: string;
     /**
      * SendGrid email sender
      */
     sendGridSender: string;
    /**
     * Flutterwave's API secret key
     */
    flutterwaveSecretKey: string;
    /**
     * URL of the logo to display on Flutterwave's payment dialog
     */
    flutterwaveLogoUrl: string;
    /**
     * URL to redirect the user to after payment is complete
     */
    flutterwaveRedirectUrl: string;
    /**
     * Root path for flutterwave webhooks
     */
    flutterwaveWebhooksRoot: string;
    /**
     * Interval delay in CronTime format that
     * determines when monthly reminders are scheduled
     */
    monthlyReminderSchedule: string;
};


export function loadAppConfigFrom(env: Record<string, string>): AppConfig {
    const webAppBaseUrl = env.WEB_APP_BASE_URL || "http://localhost:3000";

    return {
        dbName: env.DB_NAME || "techies_welfare",
        dbUri: env.DB_URL || "mongodb://localhost:27017/techies_welfare",
        port: (env.PORT && Number(env.PORT)) || 4000,
        webAppBaseUrl,
        smsProvider: (env.SMS_PROVIDER as SmsProvider) || "local",
        atApiKey: env.AT_API_KEY || "",
        atUsername: env.AT_USERNAME || "sandbox",
        atWebhooksRoot: env.AT_WEBHOOKS || "/webhooks/at",
        atSmsSender: env.AT_SMS_SENDER || "",
        emailProvider: (env.EMAIL_PROVIDER as EmailProvider) || "local",
        sendGridApiKey: env.SENDGRID_API_KEY || "",
        sendGridSender: env.SENDGRID_SENDER || "",
        flutterwaveLogoUrl: `${webAppBaseUrl}/img/logo.png`,
        flutterwaveRedirectUrl: `${webAppBaseUrl}/post-payment/flutterwave`,
        flutterwaveSecretKey: env.FLUTTERWAVE_SECRET_KEY || "",
        flutterwaveWebhooksRoot: env.FLUTTERWAVE_WEBHOOKS || "/webhooks/flutterwave",
        monthlyReminderSchedule: env.MONTHLY_REMINDER_SCHEDULE || `0 0 10 1 * *`, // 1st of each month at 10am
    }
}