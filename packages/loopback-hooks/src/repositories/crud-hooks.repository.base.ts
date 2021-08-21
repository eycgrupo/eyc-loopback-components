import {Application, Binding, inject} from '@loopback/core';
import {
  Count,
  DataObject,
  DefaultCrudRepository,
  Entity,
  juggler,
  Where,
} from '@loopback/repository';
import legacy, {Options} from 'loopback-datasource-juggler';
import {HookedRepositoryFn, PersistHookEvent} from '../types';

export class CrudHooksRepository<
  T extends Entity,
  ID,
  Relations extends object = {},
> extends DefaultCrudRepository<T, ID, Relations> {
  @inject.context() private appCtx: Application;

  constructor(
    entityClass: typeof Entity & {
      prototype: T;
    },
    dataSource: juggler.DataSource,
  ) {
    super(entityClass, dataSource);
  }

  async create(entity: DataObject<T>, options?: Options): Promise<T> {
    entity = await this.executeHooks(entity, PersistHookEvent.BEFORE_CREATE);
    entity = await super.create(entity, options ?? undefined);
    entity = await this.executeHooks(entity, PersistHookEvent.AFTER_CREATE);
    return <T>entity;
  }

  async deleteById(id: ID, options?: Options): Promise<void> {
    let dObj = {};
    try {
      const data = await this.findById(id);
      if (data !== undefined) {
        dObj = await this.entityToData(data);
      }
    } finally {
      await this.executeHooks(dObj, PersistHookEvent.BEFORE_DELETE, id);
      await super.deleteById(id, options ?? undefined);
      await this.executeHooks(dObj, PersistHookEvent.AFTER_DELETE, id);
      }
  }

  async replaceById(
    id: ID,
    data: DataObject<T>,
    options?: Options,
  ): Promise<void> {
    data = (await this.executeHooks(
      data,
      PersistHookEvent.BEFORE_UPDATE,
      id,
    )) as DataObject<T>;
    await super.replaceById(id, data, options ?? undefined);
    await this.executeHooks(data, PersistHookEvent.AFTER_UPDATE, id);
  }

  async updateById(
    id: ID,
    data: DataObject<T>,
    options?: Options,
  ): Promise<void> {
    data = (await this.executeHooks(
      data,
      PersistHookEvent.BEFORE_UPDATE,
      id,
    )) as DataObject<T>;
    // Notice that we don't call updatebyID from the super class anymore.
    // The replaceById is not only optimized but also the this.updatebyID
    // will call this.udpateAll, firing the updateAll hooks automatically
    // duplicating the calls of the hooks.
    await super.replaceById(id, data, options ?? undefined);
    await this.executeHooks(data, PersistHookEvent.AFTER_UPDATE, id);
  }

  async updateAll(
    data: DataObject<T>,
    where?: Where<T>,
    options?: Options,
  ): Promise<Count> {
    data = (await this.executeHooks(
      data,
      PersistHookEvent.BEFORE_UPDATE,
    )) as DataObject<T>;
    const retVal = await super.updateAll(data, where, options ?? undefined);
    await this.executeHooks(
      retVal as DataObject<T>,
      PersistHookEvent.AFTER_UPDATE,
    );
    return retVal;
  }
  /**
   *
   * @param entity The model central to the event
   * @param event  The enumarated event
   * @param id Optional ID for the record when applicable
   * @returns legacy persisten model
   */
  private async executeHooks<R extends T>(
    entity: R | DataObject<R>,
    event: PersistHookEvent,
    id?: ID,
  ): Promise<legacy.ModelData<legacy.PersistedModel>> {
    if (this.appCtx !== undefined) {
      const foundHooks = this.appCtx
        .findByTag({namespace: this.entityClass.name})
        .filter((a: Readonly<Binding<unknown>>) =>
          a.tagMap.observeHooks.includes(event),
        )
        .sort(
          (a: Readonly<Binding<unknown>>, b: Readonly<Binding<unknown>>) =>
            a.tagMap.order - b.tagMap.order,
        );

      for (const hookAction of foundHooks) {
        const funValue = await this.appCtx.get<HookedRepositoryFn<T>>(
          hookAction.key,
        );
        entity = await funValue(<R>entity, event, id ?? undefined);
      }
    }
    return entity;
  }
}
