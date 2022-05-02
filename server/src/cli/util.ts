import { prompt } from "inquirer";
import {
    bootstrap,
    createCommandExecutor,
    IAppServices,
    IAuthContext,
    loadAppConfigFrom,
    login,
    LoginArgs } from "../core";
import { ICliCommand, ICliContext } from "./types";

export async function runCommand(command: ICliCommand, services: IAppServices): Promise<void> {
    const context = command.noAuth ?
        await createContextWithoutAuth(services) :
        await createContext(services);
    
    await command.run(context);
}

export async function loadServices(): Promise<IAppServices> {
    const config = loadAppConfigFrom(process.env);
    const appServices = await bootstrap(config);
    return appServices;
}

async function createContextWithoutAuth(services: IAppServices): Promise<ICliContext> {
    const executor = createCommandExecutor(services, null);

    return Promise.resolve({
        executor
    });
}

async function createContext(services: IAppServices): Promise<ICliContext> {
    const loginArgs = await getLoginArgs();
    const noAuthExecutor = await createContextWithoutAuth(services);
    const result = await noAuthExecutor.executor.execute(login, loginArgs);
    
    const authContext: IAuthContext = {
        scopes: result.token.scopes,
        user: result.user
    };

    const executor = createCommandExecutor(services, authContext);

    return {
        executor
    };
}

async function getLoginArgs(): Promise<LoginArgs> {
    const result = await prompt([
        {
            name: 'login',
            type: 'input',
            message: 'Enter your email or phone number'
        },
        {
            name: 'password',
            type: 'password',
            message: 'Enter your password'
        }
    ]);

    const login: string = result.login;
    const password: string = result.password;

    return { login, password };
}