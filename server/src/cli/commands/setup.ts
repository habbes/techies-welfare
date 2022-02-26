import { prompt } from "inquirer";
import {
    ICommandContext,
    CreateUserArgs,
    RunSetupArgs,
    ICommandExecutor,
    runSetup,
    createValidationError,
    hasSetupRun,
    createAppError
} from "../../core";
import { ICliCommand } from "../types";

interface IAppContext {
    executor: ICommandExecutor<ICommandContext>;
}

export const setupCommand: ICliCommand = {
    name: "setup",
    noAuth: true,
    async run(context: IAppContext) {
        if (await context.executor.execute(hasSetupRun, undefined)) {
            throw createAppError("Setup has already run on this installation!");
        }

        console.log("Let's register the initial admin for the system");

        const adminArgs = await getCreateUserArgs();

        const args: RunSetupArgs = {
            admin: adminArgs
        };

        const result = await context.executor.execute(runSetup, args);

        console.log('Setup successful');
        console.log('Created user', result.admin);
    }
}

async function getCreateUserArgs() {
    const result = await prompt([
        {
            name: "name",
            type: "input",
            message: "Enter your full name"
        },
        {
            name: "email",
            type: "input",
            message: "Enter your email address"
        },
        {
            name: "phone",
            type: "input",
            message: "Enter your phone number (2547xxxxxxxx)"
        },
        {
            name: "idNumber",
            type: "input",
            message: "Enter ID number"
        },
        {
            name: "team",
            type: "input",
            message: "What team are you in?"
        },
        {
            name: "memberSince",
            type: "input",
            message: "When did you join the welfare (YYYY-MM-DD)?"
        },
        {
            name: "password",
            type: "password",
            message: "Enter password"
        },
        {
            name: "passwordConfirm",
            type: "password",
            message: "Confirm password"
        }
    ]);

    const name: string = result.name;
    const email: string = result.email;
    const phone: string = result.phone;
    const idNumber: string = result.idNumber;
    const team: string = result.team;
    const [rawYear, rawMonth, rawDay] = result.memberSince.split("-");
    const memberSince = new Date(Number(rawYear), Number(rawMonth), Number(rawDay));
    const password: string = result.password;
    const passwordConfirm: string = result.passwordConfirm;

    if (password !== passwordConfirm) {
        throw createValidationError("Passwords do not match!");
    }

    const args: CreateUserArgs = {
        name,
        email,
        phone,
        idNumber,
        password,
        memberSince,
        team
    };

    return args;
}