## Techies Welfare Server

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

### Rebuilding during development

Currently, the server is not set-up to auto-rebuild when code changes occur. So when you want to test your changes, you'll need to manually terminate the server and rebuild and re-run it: `npm run build && npm run start`

### Configuration

The server uses a bunch of config variables which are retrieved from environment variables. These includes things like server port, MongoDB address, API Keys, web app base URL, etc.

You can override the defaults by creating a `.env` file in the `server` root directory and populating the file with the relevant variable-value pairs. Check out the [`env.example`](./env.example) file to see a sample of what the file is supposed to look like.

To learn more about all the different available config options, check the [src/core/config.ts](./src/core/config.ts) source file.

If you update your `.env` file, you need to re-run the server for the changes to take effect.

## Code architecture and organization

The server source code is located in the [src](./src) directory. Therein you will find more documentation about the code architecture, organization and its different components.
