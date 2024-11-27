FROM node:20.11.0-bullseye

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

RUN yarn global add ts-node-dev

COPY prisma ./prisma/

COPY . .

COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh

RUN chmod +x /usr/local/bin/wait-for-it.sh

RUN npx prisma generate

RUN apt-get update && apt-get install -y bash postgresql-client

CMD ["/bin/bash", "-c", "/usr/local/bin/wait-for-it.sh -h database -p 5432 -t 30 -- npx prisma migrate dev --name init && yarn seed && npm run dev"]