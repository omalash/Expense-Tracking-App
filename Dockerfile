# Server Docker configuration

FROM node:24.11.1-alpine AS base
WORKDIR /usr/src/app
EXPOSE 3500

COPY package*.json ./
RUN npm install
COPY . .

# Development Environment
FROM base AS dev
CMD ["npm", "run", "dev"]

# Production Environment
FROM base AS prod
RUN npm install --omit=dev && npm cache clean --force
CMD ["node", "server.js"]