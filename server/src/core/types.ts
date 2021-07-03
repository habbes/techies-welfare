import { IUserService, IBulkMessageService, ITransactionService } from "./services";

export interface IAppServices {
    users: IUserService;
    transactions: ITransactionService;
    bulkMessages: IBulkMessageService;
}
