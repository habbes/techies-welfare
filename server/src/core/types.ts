import { IUserService, IBulkMessageService, ITransactionService, ISystemService } from "./services";

export interface IAppServices {
    users: IUserService;
    transactions: ITransactionService;
    bulkMessages: IBulkMessageService;
    system: ISystemService;
}
