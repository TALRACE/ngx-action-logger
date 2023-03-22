import { InjectionToken } from '@angular/core';

import { ILogDecoratorLifeCycleOptions, ILoggerOptions } from './interface';
import { LifeCycleHook } from './type';

export const DEFAULT_OPTIONS: ILoggerOptions = {
    sessionId: ''
};

export const LOGGER_OPTIONS = new InjectionToken<ILoggerOptions>('LOGGER_OPTIONS');

export const DEFAULT_LOG_DECORATOR_LIFE_CYCLE_OPTIONS: ILogDecoratorLifeCycleOptions = {
    hooks: ['ngOnInit', 'ngOnChanges', 'ngAfterViewInit'] as LifeCycleHook[]
};

export const DEFAULT_INDEX_PROPERTIES = `{
    "mappings": {
        "properties": {
            "className": { "type": "keyword" },
            "hook": { "type": "keyword" },
            "args": { "type": "flattened" },
            "message": { "type": "keyword" },
            "sessionId": { "type": "keyword" },
            "timestamp": { "type": "date" }
        }
    }
}`;
