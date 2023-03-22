import { ILoggerData } from './interface';

export abstract class LoggerService {
    abstract log(loggerData: ILoggerData): void;
}
