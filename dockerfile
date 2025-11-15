FROM node:lts-alpine AS builder
WORKDIR /var/bot

COPY package*.json ./
RUN npm install

COPY . .

RUN npm build

# RUNNER
FROM node:lts-alpine AS runner
WORKDIR /var/bot

COPY package*.json ./
ARG NODE_ENV=production
RUN npm install

COPY --from=builder /var/bot/prod/ ./

RUN adduser -S bot
USER bot

ENTRYPOINT [ "npm", "start" ]