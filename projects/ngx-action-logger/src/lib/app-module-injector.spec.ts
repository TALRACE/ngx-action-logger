import { appModuleInjector, clearInjector } from './app-module-injector';

describe('appModuleInjector:', () => {
    afterEach(() => {
        clearInjector();
    });

    it('should set app module injector and return it', () => {
        const newInjector = { name: 'injector1' } as any;

        const injector = appModuleInjector(newInjector);

        expect(injector).toEqual(newInjector);
    });

    it('should return old injector', () => {
        const newInjector1 = { name: 'injector1' } as any;
        appModuleInjector(newInjector1);
        const newInjector2 = { name: 'injector2' } as any;

        const injector = appModuleInjector(newInjector2);

        expect(injector).toEqual(newInjector1);
    });
});
