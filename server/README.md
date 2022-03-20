# Techies Welfare Server

This is the server-side implementation of the Techies Welfare system.

## Tech Stack and Dependencies

The backend is primarily based on:
- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/) as the foundation for the web API
- [TypeScript](https://www.typescriptlang.org/) for writing type-safe code
- [MongoDB](https://www.mongodb.com/) for the database

The server also integrates with the following external services or APIs, which may require to acquire and configure your own API credentials in order to test them locally:
- [Flutterwave](https://developer.flutterwave.com/docs) for payment processing
- [Africa's Talking](https://developers.africastalking.com/) for bulk SMS

## Install instructions

- Install [Node.js 14+](https://nodejs.org/en/). You might find it more convenient to use the [nvm](https://github.com/nvm-sh/nvm) tool ([nvm-windows](https://github.com/coreybutler/nvm-windows) for Windows) to install and manage different versions of Node.js on your machine.
- Install [MongoDB Community Edition 4+](https://docs.mongodb.com/manual/installation/). Consider launching the MongoDB server as a background service running on port `27017`.

Install dependencies by running:

```
npm install
```

### Launch the MongoDB server

Run the MongoDB server on port `27017` if it's not already the case.


### Build the server

This will compile and build the TS code output the resulting JS code in the `dist` directory:

```
npm run build
```

### Start the server

```
npm run start
```

This will run the server locally on port `4000`

### Run the CLI setup to register initial admin

The project contains a CLI app that you can use to run some administrative commands.

The app does not have a sign-up feature. Members can only be added by admins. To register the initial
admin, run the following command:

```
npm run cli setup
```

The command will fail if the project already has registered users.

### Rebuilding during development

Currently, the server is not set-up to auto-rebuild when code changes occur. So when you want to test your changes, you'll need to manually terminate the server and rebuild and re-run it: `npm run build && npm run start`

### Mock OTP-based authentication

The app currently sends one-time pass codes via SMS and Email for authentication (instead of passwords, for convenience).

If you have not configured Africa's Talking for SMS or SendGrid for Email (see [Configuration](#configuration)), a mock SMS gateway will be used which simply logs SMS messages on the console. When logging in, check the terminal where the server is running to see the generated OTP pass code.

## Configuration

The server uses a bunch of config variables which are retrieved from environment variables. These includes things like server port, MongoDB address, API Keys, web app base URL, etc.

You can override the defaults by creating a `.env` file in the `server` root directory and populating the file with the relevant variable-value pairs. Check out the [`env.example`](./env.example) file to see an example of what the file is supposed to look like.

To learn more about all the different available config options, check the [src/core/config.ts](./src/core/config.ts) source file. Specifically, the `loadAppConfigFromEnv` functions shows which environment variable keys are used to retrieve which values.

If you update your `.env` file, you need to re-run the server for the changes to take effect.

### Web app base URL

The server needs to know the app's base URL in order for payment links and post-payment redirection to work properly. The **base URL should be the url where the frontend web app is hosted**. By default this is `http://localhost:3000` during development.

When you deploy to production or staging, you should set the `WEB_APP_BASE_URL` env variable to match the root url of the frontend, e.g. `https://toleo-app.example.com`.

### Configuring Flutterwave integration

In order to test the payments feature, you need to set up a Flutterwave account and enable Test Mode. The Test Mode will allow you to simulate Flutterwave payments without spending any money. You will be able to test a realistic Flutterwave payment UI and get webhook payment notifications.

#### Configuring the Secret Key

Once you've set up the account and enabled Test Mode (which is the default), on the Flutterwave dashboard go to **Settings** -> **APIS**. Copy the test **Secret Key** and configure it in the `.env` file or environment variable `FLUTTERWAVE_SECRET_KEY` (see the [Configuration](#configuration) section below). This key will allow the app to interact with your Flutterwave account.

#### Configuring a local webhook for testing
Next you need to set up a webhook to receive notifications from Flutterwave. By default, the local server expects Flutterwave notifications on `http://localhost:4000/webhooks/flutterwave`. But since Flutterwave cannot reach our localhost, we need to set up a tunnel that will link a publicly accessible URL to out localhost. We can use [ngrok.io](https://ngrok.io/) for this. Download and setup the `ngrok` tool on your machine (or a similar tool). Setup a tunnel to your local server using the command `ngrok http 4000`. The tool will setup a public URL for your local server, e.g. `abc-def.ngrok.io`. Use this as the host to your server when setting up a webhook (i.e. replacing the `localhost:4000` part).

To configure your webhook on Flutterwave, go the **Webhooks** tab on the Settings page then set up the URL, e.g. `https://abc-def.ngrok.io/webhooks/flutterwave`.

#### Configuring webhook on production or staging
When you deploy your app, the webhook should target your deployed app's public domain. To "hide" the webhook from the public to avoid getting false payment notifications, you can add an secret component to the web hook path. The app allows you to set a secret webhook endpoint by setting the webhook path using the `FLUTTERWAVE_WEBHOOKS` environment variable or `env` file.

For example, if you server is hosted at `https://toleo.example.com` and you set `FLUTTERWAVE_WEBHOOKS` to `/webhooks/flutterwave/randomsecret`, then the webhook to register on Flutterwave should be: `https://toleo.example.com/webhooks/flutterwave/randomsecret`.


#### Configuring user transaction fees

The app assumes that Flutterwave will apply transaction charges on top of the amount paid by the user (as opposed to deducting from the amount entered by the user). To achieve this behaviour, you must tell Flutterwave that the end user will bear the transaction costs. In your Flutterwave dashboard go to: **Settings** -> **Account Settings** -> **Make customers pay the transaction fees**

### Running the worker for scheduled reminders

The app can send scheduled personal reports and contribution reminders to all users. To start the work, run:
```
npm run worker
```

By default, the reminders will be sent every month (1st of every month at 10AM EAT). You can change the schedule
by setting the `MONTHLY_REMINDER_SCHEDULE` environment variable or `.env` file using [Cron syntax](https://github.com/kelektiv/node-cron#available-cron-patterns).

For example, to schedule a reminder every minute:
```
MONTHLY_REMINDER_SCHEDULE="0 * * * * *"
```

### Email and SMS

By default, the app uses "local" SMS and Email providers which simply log messages on the console. On production you should configure Africa's Talking for SMS and SendGrid for email.

Use the `AT_API_KEY`, `AT_USERNAME` and `AT_SENDER` env variables to integrate Africa's Talking. Then set `SMS_PROVIDER` to `at`.

Use the `SENDGRID_API_KEY` and `SENDGRID_SENDER` env variables to integrate SendGrid's API. Then set `EMAIL_PROVIDER` to `sendgrid`.


## Code architecture and organization

The server source code is located in the [src](./src) directory. Therein you will find more documentation about the code architecture, organization and its different components.
