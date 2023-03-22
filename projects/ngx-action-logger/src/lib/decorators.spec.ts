import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { appModuleInjector, clearInjector } from './app-module-injector';
import { Log, LogComponentLifeCycle } from './decorators';
import { LoggerModule } from './logger.module';
import { LoggerService } from './abstract-logger.service';

describe('Decorators: ', () => {
    let service: LoggerService;
    let logSpy: jasmine.Spy;

    beforeEach(() => {
        if (!service) {
            TestBed.configureTestingModule({
                imports: [
                    LoggerModule.forRoot({
                        sessionId: Date.now().toString()
                    })
                ],
                schemas: [NO_ERRORS_SCHEMA]
            });

            const injector = TestBed.inject(Injector);
            appModuleInjector(injector);
            service = TestBed.inject(LoggerService);
        }

        logSpy = spyOn(service, 'log');
    });

    afterEach(() => {
        clearInjector();
        logSpy.calls.reset();
    });

    describe('LogComponentLifeCycle: ', () => {
        let constructor: any;

        beforeEach(() => {
            constructor = {
                name: 'name',
                prototype: {
                    ngOnInit: () => {},
                    ngOnChanges: () => {},
                    ngAfterViewInit: () => {}
                }
            };
        });

        it('should call log for all default hooks', () => {
            LogComponentLifeCycle()(constructor);

            for (const property in constructor.prototype) {
                constructor.prototype[property]();
            }

            expect(logSpy).toHaveBeenCalledTimes(3);
        });

        it('should call log for selected hooks', () => {
            LogComponentLifeCycle({ className: 'className', hooks: ['ngOnInit', 'ngAfterViewInit'] })(constructor);

            for (const property in constructor.prototype) {
                constructor.prototype[property]();
            }

            expect(logSpy).toHaveBeenCalledTimes(2);
        });
    });

    describe('Log: ', () => {
        let descriptor: any, target: any;

        beforeEach(() => {
            descriptor = {
                value: () => {}
            };

            target = {
                constructor: {
                    name: 'name'
                }
            };
        });

        it('should call log with custom class name', () => {
            Log({ className: 'className' })(target, 'propertyKey', descriptor);

            descriptor.value();

            expect(logSpy).toHaveBeenCalled();
        });

        it('should call log with default class name', () => {
            Log()(target, 'propertyKey', descriptor);

            descriptor.value();

            expect(logSpy).toHaveBeenCalled();
        });
    });
});
