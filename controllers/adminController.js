const db = require('../models')
const { Restaurant, User, Category } = db
const adminService = require('../services/adminService')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },

  createRestaurant: async (req, res) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      return res.render('admin/create', { categories })
    } catch (err) {
      console.log(err)
    }
  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      res.redirect('/admin/restaurants')
    })
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },

  editRestaurant: async (req, res) => {
    try {
      const [categories, restaurant] = await Promise.all([
        Category.findAll({ raw: true, nest: true }),
        Restaurant.findByPk(req.params.id)
      ])
      return res.render('admin/create', {
        categories: categories,
        restaurant: restaurant.toJSON()
      })
    } catch (err) {
      console.log(err)
    }
  },

  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data.status === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        raw: true,
        nest: true,
        order: [['updatedAt', 'DESC']]
      })
      return res.render('admin/users', { users: users })
    } catch (err) {
      console.log(err)
    }
  },
  toggleAdmin: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id)
      // const adminId = helpers.getUser(req).id
      // if (adminId === user.id) {
      //   return res.redirect('/admin/users')
      // }
      await user.update({ updatedAt: new Date(), isAdmin: user.isAdmin ? 0 : 1 })
      req.flash('success_messages', `${user.name}的權限已成功更新`)
      res.redirect('/admin/users')
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = adminController
