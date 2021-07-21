import { IAppSettings } from "../../models";

export interface IAppSettingsService {
    getAppSettings(): Promise<IAppSettings>;
}
