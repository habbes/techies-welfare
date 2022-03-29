export type ICommandHandler<TInput, TOutput, TCommandContext> = (input: TInput, context: TCommandContext) => Promise<TOutput>;

export type ICommandPreMiddleware<TInput, TCommandContext> = (input: TInput, context: TCommandContext) => Promise<any>;
export type ICommandPostMiddleware<TInput, TOutput, TCommandContext> = (input: TInput, output: TOutput, context: TCommandContext) => Promise<any>;
export type ICommandGlobalPreMiddleware<TCommandContext> = (input: any, context: TCommandContext) => Promise<any>;
export type ICommandGlobalPostMiddleware<TCommandContext> = (input: any, output: any, context: TCommandContext) => Promise<any>;

/**
 * represents a command that can be executed
 * by a `CommandExecutor`
 */
export type ICommand<TInput, TOutput, TCommandContext> = {
    /**
     * The name of the command. Used for logging purposes.
     */
    name: string;
    /**
     * the function that implements the command's logic.
     * If the handler fails with an exception, post middleware
     * will not be executed.
     */
    handler: ICommandHandler<TInput, TOutput, TCommandContext>;
    /**
     * A collection of middleware functions that will be
     * executed sequentially before the command handler. If one
     * of the middleware throws an exception, the entire
     * command pipeline is terminate and that exception
     * bubbles up to the caller.
     */
    preMiddleware: ICommandPreMiddleware<TInput, TCommandContext>[];
    /**
     * A collection of middleware functions that will be
     * executed sequentially after the command handler
     * has executed successfully. If one
     * of the middleware throws an exception, the entire
     * command pipeline is terminate and that exception
     * bubbles up to the caller.
     */
    postMiddleware: ICommandPostMiddleware<TInput, TOutput, TCommandContext>[];
    /**
     * If true, global middleware will be skipped for this
     * command. This is useful for command that handle
     * sensitive information and require special handling.
     */
    skipGlobalMiddleware: boolean;
}

/**
 * Represents a function for creating command contexts for a specific
 * type. Used when creating a command executor.
 */
export type ICommandContextFactory<TCommandContext> = () => TCommandContext;

export interface ICommandExecutor<TCommandContext> {
    /**
     * Executes the command pipeline for the specified command.
     * Executes all middleware in order:
     * - global pre middleware
     * - command's pre middleware
     * - command handler
     * - command's post middleware
     * - global post middleware
     * @param command The command to execute
     * @param input The input to the command
     * @returns the command's output
     */
    execute<TInput, TOutput>(command: ICommand<TInput, TOutput, TCommandContext>, input: TInput): Promise<TOutput>;
}

/**
 * Configuration options used when creating a command
 */
export interface ICommandConfig<TInput, TOutput, TCommandContext> {
    /**
     * List of middleware to be executed sequentially before the command handler.
     * If one of the middleware throws an exception, the entire
     * command pipeline is terminate and that exception
     * bubbles up to the caller.
     */
    pre?: ICommandPreMiddleware<TInput, TCommandContext>[];
    /**
     * List of middleware to be executed sequentially after the command handler.
     * These middleware will receive the output that was returned by the handler.
     * If one of the middleware throws an exception, the entire
     * command pipeline is terminated and that exception bubbles up to the caller.
     * When handling such exceptions, bear in mind that the command handler
     * has already executed successfully.
     */
    post?: ICommandPostMiddleware<TInput, TOutput, TCommandContext>[];
    /**
     * Set true to skip global middleware for this
     * command. This is useful for commands that handle
     * sensitive information and require special handling.
     */
    skipGlobalMiddleware?: boolean;
}

/**
 * Creates a command
 * @param handler The handler function that executes the command logic
 * @param config Configuration options for the command such as middleware
 * @returns The created command
 */
export function makeCommand<TInput, TOutput, TCommandContext>(
    handler: ICommandHandler<TInput, TOutput, TCommandContext>,
    config: ICommandConfig<TInput, TOutput, TCommandContext> = {}): ICommand<TInput, TOutput, TCommandContext> {
    return {
        handler,
        preMiddleware: config.pre || [],
        postMiddleware: config.post || [],
        name: handler.name,
        skipGlobalMiddleware: config.skipGlobalMiddleware
    };
}

export interface ICommandList<TCommandContext> {
    [k: string]: ICommandHandler<any, any, TCommandContext>;
}

/**
 * Configuration options for an `ICommandExecuter`
 */
interface ICommandExecuterConfig<TCommandContext> {
    /**
     * Middleware that are executed for each command, before the
     * command's own pre middleware
     */
    globalPreMiddleware?: ICommandGlobalPreMiddleware<TCommandContext>[];
    /**
     * Middleware that are executed for each command, after the command's
     * own post middleware
     */
    globalPostMiddleware?: ICommandGlobalPostMiddleware<TCommandContext>[];
}

/**
 * Default `ICommandExecutor`.
 */
export class CommandExecutor<TCommandContext> implements ICommandExecutor<TCommandContext> {
    context: TCommandContext;
    config: ICommandExecuterConfig<TCommandContext>;
    globalPreMiddleware: ICommandGlobalPreMiddleware<TCommandContext>[];
    globalPostMiddleware: ICommandGlobalPostMiddleware<TCommandContext>[];

    constructor(context: TCommandContext, config: ICommandExecuterConfig<TCommandContext> = {}) {
        this.context = context;
        this.globalPreMiddleware = config.globalPreMiddleware || [];
        this.globalPostMiddleware = config.globalPostMiddleware || [];
    }

    async execute<TInput, TOutput>(command: ICommand<TInput, TOutput, TCommandContext>, input: TInput): Promise<TOutput> {
        if (!command.skipGlobalMiddleware) {
            for (let middleware of this.globalPreMiddleware) {
                await middleware(input, this.context);
            }
        }

        for (let middleware of command.preMiddleware) {
            await middleware(input, this.context);
        }

        const result = await command.handler(input, this.context);

        for (let middleware of command.postMiddleware) {
            await middleware(input, result, this.context);
        }

        if (!command.skipGlobalMiddleware) {
            for (let middleware of this.globalPostMiddleware) {
                await middleware(input, result, this.context);
            }
        }

        return result;
    }
}
