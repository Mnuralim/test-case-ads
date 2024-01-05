'use strict'
const { User } = require('../../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const seller = await User.findAll({
      where: {
        role: 'seller',
      },
    })
    await queryInterface.bulkInsert('Products', [
      {
        title: 'Xiaomi 12',
        description: 'This is xiaomi 12',
        price: 200,
        stock: 20,
        seller_id: seller[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Samsung A52',
        description: 'This is Samasung A52',
        price: 350,
        stock: 10,
        seller_id: seller[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Iphone 12',
        description: 'This is Iphone 12',
        price: 750,
        stock: 30,
        seller_id: seller[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Iphone 13',
        description: 'This is Iphone 13',
        price: 800,
        stock: 20,
        seller_id: seller[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Products', null, {})
  },
}
