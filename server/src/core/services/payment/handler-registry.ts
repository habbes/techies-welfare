import { IPaymentHandler, IPaymentHandlerProvider, IPaymentHandlerRegistry } from "./types";

export class PaymentHandlerRegistry implements IPaymentHandlerProvider, IPaymentHandlerRegistry {
    private handlers: Record<string, IPaymentHandler> = {};
    private defaultHandler: string;

    register(provider: IPaymentHandler<Record<string, any>, Record<string, any>>): void {
        this.handlers[provider.name()] = provider;
    }

    setDefault(name: string): void {
        this.defaultHandler = name;
    }

    getProvider(): IPaymentHandlerProvider {
        return this;
    }

    get<TProviderMetadata = Record<string, any>, TPaymentNotification = Record<string, any>>(name: string): IPaymentHandler<TProviderMetadata, TPaymentNotification> {
        const handler = this.handlers[name];
        if (!handler) throw new Error("unknown provider");

        return handler as IPaymentHandler<TProviderMetadata, TPaymentNotification>;
    }

    getDefault(): IPaymentHandler<Record<string, any>, Record<string, any>> {
        return this.get(this.defaultHandler);
    }
}
