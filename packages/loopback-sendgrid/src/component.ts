import {
  Application,
  injectable,
  Component,
  config,
  ContextTags,
  CoreBindings,
  inject,
} from '@loopback/core';
import {SendgridBindings} from './keys';
import {
  DEFAULT_LOOPBACK_SENDGRID_OPTIONS,
  LoopbackSendgridOptions,
} from './types';
import {SendgridProviderProvider} from './providers';

// Configure the binding for LoopbackAwsEmailComponent
@injectable({
  tags: {[ContextTags.KEY]: SendgridBindings.COMPONENT},
})
export class LoopbackSendgridComponent implements Component {
  providers = {
    [SendgridBindings.PROVIDER.key]: SendgridProviderProvider,
  };
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private application: Application,
    @config()
    private options: LoopbackSendgridOptions = DEFAULT_LOOPBACK_SENDGRID_OPTIONS,
  ) {}
}
