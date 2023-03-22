import { ModuleWithProviders, NgModule } from '@angular/core';

import { ConsoleLoggerService } from './console-logger.service';
import { DEFAULT_OPTIONS, LOGGER_OPTIONS } from './const';
import { ElasticLoggerService } from './elastic-logger.service';
import { ILoggerOptions } from './interface';
import { LoggerService } from './abstract-logger.service';

@NgModule()
export class LoggerModule {
    static forRoot(options?: ILoggerOptions): ModuleWithProviders<LoggerModule> {
        const loggerOptions = {
            ...DEFAULT_OPTIONS,
            ...options
        };
        const loggerService = this.getLoggerServices(options);

        return {
            ngModule: LoggerModule,
            providers: [
                { provide: LOGGER_OPTIONS, useValue: loggerOptions },
                { provide: LoggerService, useClass: loggerService }
            ]
        };
    }

    private static getLoggerServices(options?: ILoggerOptions): any {
        if (!options) {
            return ConsoleLoggerService;
        }

        if (options.loggerService) {
            return options.loggerService;
        }

        return options.elasticOptions ? ElasticLoggerService : ConsoleLoggerService;
    }
}
