'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Restaurants', 'viewCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Restaurants', 'viewCount')
  }
}
