export type ICommandHandler<TInput, TOutput, TCommandContext> = (input: TInput, context: TCommandContext) => Promise<TOutput>;

export type ICommandMiddleware<TInput, TCommandContext> = (input: TInput, context: TCommandContext) => Promise<any>;

export type ICommand<TInput, TOutput, TCommandContext> = {
    handler: ICommandHandler<TInput, TOutput, TCommandContext>;
    preMiddleware: ICommandMiddleware<TInput, TCommandContext>[]
}

export type ICommandContextFactory<TCommandContext> = () => TCommandContext;

export interface ICommandExecutor<TCommandContext> {
    execute<TInput, TOutput>(command: ICommand<TInput, TOutput, TCommandContext>, input: TInput): Promise<TOutput>;
}


export function makeCommand<TInput, TOutput, TCommandContext>(
    handler: ICommandHandler<TInput, TOutput, TCommandContext>, preMiddleware: ICommandMiddleware<TInput, TCommandContext>[] = []): ICommand<TInput, TOutput, TCommandContext> {
    return {
        handler,
        preMiddleware
    };
}

export interface ICommandList<TCommandContext> {
    [k: string]: ICommandHandler<any, any, TCommandContext>;
}

class CommandExecutor<TCommandContext> implements ICommandExecutor<TCommandContext> {
    context: TCommandContext;

    constructor(context: TCommandContext) {
        this.context = context;
    }

    async execute<TInput, TOutput>(command: ICommand<TInput, TOutput, TCommandContext>, input: TInput): Promise<TOutput> {
        
        for (let middleware of command.preMiddleware) {
            await middleware(input, this.context);
        }

        const result = await command.handler(input, this.context);
        return result;
    }
}

export class CommandManager<TCommandContext> {
    constructor(private contextFactory: ICommandContextFactory<TCommandContext>) {
    }
    
    getExecutor(): ICommandExecutor<TCommandContext> {
        return new CommandExecutor(this.contextFactory());
    }
}

