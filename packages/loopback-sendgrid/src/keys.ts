import {BindingKey, CoreBindings} from '@loopback/core';
import {LoopbackSendgridComponent} from './component';
import {SendgridProviderProvider} from './providers';

/**
 * Binding keys used by this component.
 */
export namespace SendgridBindings {
  export const COMPONENT = BindingKey.create<LoopbackSendgridComponent>(
    `${CoreBindings.COMPONENTS}.LoopbackSendgridComponent`,
  );
  export const PROVIDER = BindingKey.create<SendgridProviderProvider>(
    'services.sendgrid.provider.provider',
  );
}
