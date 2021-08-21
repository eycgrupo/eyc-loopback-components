import {
  Entity,
  IsolationLevel,
  juggler,
  Options,
  Transaction,
  TransactionalEntityRepository,
} from '@loopback/repository';
import {CrudHooksRepository} from './crud-hooks.repository.base';

export class CrudHooksTransactionalRepository<
    T extends Entity,
    ID,
    Relations extends object = {},
  >
  extends CrudHooksRepository<T, ID, Relations>
  implements TransactionalEntityRepository<T, ID, Relations>
{
  constructor(
    entityClass: typeof Entity & {
      prototype: T;
    },
    dataSource: juggler.DataSource,
  ) {
    super(entityClass, dataSource);
  }

  async beginTransaction(
    options?: IsolationLevel | Options,
  ): Promise<Transaction> {
    const dsOptions: juggler.IsolationLevel | Options = options ?? {};
    // juggler.Transaction still has the Promise/Callback variants of the
    // Transaction methods
    // so we need it cast it back
    return (await this.dataSource.beginTransaction(dsOptions)) as Transaction;
  }
}
