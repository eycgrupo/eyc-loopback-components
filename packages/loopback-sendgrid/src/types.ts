import {MailDataRequired, ClientResponse, ResponseError} from '@sendgrid/mail';
/**
 * Interface defining the component's options object
 */
export interface LoopbackSendgridOptions {
  apiKey?: string;
  user?: string;
  password?: string;
  timeOut: number;
}

/**
 * Default options for the component
 */
export const DEFAULT_LOOPBACK_SENDGRID_OPTIONS: LoopbackSendgridOptions = {
  timeOut: 3000,
};

export type SendGridMailData = MailDataRequired;
export type SendGridResponse = ClientResponse;
export type SendGridErrorResponse = ResponseError;
