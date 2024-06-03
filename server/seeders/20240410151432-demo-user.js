'use strict';
const { hashPassword } = require('../utils/encript');
const {v4:uuidv4} = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const static_password = "asasdasd1a!sdasdad!qQ"
    const hash = await hashPassword(static_password);
    await queryInterface.bulkInsert('User', [{
      uuid: "70adac85-307b-40bc-919f-fe13af763030",
      name: 'UserAdmin Example',
      password: hash,
      email: "example@admin.com",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    await queryInterface.bulkInsert('ShoppingCart', [{
      uuid: uuidv4(),
      name: 'Shopping cart\'s UserAdmin',
      description: "This is a Shopping cart",
      userId:1,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
