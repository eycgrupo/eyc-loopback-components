import {
  Application,
  injectable,
  Component,
  config,
  ContextTags,
  CoreBindings,
  inject,
} from '@loopback/core';
import {LoopbackHooksComponentBindings} from './keys';
import {
  DEFAULT_LOOPBACK_HOOKS_OPTIONS,
  LoopbackHooksComponentOptions,
} from './types';

// Configure the binding for LoopbackHooksComponent
@injectable({
  tags: {[ContextTags.KEY]: LoopbackHooksComponentBindings.COMPONENT},
})
export class LoopbackHooksComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private application: Application,
    @config()
    private options: LoopbackHooksComponentOptions = DEFAULT_LOOPBACK_HOOKS_OPTIONS,
  ) {}
}
