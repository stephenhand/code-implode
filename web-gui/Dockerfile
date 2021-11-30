# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build
# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx

FROM nginx
WORKDIR /app
COPY --from=build-stage /app/build/ /usr/share/nginx/html/
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf