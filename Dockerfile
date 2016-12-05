FROM node:6.5

WORKDIR /src
COPY ./package.json /src/package.json
RUN npm install

COPY . /src

RUN npm run build

EXPOSE 9090
CMD node index.js
