# build stage
FROM node:16.0.0-alpine as deps-stage
WORKDIR /app
RUN apk add --update --no-cache python3 make g++
COPY . .
RUN yarn install

# build stage
# FROM node:16.0.0-alpine as build-stage
# WORKDIR /app
# RUN apk add --update --no-cache python3 make g++
# COPY --from=deps-stage /app/node_modules ./node_modules
#COPY . .
COPY .env.production ./.env
#RUN npm --depth 20 update --save caniuse-lite browserslist
RUN yarn build

# production stage
#FROM node:16.13-alpine AS deploy-stage
#WORKDIR /app

#COPY --from=build-stage /app/dist ./dist
#COPY --from=build-stage /app/src ./src
#COPY --from=deps-stage /app/node_modules ./node_modules
#COPY --from=build-stage /app/package*.json ./
EXPOSE 8080
CMD ["yarn", "serve"]
