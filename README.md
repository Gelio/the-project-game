# The Project Game

This project contains the source code of 3 components necessary to run _The Project Game_:

* Communication Server
* Game Master
* Player

Each of them resides in a separate directory inside the _src_ directory.

Even though this is a Node.js application, [ts-node](https://github.com/TypeStrong/ts-node)
is used to leverage [Typescript](https://www.typescriptlang.org/)'s type system during development.

## Requirements

* [Node.js](https://nodejs.org/en/download/) v9.5.0 or higher
* npm v5.2.0 or higher (usually installed automatically with Node.js)

## Setup

First, install all necessary dependencies:

```bash
npm install
```

### Communication Server

In `src/communication-server.config.json` set hostname and port on which the server
should be available.

Next, run:

```bash
npm run communication-server
```

The Communication Server should log to the console, that it is up and running.

### Game Master

Game Master's configuration is in `src/game-master.config.json`. Make sure the hostname
and port of the Communication Server are correct.

Next, run:

```bash
npm run game-master
```

The terminal you ran the command in should now display GM UI.

### Players

The configuration of each Player is read from the same file inside current working directory (`player.config.json`),
so make sure to edit it accordingly after starting each Player.

Listing games:

```bash
cd Player/Player
dotnet run <comm_server_addr> <comm_server_port> -l
```

Running Player:

```bash
cd Player/Player
dotnet run <comm_server_addr> <comm_server_port> <game_name> [config_file]
```

to start a single Player. The terminal you ran the command in should now display sent and received messages.

## Testing

The following command runs the tests:

```bash
npm run test
```

During development it is convenient to use the _watch_ mode:

```bash
npm run test:watch
```

It only runs test suites that correspond to changed files and is generally much faster
than running the whole test suite every time.

To generate test coverage run:

```bash
npm run test:coverage
```

This project uses [jest](https://facebook.github.io/jest/) as a testing framework.

## Linting

The following command runs the linter:

```bash
npm run lint
```

We use [the Typescript compiler](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
and [tslint](https://palantir.github.io/tslint/) for linting and error-checking.

You may want to use one of the following commands:

```bash
npm run lint:tsc
npm run lint:tslint
```

to trigger only one type of linter.

## Validating messages

Use the following command to validate messages:

```bash
npm run validate-message -- file1.json [file2.json ...]
```

## Development

[Prettier](https://github.com/prettier/prettier) is installed as a formatter. Along with tslint,
they make sure the code style is consistent.

Prettier is ran as a pre-commit hook (essentially before every commit) on staged files.
