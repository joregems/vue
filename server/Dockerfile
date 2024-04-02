FROM node:21.6-slim
WORKDIR /usr/src/app
COPY ./ ./
RUN apt-get update&&apt-get update -y\
&&npm config delete proxy\
&&npm config delete http-proxy\
&&npm config delete https-proxy\
&&npm update -g npm\
&&npm install\
&&npm install -g --no-save sequelize-cli
