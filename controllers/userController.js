const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Favorite, Followship } = db
const helpers = require('../_helpers')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: async (req, res) => {
    try {
      const { passwordCheck, password, email, name } = req.body
      if (passwordCheck !== password) {
        req.flash('error_messages', '兩次密碼輸入不同！')
        return res.redirect('/signup')
      } else {
        const user = await User.findOne({ where: { email } })
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
          })
          req.flash('success_messages', '成功註冊帳號！')
          return res.redirect('/signin')
        }
      }
    } catch (err) {
      console.log(err)
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  addFavorite: async (req, res) => {
    try {
      await Favorite.create({
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      })
      return res.redirect('back')
    } catch (err) {
      console.log(err)
    }
  },
  removeFavorite: async (req, res) => {
    try {
      const favorite = await Favorite.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          RestaurantId: req.params.restaurantId
        }
      })
      favorite.destroy()
      return res.redirect('back')
    } catch (err) {
      console.log(err)
    }
  },
  getTopUser: (req, res) => {
    // 撈出所有 User 與 followers 資料
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      // 整理 users 資料
      users = users.map(user => ({
        ...user.dataValues,
        // 計算追蹤者人數
        FollowerCount: user.Followers.length,
        // 判斷目前登入使用者是否已追蹤該 User 物件
        isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
      }))
      // 依追蹤者人數排序清單
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users: users })
    })
  },
  addFollowing: async (req, res) => {
    try {
      await Followship.create({
        followerId: helpers.getUser(req).id,
        followingId: req.params.userId
      })
      return res.redirect('back')
    } catch (err) {
      console.log(err)
    }
  },

  removeFollowing: async (req, res) => {
    try {
      const followship = await Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: req.params.userId
        }
      })

      followship.destroy()

      return res.redirect('back')
    } catch (err) {
      console.log(err)
    }
  }

}

module.exports = userController
