import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ILoggerData } from './interface';
import { LoggerModule } from './logger.module';
import { LoggerService } from './abstract-logger.service';

describe('ConsoleLoggerService:', () => {
    let service: LoggerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                LoggerModule.forRoot({
                    sessionId: 'uuid'
                })
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        service = TestBed.inject(LoggerService);
    });

    it('log: ', () => {
        const logSpy = spyOn(console, 'log');
        const loggerData: ILoggerData = {
            args: 'args',
            className: 'className',
            hook: 'hook',
            message: 'message',
            timestamp: 123
        };

        service.log(loggerData);

        expect(logSpy).toHaveBeenCalled();
    });
});
