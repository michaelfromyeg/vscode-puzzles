# A Dockerfile for running only the Node app; good for local development

FROM node:16

# create app directory
WORKDIR /usr/src/app

# install app dependencies; copy package.json, package-lock.json
COPY package*.json ./

RUN npm install
# or, RUN npm ci --only=production

# bundle app source
COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
