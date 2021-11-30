FROM node:16.13.0
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app/
RUN npx tsc

CMD [ "node", "dist/index.js" ]