'use strict';
const { hashPassword } = require('../utils/encript');
const {v4:uuidv4} = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hash = await hashPassword("asasdasd1a!sdasdad!qQ");
    await queryInterface.bulkInsert('User', [{
      uuid: "70adac85-307b-40bc-919f-fe13af763030",
      name: 'UserAdminExampliniano',
      password: hash,
      email: "example@admin.com",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    await queryInterface.bulkInsert('ShoppingCart', [{
      uuid: uuidv4(),
      name: 'Carrito de Adminiano',
      description: "Ejte es el carrito de admin adminiano",
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
