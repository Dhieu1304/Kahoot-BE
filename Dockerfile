
FROM node:16.13.1-alpine3.14

RUN mkdir -p /usr/src/kahoot-be

WORKDIR /usr/src/kahoot-be

COPY ["package.json", "package-lock.json", ".env", "./"]

RUN npm install

USER node

COPY . .

EXPOSE 3043

CMD npm run start:dev
