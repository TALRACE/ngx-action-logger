import { Inject, Injectable } from '@angular/core';

import { ILoggerData, ILoggerOptions } from './interface';
import { LoggerService } from './abstract-logger.service';
import { LOGGER_OPTIONS } from './const';

@Injectable()
export class ConsoleLoggerService extends LoggerService {
    constructor(@Inject(LOGGER_OPTIONS) private _loggerOptions: ILoggerOptions) {
        super();
    }

    log(loggerData: ILoggerData): void {
        const logData = { ...loggerData, sessionId: this._loggerOptions.sessionId };
        console.log(logData);
    }
}
