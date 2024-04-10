'use strict';
/** @type {import('sequelize-cli').Migration} */
const { get_shopping_cart_model } = require('../models/shoppingcart');
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ShoppingCart', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ...get_shopping_cart_model(Sequelize),
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ShoppingCarts');
  }
};