import {BindingScope, BindingTemplate} from '@loopback/core';
import {RepositoryHookOptionsKeyBindings} from './keys';

export enum PersistHookEvent {
  BEFORE_CREATE,
  AFTER_CREATE,
  BEFORE_DELETE,
  AFTER_DELETE,
  BEFORE_UPDATE,
  AFTER_UPDATE,
}

export interface HookedRepositoryFn<T> {
  (rec: T, event: PersistHookEvent, id?: unknown): Promise<T>;
}

export interface PersistHookOptions {
  modelName: string;
  order?: number;
  observeHooks?: PersistHookEvent[];
}

export function asPersistHookEvent(
  options: PersistHookOptions,
): BindingTemplate {
  return binding => {
    binding
      .tag({
        [RepositoryHookOptionsKeyBindings.NAMESPACE]: options.modelName,
        [RepositoryHookOptionsKeyBindings.ORDER]: options.order ?? 1,
        [RepositoryHookOptionsKeyBindings.OBSERVE_HOOKS]: options.observeHooks,
      })
      .inScope(BindingScope.TRANSIENT);
  };
}

/**
 * Interface defining the component's options object
 */
export interface LoopbackHooksComponentOptions {
  // Add the definitions here
}

/**
 * Default options for the component
 */
export const DEFAULT_LOOPBACK_HOOKS_OPTIONS: LoopbackHooksComponentOptions = {
  // Specify the values here
};
