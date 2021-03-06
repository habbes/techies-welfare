import {
    IUserService,
    IBulkMessageService,
    ITransactionService,
    ISystemService,
    IAppSettingsService
} from "./services";

export interface IAppServices {
    users: IUserService;
    transactions: ITransactionService;
    bulkMessages: IBulkMessageService;
    system: ISystemService;
    settings: IAppSettingsService;
}
