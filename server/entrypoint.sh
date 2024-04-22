#!/bin/bash
npm install
sleep 5
sequelize db:create
sleep 5
sequelize db:migrate
sequelize db:seed:all
npm run start
