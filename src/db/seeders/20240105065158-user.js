'use strict'

const { hash } = require('bcrypt')
const { User } = require('../../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const plainTextPassword = '123456'
    const hashedPassword = await hash(plainTextPassword, 10)

    await queryInterface.bulkInsert('Users', [
      {
        email: 'andi@gmail.com',
        username: 'andi12',
        name: 'andi',
        password: hashedPassword,
        mobile: '087636367',
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'agus@gmail.com',
        username: 'agus12',
        name: 'agus',
        password: hashedPassword,
        mobile: '087636327',
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'seller_magang@gmail.com',
        username: 'seller_magang12',
        name: 'seller magang',
        password: hashedPassword,
        mobile: '08762436',
        role: 'seller',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'seller_ganteng@gmail.com',
        username: 'seller_ganteng12',
        name: 'seller ganteng',
        password: hashedPassword,
        mobile: '087624362983',
        role: 'seller',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  },
}
