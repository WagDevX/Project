FROM node:20.11.0-bullseye

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

EXPOSE 4000

CMD ["npm", "run", "dev"]