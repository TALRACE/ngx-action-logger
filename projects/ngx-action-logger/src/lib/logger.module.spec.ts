import { ConsoleLoggerService } from './console-logger.service';
import { ElasticLoggerService } from './elastic-logger.service';
import { LoggerModule } from './logger.module';

describe('LoggerModule', () => {
    it('forRoot: should return module with providers', () => {
        const getLoggerServicesSpy = spyOn<any>(LoggerModule, 'getLoggerServices');

        const result = LoggerModule.forRoot();

        expect(getLoggerServicesSpy).toHaveBeenCalled();
        expect(result).toBeTruthy();
    });

    describe('getLoggerServices', () => {
        it('should return ConsoleLoggerService when options is null', () => {
            const result = (LoggerModule as any).getLoggerServices(null);

            expect(result).toBe(ConsoleLoggerService);
        });

        it('should return options logger service when options logger service exists', () => {
            const serviceMock = {};
            const result = (LoggerModule as any).getLoggerServices({ loggerService: serviceMock });

            expect(result).toBe(serviceMock);
        });

        it('should return elastic logger service when elastic options exists', () => {
            const result = (LoggerModule as any).getLoggerServices({ elasticOptions: {} });

            expect(result).toBe(ElasticLoggerService);
        });

        it('should return ConsoleLoggerService when options exists but option logger service and elastic options not exists', () => {
            const result = (LoggerModule as any).getLoggerServices({});

            expect(result).toBe(ConsoleLoggerService);
        });
    });
});
