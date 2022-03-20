# Techies Welfare Client App

This is the client-side web app of the Techies Welfare System.

## Tech Stack

The web app is primarily based on:
- [Vue.js 3](https://v3.vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/): for writing type-safe code. See also [Vue 3 Typescript Support](https://v3.vuejs.org/guide/typescript-support.html)
- [Tailwind CSS](https://tailwindcss.com/): for styling (it's like Bootstrap, but lower-level and easier to customize and compose)
- [Headless UI](https://headlessui.dev/): for creating custom components with underlying JS behaviour (like dialogs, tabs, pop-overs, etc.)
- [ViteJS](https://vitejs.dev/): local dev server and build tools

## Install instructions

- Install [Node.js 14+](https://nodejs.org/en/). You might find it more convenient to use the [nvm](https://github.com/nvm-sh/nvm) tool ([nvm-windows](https://github.com/coreybutler/nvm-windows) for Windows) to install and manage different versions of Node.js on your machine.

Install dependencies:

```
npm install
```

## Launch the dev server

```
npm run dev
```

This will launch a local server on [http://localhost:3000](http://localhost:3000) to run the web app.

By default, the web app expects the backend API to be running on port `4000`.

The server will live-reload automatically as you make changes to your frontend code.

## Building the app

```
npm run build
```

Will build the production assets and bundle and output them in the `dist` directory.

## Configuration

You can create an `.env` file and store some config variables, or set environment variables.
These variables can be used to build the app with production-specific values. For example

`VITE_API_URL` should be set to the API root endpoint, e.g.: `https://toleo-api.example.com/api`.

`VITE_BASE_URL` should be set to the base URL of the web app, e.g. : `https://toleo.example.com`.

The env variables start with `VITE_`
[so that they can be processed by the `vite` build tool](https://vitejs.dev/guide/env-and-mode.html#env-files).

## Code organization

- The [src](./src) directory contains most of the source code. Therein you'll find more docs about the code architecture and organization.
- The [public](./public) directory contains public assets like images
- The [tailwind.config.js](./tailwind.config.js) config file is use to [customize Tailwind's settings](https://tailwindcss.com/docs/configuration).