const db = require('../models')
const { Restaurant, User, Category } = db
const adminService = require('../services/adminService')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const uploadImg = path => {
  return new Promise((resolve, reject) => {
    imgur.upload(path, (err, img) => {
      if (err) {
        return reject('error happened')
      }
      resolve(img)
    })
  })
}

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

  postRestaurant: async (req, res) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    const { file } = req
    let img
    if (!name) {
      req.flash('error_messages', '請輸入餐廳名稱')
      return res.redirect('back')
    }
    if (name.length > 30) {
      req.flash('error_messages', '餐廳名稱不得超過30字')
      return res.redirect('back')
    }

    try {
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        img = await uploadImg(file.path)
      }
      await Restaurant.create({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: file ? img.data.link : null,
        CategoryId: categoryId
      })
      req.flash('success_messages', '成功新增一筆餐廳')
      return res.redirect('/admin/restaurants')
    } catch (err) {
      console.log(err)
    }
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

  putRestaurant: async (req, res) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    const { file } = req
    const id = req.params.id
    let img
    if (!name) {
      req.flash('error_messages', '請輸入餐廳名稱')
      return res.redirect('back')
    }
    if (name.length > 30) {
      req.flash('error_messages', '餐廳名稱不得超過30字')
      return res.redirect('back')
    }

    try {
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        img = await uploadImg(file.path)
      }
      const restaurant = await Restaurant.findByPk(id)
      await restaurant.update({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: file ? img.data.link : restaurant.image,
        CategoryId: categoryId,
        updatedAt: new Date()
      })
      req.flash('success_messages', '成功更新餐廳資料')
      res.redirect('/admin/restaurants')
    } catch (err) {
      console.log(err)
    }
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
