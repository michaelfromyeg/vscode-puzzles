# Server

This folder serves as the backend for the "Puzzles" VSCode extension, designed at providing you with a daily coding puzzle. The API is currently live on Heroku [here](https://vscode-puzzle.herokuapp.com/).

## Installation

This project uses [Fastify](https://www.fastify.io/docs/latest/Getting-Started/), a [Node.js](https://nodejs.org/en/) framework. It's implemented using [TypeScript](https://www.typescriptlang.org/), "typed JavaScript."

To get started, you'll first want to install the dependencies. I'll list the "quick-and-dirty" setup for MacOS, Linux, or WSL using Homebrew; if you're on Windows (and don't have WSL), use `chocolatey` instead.

If you haven't already, install [Homebrew](https://brew.sh/)

Run

```shellscript
brew install node nvm
# Follow the nvm installation instructions (...make sure to actually modify your .profile or .bashrc, then source it!)

nvm install 14
nvm use 14
# if you use Bash or Zsh, check out the nvm docs for some extra handy scripts to auto-switch your Node version

node -v
# v14.17.0, if everything worked!
```

and you should then have the needed dependencies! It's fairly simple to get going.

Then run

```shellscript
$ npm i
> puzzles-backend@1.0.0 postinstall
> yarn run build-ts

yarn run v1.22.10
warning puzzles-backend@1.0.0: The engine "vscode" appears to be invalid.
$ tsc
Done in 2.74s.
```

to get `node_modules/` in order. Last but not least,

```shellscript
$ npm run dev
> puzzles-backend@1.0.0 dev
> ts-node-dev src/server.ts

[INFO] 23:24:51 ts-node-dev ver. 1.1.1 (using ts-node ver. 9.1.1, typescript ver. 3.9.7)
[vscode-puzzle] Listening on port 3000.
```

and you're all good to go!

## Guide

API specification is TBD!

To deploy the application, first commit your changes, and then run `git subtree push --prefix server heroku master` from the top level directory.
