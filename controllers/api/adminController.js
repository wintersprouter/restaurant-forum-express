const db = require('../../models')
const { Restaurant, Category } = db

const adminController = {
  getRestaurants: async (req, res) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category],
        order: [['updatedAt', 'DESC']]
      })
      return res.json({ restaurants })
    } catch (err) {
      console.log(err)
    }
  }
}
module.exports = adminController
