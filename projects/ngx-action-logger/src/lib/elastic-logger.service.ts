import { Buffer } from 'buffer';
import { Inject, Injectable } from '@angular/core';

import { DEFAULT_INDEX_PROPERTIES, LOGGER_OPTIONS } from './const';
import { ILoggerData, ILoggerOptions } from './interface';
import { LoggerService } from './abstract-logger.service';

@Injectable()
export class ElasticLoggerService extends LoggerService {
    private _transactions: string[] = [];

    private _isSending = false;

    private _sendTimeout!: any;

    private readonly _authorization: string;

    private readonly _chunkSize: number = 100;

    private readonly _sendDataTimeout: number = 5000;

    constructor(@Inject(LOGGER_OPTIONS) protected _loggerOptions: ILoggerOptions) {
        super();

        if (!this._loggerOptions.elasticOptions) {
            throw new Error(`Elastic options cannot be empty`);
        }

        this._authorization = `Basic ${Buffer.from(
            `${this._loggerOptions.elasticOptions.username}:${this._loggerOptions.elasticOptions.password}`
        ).toString('base64')}`;

        if (this._loggerOptions.elasticOptions.chunkSize) {
            this._chunkSize = this._loggerOptions.elasticOptions.chunkSize;
        }

        if (this._loggerOptions.elasticOptions.sendDataTimeout) {
            this._sendDataTimeout = this._loggerOptions.elasticOptions.sendDataTimeout;
        }
        this.checkIndexExist();
    }

    log(loggerData: ILoggerData): void {
        const logData = this.combineLoggerData(loggerData);
        this._transactions.push(this.stringify(logData));
        this.sendTimeout();
    }

    protected combineLoggerData(loggerData: ILoggerData): any {
        return { ...loggerData, sessionId: this._loggerOptions.sessionId };
    }

    protected sendData(): void {
        this._sendTimeout = null;

        if (this._isSending || !this._transactions.length) {
            return;
        }

        this._isSending = true;
        const logData = this._transactions.splice(0, this._chunkSize);

        window
            .fetch(`${this._loggerOptions.elasticOptions?.url}/_bulk`, {
                body: logData.join(''),
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Content-Type': 'application/x-ndjson',
                    // eslint-disable-next-line prettier/prettier
                    Authorization: this._authorization
                },
                method: 'POST'
            })
            .then(() => {
                this._isSending = false;

                if (this._transactions.length) {
                    this.sendTimeout();
                }
            })
            .catch(() => {
                this._transactions.unshift(...logData);
                this.sendTimeout();
                this._isSending = false;
            });
    }

    protected sendTimeout(): void {
        if (this._sendTimeout) {
            return;
        }

        this._sendTimeout = setTimeout(() => this.sendData(), this._sendDataTimeout);
    }

    protected stringify(log: ILoggerData): string {
        return `{"create":{"_index":"${this._loggerOptions.elasticOptions?.index}"}}\n${JSON.stringify(log)}\n`;
    }

    protected checkIndexExist(): void {
        window
            .fetch(`${this._loggerOptions.elasticOptions?.url}/${this._loggerOptions.elasticOptions?.index}`, {
                headers: {
                    // eslint-disable-next-line prettier/prettier
                    Authorization: this._authorization
                },
                method: 'HEAD'
            })
            .then((response: Response) => {
                if (response.status !== 404) {
                    return;
                }

                this.createIndex();
            })
            .catch(() => {
                // continue regardless of error
            });
    }

    protected createIndex(): void {
        window
            .fetch(`${this._loggerOptions.elasticOptions?.url}/${this._loggerOptions.elasticOptions?.index}`, {
                body: this._loggerOptions.elasticOptions?.indexProperties || DEFAULT_INDEX_PROPERTIES,
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Content-Type': 'application/json',
                    // eslint-disable-next-line prettier/prettier
                    Authorization: this._authorization
                },
                method: 'PUT'
            })
            .catch(() => {
                // continue regardless of error
            });
    }
}
