FROM node:14.15.2-alpine As development

WORKDIR /app

USER root

COPY --chown=node:node package*.json ./

RUN npm install

USER node

FROM node:14.15.2-alpine As build

WORKDIR /app

USER root

ENV NODE_ENV development

COPY --chown=node:node --from=development /app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

USER root

EXPOSE 3000

ENTRYPOINT  ["npm", "run", "start:prod"]