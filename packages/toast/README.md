# toast

The best place to Stack your JAM

[![Version](https://img.shields.io/npm/v/toast.svg)](https://npmjs.org/package/toast)

<!-- toc -->

- [toast](#toast)
- [Usage](#usage)
- [Commands](#commands)
  <!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g @sector/toast
$ toast COMMAND
running command...
$ toast (-v|--version|version)
@sector/toast/0.0.1 darwin-x64 node-v11.15.0
$ toast --help [COMMAND]
USAGE
  $ toast COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`toast bake`](#toast-bake)
- [`toast chai`](#toast-chai)
- [`toast help [COMMAND]`](#toast-help-command)
- [`toast incremental`](#toast-incremental)
- [`toast shake`](#toast-shake)

## `toast bake`

Bake your application

```
USAGE
  $ toast bake

DESCRIPTION
  * Don't bundle
  * Render HTML
```

_See code:
[src/commands/bake.js](https://github.com/ChristopherBiscardi/toast/blob/v0.0.1/src/commands/bake.js)_

## `toast chai`

Brew some chai and get developing.

```
USAGE
  $ toast chai

DESCRIPTION
  * watches files, does stuff
```

_See code:
[src/commands/chai.js](https://github.com/ChristopherBiscardi/toast/blob/v0.0.1/src/commands/chai.js)_

## `toast help [COMMAND]`

display help for toast

```
USAGE
  $ toast help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code:
[@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `toast incremental`

Incremental your application

```
USAGE
  $ toast incremental

DESCRIPTION
  * Don't bundle
  * Render HTML
```

_See code:
[src/commands/incremental.js](https://github.com/ChristopherBiscardi/toast/blob/v0.0.1/src/commands/incremental.js)_

## `toast shake`

The part before the bake.

```
USAGE
  $ toast shake

DESCRIPTION
  * Fetch data
  * Prepare dependencies (run snowpack)
```

_See code:
[src/commands/shake.js](https://github.com/ChristopherBiscardi/toast/blob/v0.0.1/src/commands/shake.js)_

<!-- commandsstop -->
