import {BindingScope, config, injectable, Provider} from '@loopback/core';
import {MailService} from '@sendgrid/mail';
import debugFactory from 'debug';
import {SendgridBindings} from '../keys';
import {
  DEFAULT_LOOPBACK_SENDGRID_OPTIONS,
  LoopbackSendgridOptions,
} from '../types';

export type SendgridProvider = MailService;
const debug = debugFactory('loopback:sendgrid:email');

@injectable({scope: BindingScope.SINGLETON})
export class SendgridProviderProvider implements Provider<SendgridProvider> {
  constructor(
    @config({fromBinding: SendgridBindings.COMPONENT})
    protected options: LoopbackSendgridOptions = DEFAULT_LOOPBACK_SENDGRID_OPTIONS,
  ) {}

  async value() {
    debug('Resolving sendgrid options %s', JSON.stringify(this.options));
    const tmpService = new MailService();

    if (this.options.apiKey !== undefined) {
      tmpService.setApiKey(this.options.apiKey!);
    } else if (
      this.options.user !== undefined &&
      this.options.password !== undefined
    ) {
      tmpService.setTwilioEmailAuth(this.options.user, this.options.password);
    } else {
      throw new Error('Must specify the sendgrid API Key');
    }

    tmpService.setTimeout(+this.options.timeOut);

    return tmpService;
  }
}
