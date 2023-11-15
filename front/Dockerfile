FROM node:20.8-slim
RUN npm install -g vite@4.4.9 npm
WORKDIR /app
RUN npm update -g npm
COPY ./package*.json ./
RUN npm install
COPY ./ ./
