export interface ILogDecoratorLifeCycleOptions {
    className?: string;
    message?: string;
    hooks?: string[];
}

export interface ILogDecoratorOptions {
    className?: string;
    message?: string;
}

export interface ILoggerData {
    className: string;
    hook: string;
    args: any;
    message?: string;
    timestamp: number;
}

export interface IElasticOptions {
    url: string;
    index: string;
    username: string;
    password: string;
    indexProperties?: string;
    chunkSize?: number;
    sendDataTimeout?: number;
}

export interface ILoggerOptions {
    loggerService?: any;
    sessionId: string;
    elasticOptions?: IElasticOptions;
}
