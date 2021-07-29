import {expect} from '@loopback/testlab';
import {Application} from '@loopback/core';
import {
  LoopbackSendgridComponent,
  LoopbackSendgridOptions,
  SendGridMailData,
  SendgridProvider,
  SendgridBindings,
  SendGridResponse,
} from '../..';
import {Suite} from 'mocha';
import {SendGridErrorResponse} from '../../types';

describe('Loopback-sendgrid (acceptance)', function (this: Suite) {
  let app: Application;
  this.timeout(6000);

  beforeEach(async () => {
    app = givenApplication();

    const sendGridOpts: LoopbackSendgridOptions = {
      apiKey: process.env.SENDGRID_API_KEY,
      timeOut: 3000,
    };
    app.configure(SendgridBindings.COMPONENT).to(sendGridOpts);

    app.component(LoopbackSendgridComponent);
    await app.start();
  });

  it('sends a simple email in sandbox mode', async () => {
    const sendGrid = await app.get<SendgridProvider>(SendgridBindings.PROVIDER);

    // sandboxMode: { enable: true } is used to test it without actually
    // sending the email.
    const data: SendGridMailData = {
      from: process.env.SENDGRID_EMAIL_FROM!,
      to: process.env.SENDGRID_EMAIL_TO,
      subject: 'Sending simple email with Loopback and SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      mailSettings: {
        sandboxMode: {enable: true},
      },
    };
    const result = await sendGrid.send(data as SendGridMailData);
    // in SandBoxmode it is 200, in real call it is 202
    expect((result[0] as SendGridResponse).statusCode).to.match(200);
  });

  it('sends a template email with real account', async () => {
    const sendGrid = await app.get<SendgridProvider>(SendgridBindings.PROVIDER);

    // We don't send the subject since it is set in the template, in this
    // case it was set as Subject: Order number {{orderNumber}}
    const data = {
      from: process.env.SENDGRID_EMAIL_FROM!,
      to: process.env.SENDGRID_EMAIL_TO,
      templateId: process.env.SENDGRID_TEMPLATE_ID,
      dynamicTemplateData: {
        firstName: 'John Doe',
        orderNumber: new Date().toISOString,
        total: 'USD 199.00',
      },
    };
    const result = await sendGrid.send(data as SendGridMailData);
    expect((result[0] as SendGridResponse).statusCode).to.match(202);
  });

  it('fails when wrong email From with sandBoxMode', async () => {
    const sendGrid = await app.get<SendgridProvider>(SendgridBindings.PROVIDER);
    const data: SendGridMailData = {
      from: 'wrongemail@example.com',
      to: process.env.SENDGRID_EMAIL_TO,
      subject: 'Sending simple email with Loopback and SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      mailSettings: {
        sandboxMode: {enable: true},
      },
    };
    try {
      await sendGrid.send(data as SendGridMailData);
    } catch (err) {
      expect((err as SendGridErrorResponse).code).to.match(403);
    }
  });

  afterEach(async () => {
    if (app) await app.stop();
    (app as unknown) = undefined;
  });

  function givenApplication() {
    return new Application();
  }
});
