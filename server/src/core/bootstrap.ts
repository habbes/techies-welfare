import { MongoClient } from "mongodb";
import { AppConfig } from "./config";
import {
    AtSmsService,
    AppSettingsService,
    BulkMessageService,
    FlutterwavePaymentProvider,
    LinkGeneratorService,
    LocalSmsService,
    ManualEntryPaymentProvider,
    MessageContextFactory,
    PaymentHandlerRegistry,
    SmsMessageTransport,
    TransactionService,
    UserService,
    SystemService
} from "./services";
import { IAppServices } from "./types";

export async function bootstrap(config: AppConfig): Promise<IAppServices> {
    const client = await getDbConnection(config.dbUri);
    const db = client.db(config.dbName);

    const flwPaymentProvider = new FlutterwavePaymentProvider({
        secretKey: config.flutterwaveSecretKey,
        redirectUrl: config.flutterwaveRedirectUrl,
        logoUrl: config.flutterwaveLogoUrl
    });

    const manualPaymentProvider = new ManualEntryPaymentProvider();

    const paymentHandlers = new PaymentHandlerRegistry();
    paymentHandlers.register(flwPaymentProvider);
    paymentHandlers.register(manualPaymentProvider);
    paymentHandlers.setDefault(flwPaymentProvider.name());

    const settings = new AppSettingsService();

    const smsService = config.smsProvider === "at" ?
    new AtSmsService({ apiKey: config.atApiKey, username: config.atUsername ,sender: config.atSmsSender }) :
    new LocalSmsService();

    const messageTransport = new SmsMessageTransport({ smsService });

    const transactions = new TransactionService(db, { paymentHandlers });
    await transactions.createIndexes();

    const users = new UserService(db, { transactions, settings, messageTransport });
    await users.createIndexes();

    const system = new SystemService({ users });

    const linkGenerator = new LinkGeneratorService({ baseUrl: config.webAppBaseUrl });
    const messageContextFactory = new MessageContextFactory({
        baseUrl: config.webAppBaseUrl,
        linkGenerator,
        users
    });

    const bulkMessages = new BulkMessageService({
        users,
        contextFactory: messageContextFactory,
        transport: messageTransport
    });

    return {
        users,
        transactions,
        bulkMessages,
        system,
        settings
    };
}

async function getDbConnection(connectionUrl: string) {
    try {
      const client = await MongoClient.connect(connectionUrl, { useUnifiedTopology: true });
      return client;
    }
    catch (e)
    {
      throw new Error(`Database connection error: ${e.message}`);
    }
  }