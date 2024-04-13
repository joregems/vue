'use strict';
const {v4:uuidv4} = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Product', [{
      uuid: uuidv4(),
      name: 'papitas con mazamorra',
      description: "de pollo",
      sku: "1",
      categoryId: "blebleble",
      price: 800,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      uuid: uuidv4(),
      name: 'papitas con pollo y panela',
      description: "de pollo",
      sku: "2",
      categoryId: "blebleble",
      price: 800,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      uuid: uuidv4(),
      name: 'papitas a la brasa',
      description: "de pollo",
      sku: "3",
      categoryId: "blebleble",
      price: 800,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      uuid: uuidv4(),
      name: 'papitas con mermelada',
      description: "de pollo",
      sku: "4",
      categoryId: "blebleble",
      price: 800,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      uuid: uuidv4(),
      name: 'papitas con gengibre',
      description: "de pollo",
      sku: "5",
      categoryId: "blebleble",
      price: 800,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      uuid: uuidv4(),
      name: 'papitas con maquillaje',
      description: "de pollo",
      sku: "6",
      categoryId: "blebleble",
      price: 800,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      uuid: uuidv4(),
      name: 'papitas con mayonesa',
      description: "de pollo",
      sku: "7",
      categoryId: "blebleble",
      price: 800,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ], {});

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
