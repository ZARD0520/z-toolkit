FROM node:20 as build-stage

WORKDIR /app

COPY package.json .

RUN npm config set registry https://registry.npmjs.org/

RUN npm install

COPY . .

RUN npm run build

# production stage
FROM node:20 as production-stage

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

RUN npm config set registry https://registry.npmjs.org/

RUN npm install --production

EXPOSE 3001

CMD ["node", "/app/main.js"]
