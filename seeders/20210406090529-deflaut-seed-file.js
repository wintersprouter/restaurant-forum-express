'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      id: 1,
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: true,
      name: 'Alyissa',
      image: 'https://images.unsplash.com/photo-1609107078653-350a759b7f50?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'Tom',
      image: 'https://images.unsplash.com/photo-1455274111113-575d080ce8cd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 3,
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'Runa',
      image: 'https://images.unsplash.com/photo-1502323777036-f29e3972d82f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})

    await queryInterface.bulkInsert('Categories',
      ['中式料理', '日本料理', '義大利料理', '墨西哥料理', '素食料理', '美式料理', '複合式料理']
        .map((item, index) =>
          ({
            id: index * 10 + 1,
            name: item,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})

    await queryInterface.bulkInsert('Restaurants',
      Array.from({ length: 50 }).map((d, i) =>
        ({
          id: i + 1,
          name: faker.name.findName(),
          tel: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          opening_hours: '08:00',
          image: `https://loremflickr.com/320/240/restaurant,food/?lock=${Math.random() * 100}`,
          description: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date(),
          CategoryId: Math.floor(Math.random() * 7) * 10 + 1
        })
      ), {})

    await queryInterface.bulkInsert('Comments',
      [...Array(150)].map((item, index) => index).map(i =>
        ({
          id: i + 1,
          text: faker.lorem.sentence(),
          UserId: (i % 3) + 1,
          RestaurantId: i % 47 + 1,
          createdAt: new Date(new Date().getTime() - Math.floor(Math.floor(Math.random() * 600000000))),
          updatedAt: new Date(new Date().getTime() - Math.floor(Math.floor(Math.random() * 864000))),
        })
      ), {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
    await queryInterface.bulkDelete('Categories', null, {})
    await queryInterface.bulkDelete('Comments', null, {})
    await queryInterface.bulkDelete('Restaurants', null, {})
  }
}
