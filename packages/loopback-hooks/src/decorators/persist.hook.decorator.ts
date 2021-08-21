import {bind, BindingSpec} from '@loopback/core';
import {
  PersistHookOptions,
  PersistHookEvent,
  asPersistHookEvent,
} from '../types';

export function persistHook(
  options: PersistHookOptions,
  ...specs: BindingSpec[]
) {
  if (!options?.modelName) {
    throw new Error('model name must be defined');
  }

  if (!options?.order) {
    options.order = 1;
  }
  if (!options?.observeHooks) {
    options.observeHooks = Object.keys(PersistHookEvent)
      .map(k => +k)
      .filter(k => k >= 0);
  }

  return bind(asPersistHookEvent(options), ...specs);
}
