import {BindingKey, CoreBindings} from '@loopback/core';
import {LoopbackHooksComponent} from './component';

/**
 * Binding keys used by this component.
 */
export namespace LoopbackHooksComponentBindings {
  export const COMPONENT = BindingKey.create<LoopbackHooksComponent>(
    `${CoreBindings.COMPONENTS}.LoopbackHooksComponent`,
  );
}

export namespace RepositoryHookOptionsKeyBindings {
  export const NAMESPACE = 'namespace';
  export const ORDER = 'order';
  export const OBSERVE_HOOKS = 'observeHooks';
}
