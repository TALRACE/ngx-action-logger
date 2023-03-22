import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ILoggerData } from './interface';
import { LoggerService } from './abstract-logger.service';
import { LoggerModule } from './logger.module';

describe('ElasticLoggerService:', () => {
    let service: LoggerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                LoggerModule.forRoot({
                    sessionId: 'uuid',
                    elasticOptions: {
                        index: 'index',
                        url: 'http://localhost:9200',
                        username: 'elastic',
                        password: '123456',
                        chunkSize: 2,
                        sendDataTimeout: 10000
                    }
                })
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        service = TestBed.inject(LoggerService);
    });

    it('log: should call combineLoggerData, stringify and sendTimeout', () => {
        const combineLoggerDataSpy = spyOn<any>(service, 'combineLoggerData');
        const stringifySpy = spyOn<any>(service, 'stringify');
        const sendTimeoutSpy = spyOn<any>(service, 'sendTimeout');
        const loggerData: ILoggerData = {
            args: 'args',
            className: 'className',
            hook: 'hook',
            message: 'message',
            timestamp: 123
        };

        service.log(loggerData);

        expect(combineLoggerDataSpy).toHaveBeenCalled();
        expect(stringifySpy).toHaveBeenCalled();
        expect(sendTimeoutSpy).toHaveBeenCalled();
    });

    it('combineLoggerData: should added to data sessionId', () => {
        const loggerData: ILoggerData = {
            args: 'args',
            className: 'className',
            hook: 'hook',
            message: 'message',
            timestamp: 123
        };

        const combineLoggerData = (service as any).combineLoggerData(loggerData);

        expect(combineLoggerData.sessionId).toBe('uuid');
    });

    describe('sendData: ', () => {
        let fetchSpy: jasmine.Spy, sendTimeoutSpy: jasmine.Spy;

        beforeEach(() => {
            fetchSpy = spyOn(window, 'fetch');
            sendTimeoutSpy = spyOn<any>(service, 'sendTimeout');
        });

        it('should not call fetch when _isSending is true', () => {
            (service as any)._isSending = true;

            (service as any).sendData();

            expect(fetchSpy).not.toHaveBeenCalled();
        });

        it('should not call fetch when _transactions is empty', () => {
            (service as any)._isSending = false;
            (service as any)._transactions = [];

            (service as any).sendData();

            expect(fetchSpy).not.toHaveBeenCalled();
        });

        it('should call fetch and not call sendTimeout when transactions is empty', fakeAsync(() => {
            (service as any)._isSending = false;
            (service as any)._transactions = ['123'];
            fetchSpy.and.returnValue(Promise.resolve('resolve'));

            (service as any).sendData();
            tick();

            expect(fetchSpy).toHaveBeenCalled();
            expect(sendTimeoutSpy).not.toHaveBeenCalled();
            expect((service as any)._transactions.length).toBe(0);
        }));

        it('should call fetch and call sendTimeout when transactions is not empty', fakeAsync(() => {
            (service as any)._isSending = false;
            (service as any)._transactions = ['1', '2', '3'];
            fetchSpy.and.returnValue(Promise.resolve('resolve'));

            (service as any).sendData();
            tick();

            expect(fetchSpy).toHaveBeenCalled();
            expect(sendTimeoutSpy).toHaveBeenCalled();
            expect((service as any)._transactions.length).toBe(1);
        }));

        it('should call fetch and call sendTimeout when send data error', fakeAsync(() => {
            (service as any)._isSending = false;
            (service as any)._transactions = ['1', '2', '3'];
            fetchSpy.and.returnValue(Promise.reject('reject'));

            (service as any).sendData();
            tick();

            expect(fetchSpy).toHaveBeenCalled();
            expect(sendTimeoutSpy).toHaveBeenCalled();
            expect((service as any)._transactions.length).toBe(3);
        }));
    });

    describe('sendTimeout: ', () => {
        let sendDataSpy: jasmine.Spy;

        beforeEach(() => {
            sendDataSpy = spyOn<any>(service, 'sendData');
        });

        it('should not call sendData when sendTimeout exists', fakeAsync(() => {
            (service as any)._sendTimeout = {};

            (service as any).sendTimeout();
            tick((service as any)._sendDataTimeout);

            expect(sendDataSpy).not.toHaveBeenCalled();
        }));

        it('should call sendData when sendTimeout not exists', fakeAsync(() => {
            (service as any)._sendTimeout = null;

            (service as any).sendTimeout();
            tick((service as any)._sendDataTimeout);

            expect(sendDataSpy).toHaveBeenCalled();
        }));
    });

    it('stringify: should return stringify data', () => {
        const loggerData: ILoggerData = {
            args: 'args',
            className: 'className',
            hook: 'hook',
            message: 'message',
            timestamp: 123
        };

        const result = (service as any).stringify(loggerData);

        expect(result).toBeTruthy();
    });

    describe('checkIndexExist: ', () => {
        let fetchSpy: jasmine.Spy, createIndexSpy: jasmine.Spy;

        beforeEach(() => {
            fetchSpy = spyOn(window, 'fetch');
            createIndexSpy = spyOn<any>(service, 'createIndex');
        });

        it('should call fetch and not call createIndex when response.status !== 404', fakeAsync(() => {
            fetchSpy.and.returnValue(Promise.resolve({ status: 200 }));

            (service as any).checkIndexExist();
            tick();

            expect(fetchSpy).toHaveBeenCalled();
            expect(createIndexSpy).not.toHaveBeenCalled();
        }));

        it('should call fetch and call createIndex when response.status === 404', fakeAsync(() => {
            fetchSpy.and.returnValue(Promise.resolve({ status: 404 }));

            (service as any).checkIndexExist();
            tick();

            expect(fetchSpy).toHaveBeenCalled();
            expect(createIndexSpy).toHaveBeenCalled();
        }));

        it('should call fetch and not call createIndex when request failed', fakeAsync(() => {
            fetchSpy.and.returnValue(Promise.reject('error'));

            (service as any).checkIndexExist();
            tick();

            expect(fetchSpy).toHaveBeenCalled();
            expect(createIndexSpy).not.toHaveBeenCalled();
        }));
    });

    it('createIndex: should call fetch', fakeAsync(() => {
        const fetchSpy = spyOn(window, 'fetch');
        fetchSpy.and.returnValue(Promise.resolve({} as any));

        (service as any).createIndex();
        tick();

        expect(fetchSpy).toHaveBeenCalled();
    }));
});
