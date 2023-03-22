# ngx-action-logger

## Description

Logger for Angular applications, capable of both outputting data to the console or sending data to elastic. After sending to the elastic, you can view the data (for example, in kibana), build custom charts, etc. There are two decorators - LogComponentLifeCycle and Log.
LogComponentLifeCycle - used for component life cycle logging, Log - function logging. Also, the logger can be used anywhere using DI. It is possible to expand the logged data or use your own service for logging that expands or complements the functionality.

## Installation

Add LoggerModule to your AppModule

```typescript
...
import { appModuleInjector, LoggerModule } from 'ngx-action-logger';
...

@NgModule({
    ...
    imports: [
        ...
        LoggerModule.forRoot({
            sessionId: 'uuid',
            elasticOptions: { index: 'yourIndex', url: 'http://localhost:9200', username: 'elastic', password: '123456' }
        }),
        ...
    ],
    ...
})
export class AppModule {
    constructor(protected injector: Injector) {
        appModuleInjector(injector);
    }
}
```

### LogComponentLifeCycle decorator

```typescript
@LogComponentLifeCycle({ className: 'UsersComponent', hooks: ['ngOnInit', 'ngOnDestroy'], message: 'customMessage' })
@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent {}
```

### Log decorator

```typescript
@Log({ className: 'UsersComponent', message: 'customMessage' })
onCancel(): void {}
```

### Kibana example

After successfully sending the data to elastic, you can view the data and build graphs in kibana. For this you need:

1. Create new index patter (Stack Management -> Index patterns -> Create index pattern). Type your index name to the input and click "Next step".

![type your index name](https://github.com/TALRACE/ngx-action-logger/img/kibana_1.png?raw=true)

 Select time filter filed (index by default contains "timestamp" filed with date property type by default) and click "Create index pattern".
![select time filter filed](https://github.com/TALRACE/ngx-action-logger/img/kibana_2.png?raw=true)

 After some seconds you can see your created index pattern with all fields.
![created index pattern](https://github.com/TALRACE/ngx-action-logger/img/kibana_3.png?raw=true)

2. You can discover index data. Open "Discover" page in kibana.
!["Discover" page](https://github.com/TALRACE/ngx-action-logger/img/kibana_4.png?raw=true)

Select your index pattern and research incoming data. Use search if needed used [KQL](https://www.elastic.co/guide/en/kibana/7.8/kuery-query.html).
!["Discover" data](https://github.com/TALRACE/ngx-action-logger/img/kibana_5.png?raw=true)

3. You can combine data views from any Kibana app into one dashboard and see everything in one place. Open "Dashboards" page in kibana.
!["Dashboards" data](https://github.com/TALRACE/ngx-action-logger/img/kibana_6.png?raw=true)

Select "Create new dashboard".
![Create new dashboard](https://github.com/TALRACE/ngx-action-logger/img/kibana_7.png?raw=true)

Add an existing or new object to this dashboard, click "Create new".
![Create new](https://github.com/TALRACE/ngx-action-logger/img/kibana_8.png?raw=true)

Select "Go to Lens" or select visualization.
![Go to Lens](https://github.com/TALRACE/ngx-action-logger/img/kibana_9.png?raw=true)

Drag any fields in left side and drop fields in center for display visualization.
![Drag any fields](https://github.com/TALRACE/ngx-action-logger/img/kibana_10.png?raw=true)

Select any other Suggestions or change settings in right side.
![Select any Suggestions](https://github.com/TALRACE/ngx-action-logger/img/kibana_11.png?raw=true)

Save your visualization and Add title and description.
![Save your visualization](https://github.com/TALRACE/ngx-action-logger/img/kibana_12.png?raw=true)

Create new visualization if needed.
![Create new visualization if needed.](https://github.com/TALRACE/ngx-action-logger/img/kibana_13.png?raw=true)

### API

Logger module used API:

#### LoggerModule

* `forRoot` - used for add module to your project (see example)

#### ConsoleLoggerService

Logger by default. Logger use this service when not set other service in config or not set config for elastic.
All incoming data in log shown in console 

#### ElasticLoggerService

Send data to elastic for logging. You can check data in kibana or added custom dashboard graphics, for example.

* `url` - elastic url for send data

* `index` - elastic index. Logger check index before send data, when index not exists - create index with typed properties

* `username` - login for access to elastic

* `password` - password for access to elastic

* `indexProperties?` - custom mapping index properties (used DEFAULT_INDEX_PROPERTIES const when this property is empty)

* `chunkSize?` - max chuck with elastic data (used 100 when this property is empty)

* `sendDataTimeout?` - timeout between send data to elastic. Before send to elastic data is accumulated in a transaction (used 5000 milliseconds when this property is empty)

#### Decorators

LogComponentLifeCycle - life cycle decorator for components.

* `className?` - custom class name for current component (by default used current class name, but in prod mode the class name is unreadable)

* `message?` - custom message, empty by default

* `hooks?` - component life cycle hooks for logging (if empty used DEFAULT_LOG_DECORATOR_LIFE_CYCLE_OPTIONS)

Log - logging decorator for functions

* `className?` - custom class name for current class (by default used current class name, but in prod mode the class name is unreadable)

* `message?` - custom message, empty by default

#### Injector

* `appModuleInjector` - set or get app injector

* `clearInjector` - clear app injector

#### Const

* `DEFAULT_OPTIONS` - default options for logger, user in logger initialization

* `LOGGER_OPTIONS` - injection token for logger options

* `DEFAULT_LOG_DECORATOR_LIFE_CYCLE_OPTIONS` - default logger hooks for LogComponentLifeCycle. Used by default when not set any hook in LogComponentLifeCycle

* `DEFAULT_INDEX_PROPERTIES` - json for create elastic index with typed properties