const db = require('../models')
const { Restaurant, Category } = db

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category],
      order: [['updatedAt', 'DESC']]
    }).then(restaurants => {
      callback({ restaurants: restaurants })
    })
  },
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(
      req.params.id,
      { include: [Category] }).then(restaurant => {
      return callback({ restaurant: restaurant.toJSON() })
    })
  },
  postRestaurant: (req, res, callback) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    const { file } = req

    if (!name) {
      return callback({ status: 'error', message: '請輸入餐廳名稱' })
    }
    if (name.length > 30) {
      return callback({ status: 'error', message: '餐廳名稱不得超過30字' })
    }
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: file ? img.data.link : null,
          CategoryId: categoryId
        }).then((restaurant) => {
          callback({ status: 'success', message: 'restaurant was successfully created' })
        })
      })
    } else {
      return Restaurant.create({
        name,
        tel,
        address,
        opening_hours,
        description,
        CategoryId: categoryId
      })
        .then((restaurant) => {
          callback({ status: 'success', message: 'restaurant was successfully created' })
        })
    }
  },
  putRestaurant: (req, res, callback)=> {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    const { file } = req
    const id = req.params.id
    if (!name) {
      return callback({ status: 'error', message: '請輸入餐廳名稱' })
    }
    if (name.length > 30) {
      return callback({ status: 'error', message: '餐廳名稱不得超過30字' })
    }
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(id)
        .then(restaurant=>{
          restaurant.update({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: file ? img.data.link : restaurant.image,
          CategoryId: categoryId,
          updatedAt: new Date()
        }).then((restaurant) => {
          callback({ status: 'success', message: 'restaurant was successfully update' })
        })
        })
        
      })
} else {
      return Restaurant.findByPk(id)
        .then((restaurant) => {
          restaurant.update({
            name,
            tel,
            address,
            opening_hours,
            description,
            image: restaurant.image,
            CategoryId:categoryId
          }).then((restaurant) => {
            callback({ status: 'success', message: 'restaurant was successfully to update' })
          })
        })
    }
  },
  deleteRestaurant: (req, res, callback) => {
    const id = req.params.id
    return Restaurant.findByPk(id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            callback({ status: 'success', message: '' })
          })
      })
  }
}

module.exports = adminService
