export type LifeCycleHook =
    | 'ngOnChanges'
    | 'ngOnInit'
    | 'ngDoCheck'
    | 'ngAfterViewInit'
    | 'ngAfterViewChecked'
    | 'ngAfterContentInit'
    | 'ngAfterContentChecked'
    | 'ngOnDestroy';
