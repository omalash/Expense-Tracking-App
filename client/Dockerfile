# Client Docker configuration

# This stage installs dependencies for both development and production environments
FROM node:24.11-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# Development Stage
FROM base AS dev
EXPOSE 3000
CMD ["npm", "start"]

# Builds all the static files for Production
FROM base AS builder
ARG REACT_APP_BACKEND_ROUTE
ENV REACT_APP_BACKEND_ROUTE=$REACT_APP_BACKEND_ROUTE
RUN npm run build

# Serves the static build files on nginx
FROM nginx:alpine AS prod
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]