FROM node:18-alpine


RUN mkdir /app
WORKDIR /app


COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

CMD ["yarn","dev"]