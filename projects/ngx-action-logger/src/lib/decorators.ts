import { appModuleInjector } from './app-module-injector';
import { DEFAULT_LOG_DECORATOR_LIFE_CYCLE_OPTIONS } from './const';
import { ILogDecoratorLifeCycleOptions, ILogDecoratorOptions } from './interface';
import { LoggerService } from './abstract-logger.service';

let _logger: LoggerService;

const getLogger = () => {
    if (!_logger) {
        const injector = appModuleInjector();
        _logger = injector.get(LoggerService);
    }

    return _logger;
};

export const LogComponentLifeCycle =
    (logDecoratorLifeCycleOptions: ILogDecoratorLifeCycleOptions = DEFAULT_LOG_DECORATOR_LIFE_CYCLE_OPTIONS) =>
    (constructor: any) => {
        const logger = getLogger();
        const className = getClassName(constructor, logDecoratorLifeCycleOptions?.className);
        const hooks = logDecoratorLifeCycleOptions?.hooks
            ? logDecoratorLifeCycleOptions.hooks
            : DEFAULT_LOG_DECORATOR_LIFE_CYCLE_OPTIONS.hooks;

        for (const hook of hooks || []) {
            const original = constructor.prototype[hook];
            constructor.prototype[hook] = function (...args: any[]) {
                logger.log({ className, hook, args, message: logDecoratorLifeCycleOptions?.message, timestamp: Date.now() });

                if (original) {
                    original.apply(this, args);
                }
            };
        }
    };

export const Log =
    (logDecoratorOptions?: ILogDecoratorOptions) => (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
        const logger = getLogger();
        const original = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const className = getClassName(target.constructor, logDecoratorOptions?.className);
            logger.log({ className, hook: propertyKey, args, message: logDecoratorOptions?.message, timestamp: Date.now() });

            return original.apply(this, args);
        };
    };

const getClassName = (constructor: any, customClassName = ''): string => {
    return customClassName ? customClassName : constructor.name.toString();
};
