# loopback-hooks

This extension leverages the extensibility architecture & design of the **Loopback4 Framework** by providing a concept of **CUD hooks** at the repository level having the model name as the namespace associated to the hook events.

The extension needs `@loopback/repository` and `@loopback/rest` packages installed in your project, so it is assuming you are building a **REST API** and operations against a database.

Placing the triggered code at an isolated artifact that will be invoked automatically for you, can  give you better visibility when reviewing code and isolating problems.

Lastly we hope someday this extension feature can get implemented in the main code base at the `loopback` monorepo.

## Supported CUD Hook Events

The supported hooks are numerated from the interface `PersistHookEvent`.

- BEFORE_CREATE
- AFTER_CREATE
- BEFORE_UPDATE
- AFTER_UPDATE
- BEFORE_DELETE
- AFTER_DELETE


## Installation

Install `@eyc/loopback-hooks` using `npm`;

```sh
$ [npm install | yarn add] @eyc/loopback-hooks
```

### Register the component at the `application.ts`

Configure and load LoopbackHooksComponent in the application constructor
as shown below.

```ts
import {LoopbackHooksComponent} from '@eyc/loopback-hooks';
// ...
export class MyApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
  constructor(options: ApplicationConfig = {}) {
    // ...

    this.component(LoopbackHooksComponent);

    // ...
  }
  // ...
}
```

## Converting a repository to support hooks

Once the extension has been installed and registered in the application, you can convert any existing repository to support hooks by extending from either `CrudHookRepository` or `CrudHooksTransactionalRepository`.

For example for extending `CrudHookRepository` we need to import it and extend my current repository as such.

```ts
import {CrudHooksRepository} from '@eyc/loopback-hooks';

export class YourVeryOwnRepository extends CrudHooksRepository<

```

That's it, now your repository supports hooks. Let's see next, how we can generate a hook.


## Generating a repository hook

We will create a service class that will be located in the `src/services` directory. You can use the code in the last section as a base template for now.

`@eyc/loopback-hooks` exports `RepositoryHookEvent` base class that you need to `extend` in order to create a hook. Internally it is a **provider** that returns a function that will receive 3 parameters (*one optional*) and return a record, representing your model.

The class is decorated wih `@persistHook` decorator which receives 3 parameters (*two optional*) as such:

- ***modelName*** (*required*)
  Should contain the `name` function contributed by your `Model class name`
- ***order** (*optional*)
  Numeric value used representing the order of execution (ASC) in case you have more than one hook event associated to the repository. 
  *If you don't provide a value it will be default to one*.
- ***observerHooks*** (*optional*)
  **This is important!** to hint the `hook executor` about the `hook events` your hook is going to list and act upon.
  *If you don't provide a value then your hook will be invoked for **ALL** the events*.

### Example

Here we are saying that the class `TodoListRepositoryHook` extends `RepositoryHookEvent` base class for the `TodoList` model, its order of executing is 2 and it will observe two events: 1) BEFORE_CREATE and 2) AFTER_CREATE only.

You have great flexibility with the class, you can `inject` other services, to do whatever you want to do with the `hook`.

```ts
@persistHook({
  modelName: TodoList.name,
  order: 2,
  observeHooks: [
    PersistHookEvent.BEFORE_CREATE,
    PersistHookEvent.AFTER_CREATE,
  ],
})
export class TodoListRepositoryHook extends RepositoryHookEvent<TodoList> {
  constructor() {
    super();
  }
```

No we need to implement the `hookAction` method, which is mandatory to implement. Notice that the `_event` and `_id` are prefix with `_` so that typescript doesn't complain in case we don't use it, in cases where your `hook` is only observing one event , you might not need to inspect the `_event` parameter.

Notice that we had to specify the `TodoList` model in our case no only for the `rec` parameter but also the returned Promise type `Promise<TodoList>`. You can do whatever you want with `rec`, you can throw `HttpErros` from here, or do any other action such as sending emails, data to message queues, logs etc.

```ts
async hookAction(
    rec: TodoList,
    _event: PersistHookEvent,
    _id?: unknown,
  ): Promise<TodoList> {
    switch (_event) {
      case PersistHookEvent.BEFORE_CREATE:
        console.log('Rec before create ', rec);
        break;
      case PersistHookEvent.AFTER_CREATE:
        console.log('Rec after create ', rec);
        break;
    }
    return rec;
  }
```

And that's it, if you run the application now and create a new Todo from the `todo-list` examples you will see the corresponding logs in the console.


### Final code that can serve as a base template for your hooks.

Please note that the class name can have any valid loopback 4 service name. We are using `TodoListRepositoryHook` in this case as an example and to keep the names consistenly to the context, in this case `hooks`.

```ts
import {persistHook, PersistHookEvent, RepositoryHookEvent} from '@eyc/loopback-hooks';
import {TodoList} from '../models';

@persistHook({
  modelName: TodoList.name,
  order: 2,
  observeHooks: [
    PersistHookEvent.BEFORE_CREATE,
    PersistHookEvent.AFTER_CREATE,
  ],
})
export class TodoListRepositoryHook extends RepositoryHookEvent<TodoList> {
  constructor() {
    super();
  }

  async hookAction(
    rec: TodoList,
    _event: PersistHookEvent,
    _id?: unknown,
  ): Promise<TodoList> {
    switch (_event) {
      case PersistHookEvent.BEFORE_CREATE:
        console.log('BEFORE CREATE ', rec);
        break;
      case PersistHookEvent.AFTER_CREATE:
        console.log('AFTER CREATE ', rec);
        break;
    }
    return rec;
  }
}

```
