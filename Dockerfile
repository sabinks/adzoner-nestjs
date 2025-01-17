FROM node:18.17.0-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /var/www/nestjs

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start:dev"]