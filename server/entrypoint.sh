#!/bin/bash
sequelize db:create
sequelize db:migrate
npm install
npm run start
