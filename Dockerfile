FROM node:6.5

WORKDIR /src
COPY ./package.json /src/package.json
RUN npm install

COPY . /src

EXPOSE 9090
CMD npm run server
