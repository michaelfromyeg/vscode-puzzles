# Server

This folder serves as the backend for the "Puzzles" Visual Studio Code extension, designed at providing you with a daily coding puzzle.

~~The API is currently live on Heroku [here](https://vscode-puzzle.herokuapp.com/).~~ Due to Heroku [cancelling their free tier,](https://techcrunch.com/2022/08/25/heroku-announces-plans-to-eliminate-free-plans-blaming-fraud-and-abuse) I'm migrating the project to AWS.

## Installation

This project uses [Fastify](https://fastify.io/docs/latest/Getting-Started), a [Node.js](https://nodejs.org/en) framework. It's implemented using [TypeScript](https://typescriptlang.org), "typed JavaScript."

To get started, you'll first want to install the dependencies. I'll list the "quick-and-dirty" setup for macOS, Linux, or WSL using Homebrew; if you're on Windows (and don't have WSL), use `chocolatey` instead.

If you haven't already, install [Homebrew](https://brew.sh/)

Run

```shellscript
brew install node nvm
# Follow the nvm installation instructions (...make sure to actually modify your .profile or .bashrc, then source it!)

nvm install 16
nvm use 16
# if you use Bash or Zsh, check out the nvm docs for some extra handy scripts to auto-switch your Node version

# with the .nvmrc, you should also be able to type
nvm use

# and see
#   Found '/home/mdema/code/vscode-puzzles/server/.nvmrc' with version <v16.19.1>
#   Now using node v16.19.1 (npm v9.5.0)

node -v
# v16.19.1, if everything worked!
```

And with that, you should then have the needed dependencies! It's fairly simple to get going.

Next, run

```shellscript
$ npm i
> (...some output about vulnerabilities)

$ npm build
> puzzles-server@1.0.0 build
> tsc -p tsconfig.json

```

This gets `node_modules/` and the project files in order. Last but not least, run

```shellscript
$ npm run dev
> puzzles-server@1.0.0 dev
> ts-node-dev src/server.ts

[INFO] 18:43:15 ts-node-dev ver. 1.1.8 (using ts-node ver. 9.1.1, typescript ver. 4.9.5)
{"level":30,"time":1677926597500,"pid":18007,"hostname":"MDEMA-LAPTOP","msg":"Server listening at http://0.0.0.0:8080"}
```

You're all good to go!

## Guide

API specification is TBD!

To deploy the application, first commit your changes, ~~and then run `git subtree push --prefix server heroku master` from the top level directory~~ and then push your changes to an EC2 instance, or equivalent. See options for free deployment [here](https://github.com/ripienaar/free-for-dev).

## Deployment

These instructions are for EC2; I normally would use Heroku, but the free tier is gone. Steps below follow [this](https://medium.com/@chandupriya93/deploying-docker-containers-with-aws-ec2-instance-265038bba674) handy guide.

1. First, create an EC2 instance.
2. Then, replace the IP in `scripts/ec2.sh` and run `bash ec2.sh` to connect to your instance.
3. Run `sudo yum install -y docker` to install Docker. Then, run the following to set up Docker.

    ```shellscript
    # from: https://cloudaffaire.com/how-to-install-docker-in-aws-ec2-instance/

    # add the ec2-user to the docker group so you can execute Docker commands without using sudo.
    # exit the terminal and re-login to make the change effective
    sudo usermod -a -G docker ec2-user
    exit

    # enable docker service
    sudo systemctl enable docker

    # start docker service
    sudo systemctl start docker

    # check the Docker service
    sudo systemctl status docker

    # verify everything worked
    docker info
    ```

4. Run `docker login`.
5. Run `docker pull michaelfromyeg/puzzles`.
6. Next, run `docker run -d -p 80:8080 -p 443:8080 michaelfromyeg/puzzles`.

Next up, we have to enable HTTPS. To do so, use the following section.

1. Run `sudo yum update -y && sudo amazon-linux-extras install nginx1 -y`.
2. Then, `sudo systemctl enable nginx`.
3. Finally, run `sudo systemctl start nginx`.
