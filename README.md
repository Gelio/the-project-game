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

To get info on command line arguments, run:

```bash
npm run communication-server -- -h
```

### Game Master

Game Master's configuration is in `src/game-master.config.json`. Make sure the hostname
and port of the Communication Server are correct.

Next, run:

```bash
npm run game-master
```

The terminal you ran the command in should now display GM UI.

To get info on command line arguments, run:

```bash
npm run game-master -- -h
```

### Player

Players' configurations are stored in `*.config.json` files in `Player/Player/`.

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

to start a single Player. The terminal you ran the command in should now display the logs.

## Testing

### Communication Server & Game Master (Typescript)

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

### Player (C#)

The test project uses the [`NUnit`](http://nunit.org/) and [`Moq`](https://github.com/moq/moq4) frameworks.
Below, there are presented 2 ways to run the tests:

#### Using Visual Studio Code

Open the Command Pallette (`Ctrl+Shift+P`) and pick the option: `Tasks: Run Test Task`.
You will be provided with 2 choices:

* test Player
* test Player with coverage

The [`coverlet`](https://github.com/tonerdo/coverlet) NuGet package added to `Player.Tests` project
generates coverage info file (`lcov.info`) which can be later processed by various visualizers.
In fact a recommended _Workspace Extension_ [`Coverage Gutters`](https://github.com/ryanluker/vscode-coverage-gutters)
does the exact thing inside Visual Studio Code editor window.

The other way to test the project is to use the recommended
[`.NET Core Test Explorer`](https://github.com/formulahendry/vscode-dotnet-test-explorer) extension by clicking
on a flask icon on the left side of the window (_Activity Bar_) and starting the tests with a _play_-shaped button.

#### Using CLI

To run tests normally:

```bash
dotnet test Player/Player.Tests.csproj
```

To generate coverage info:

```bash
dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=lcov /p:CoverletOutput=./lcov Player/Player.Tests.csproj
```

#### Generating report

Using [ReportGenerator](https://danielpalme.github.io/ReportGenerator/) you can create interactive HTML report.
With info about usage available [here](https://github.com/danielpalme/ReportGenerator/blob/b1538b25a48a771ded4f3461259d5a562f8029a1/README.md),
in section _Available Packages_, pick the appropriate tool, according to your .NET version.

The report included in this repository was created using [dotnet-reportgenerator-globaltool](https://www.nuget.org/packages/dotnet-reportgenerator-globaltool)
for .NET Core 2.1. First, it was installed using:

```bash
dotnet tool install -g dotnet-reportgenerator-globaltool --version 4.0.0-alpha10
```

and then called inside `Player/Player.Tests/` directory:

```bash
reportgenerator -reports:player.opencover.xml -targetdir:report
```

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
