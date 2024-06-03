'use strict';
const {v4:uuidv4} = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Product', 
    [{
      uuid: uuidv4(),
      name: 'product 1',
      description: "this is a product",
      sku: "1",
      categoryId: "not implemented",
      price: 800,
      coverImage: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      uuid: uuidv4(),
      name: 'product 2',
      description: "this is a product",
      sku: "2",
      categoryId: "not implemented",
      price: 800,
      coverImage: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      uuid: uuidv4(),
      name: 'product 3',
      description: "this is a product",
      sku: "3",
      categoryId: "not implemented",
      price: 800,
      coverImage: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      uuid: uuidv4(),
      name: 'product 4',
      description: "this is a product",
      sku: "4",
      categoryId: "not implemented",
      price: 800,
      coverImage: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      uuid: uuidv4(),
      name: 'product 5',
      description: "this is a product",
      sku: "5",
      categoryId: "not implemented",
      price: 800,
      coverImage: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      uuid: uuidv4(),
      name: 'product 6',
      description: "this is a product",
      sku: "6",
      categoryId: "not implemented",
      price: 800,
      coverImage: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      uuid: uuidv4(),
      name: 'product 7',
      description: "this is a product",
      sku: "7",
      categoryId: "not implemented",
      price: 800,
      coverImage: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg",
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
