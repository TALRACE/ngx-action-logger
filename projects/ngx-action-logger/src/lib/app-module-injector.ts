import { Injector } from '@angular/core';

let appModuleRefInjector: Injector | null;
export const appModuleInjector = (injector?: Injector): Injector => {
    if (!appModuleRefInjector) {
        appModuleRefInjector = injector as Injector;
    }

    return appModuleRefInjector;
};

export const clearInjector = () => {
    appModuleRefInjector = null;
};
