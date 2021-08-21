import {Provider} from '@loopback/core';
import {Entity} from '@loopback/repository';
import {HookedRepositoryFn, PersistHookEvent} from '../types';

export class RepositoryHookEvent<T extends Entity>
  implements Provider<HookedRepositoryFn<T>>
{
  constructor() {}

  value() {
    return (rec: T, _event: PersistHookEvent, _id?: unknown) =>
      this.hookAction(rec, _event, _id);
  }
  async hookAction(
    rec: T,
    _event: PersistHookEvent,
    _id?: unknown,
  ): Promise<T> {
    return rec;
  }
}
