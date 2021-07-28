# loopback-sendgrid

This component can used to leverage (sendgrid)[https://sendgrid.com/] email
services from your loopback 4 application.

## Installation & Configuration

Install the @eyc/loopback-sendgrid using `npm`;

```sh
$ [npm install | yarn add] @eyc/loopback-sendgrid
```

### Basic Configuration

Configure and load LoopbackSendgridComponent in the application constructor as
shown below.

```ts
import {LoopbackSendgridComponent, SendgridBindings,
        LoopbackSendgridOptions} from '@eyc/loopback-sendgrid';
// ...

export class MyApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
    // ...

    const sendGridOpts: LoopbackSendgridOptions = {
      apiKey: process.env.SENDGRID_API_KEY,
      timeOut: 3000
    };
    this.configure(SendgridBindings.COMPONENT).to(sendGridOpts);

    // Finally register with the application
    this.component(LoopbackSendgridComponent);

    // ...
  }
  // ...
}
```

### Environment Variable Configuration

You can use the following recommended environment variables, very useful
specially when your application or micro service is containerized.

```sh
export SENDGRID_API_KEY = 'YOUR_APIKEY_FROM_SENDGRID';
```

If you want to use twilio username/password and NOT the apiKey, then do not set
the `SENDGRID_API_KEY` but rather the following two environment variables and
configure the `user` and `password` properties in the `application.ts` file.

```sh
export SENDGRID_TWILIO_USER = 'YOUR_USERNAME';
export SENDGRID_TWILIO_PASS = 'YOUR_PASSWORD',
```

## How to use it

You can inject the sendGrid provider artifact directly in your controller or
inside any service class as such:

```ts
import {SendgridBindings, SendGridMailData, SendgridProvider}
       from '@eyc/loopback-sendgrid';
// ...
constructor(
 @inject(SendgridBindings.PROVIDER) private sendGrid: SendgridProvider
)

// ...
```

And then you have access to the `send` or `sendMultiple` methods.

## Sending a simple email

```ts
const data: SendGridMailData = {
  from: 'yourValidatedEmail@yourcompany.com',
  to: 'theRecipient@example.com',
  subject: 'Sending with Loopback and SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

try {
  const result = await this.sendGrid.send(data);
} catch (err) {
  console.log(JSON.stringify(err));
}
```

## Sending with a template ID

SendGrid allows you to create templates in their admin panel. Basically they can
be based on html or text. The system replaced variables specified in the
template such as `{{orderNumber}}` with that property inside an object you send
along with the associated template ID. Note that this ID corresonds to the `ID`
for the underlying versions associated to the template definition.

You can use Loopback models in the `dynamicTemplateData`. Also note that we
don't have to specify the `subject:` property, since that's defined in the
template definition screen at (sendgrid)[https://sendgrid.com/]

```ts
const data: SendGridMailData = {
  from: 'yourValidatedEmail@yourcompany.com',
  to: 'theRecipient@example.com',
  templateId: 'd-01ayourVersionedTemplateID240949cdffc46342',
  dynamicTemplateData: {
    firstName: 'Maria Paula',
    orderNumber: '23232323',
    total: 'USD 199.00',
  },
};

try {
  const result = await this.sendGrid.send(data);
} catch (err) {
  console.log(JSON.stringify(err));
}
```

## Other typed Objects

The component exports from the original package the following interfaces

- **SendGridMailData** This is an interface that you can use in order to create
  the `data` to be sent to `send` or `sendMultiple` methods

- **SendGridResponse** This is the interface representing the full response from
  sendGrid, from there you can grab the `x-message-id` from the array response

- **SendGridErrorResponse** This is the Error Interface
