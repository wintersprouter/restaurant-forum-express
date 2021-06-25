const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Favorite, Followship, Restaurant, Comment, Like } = db

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const helpers = require('../_helpers')

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
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
            image: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
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
      req.flash('success_messages', '已將此餐廳加入收藏！')
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
      req.flash('success_messages', '已將此餐廳移除收藏！')
      return res.redirect('back')
    } catch (err) {
      console.log(err)
    }
  },
  getUser: async (req, res) => {
    try {
      const userId = helpers.getUser(req).id
      const id = req.params.id
      const profileUser = (await User.findOne({
        include: [
          {
            model: User,
            as: 'Followers',
            attributes: ['id', 'name', 'image']
          },
          {
            model: User,
            as: 'Followings',
            attributes: ['id', 'name', 'image']
          },
          {
            model: Restaurant,
            as: 'FavoritedRestaurants',
            attributes: ['id', 'name', 'image']
          },
          {
            model: Comment,
            include: [{
              model: Restaurant, attributes: ['id', 'name', 'image']
            }]
          }
        ],
        where: {
          id: id
        },
        attributes: ['id', 'name', 'email', 'image']
      })
      ).toJSON()

      profileUser.isFollowed = helpers.getUser(req).Followings.map(d => d.id).includes(profileUser.id)
      const commentRestaurant = []
      profileUser.Comments.forEach(comment => {
        commentRestaurant.push(comment.Restaurant)
      })

      const filteredCommentRestaurant = [...new Set(commentRestaurant.map(item => JSON.stringify(item)))].map(item => JSON.parse(item))

      return res.render('profile', {
        userId,
        profileUser,
        filteredCommentRestaurant
      })
    } catch (err) {
      console.log(err)
    }
  },
  getEditUser: async (req, res) => {
    try {
      const userId = helpers.getUser(req).id
      const userProfile = await User.findByPk(userId)
      const user = userProfile.toJSON()
      return res.render('editProfile', {
        userId,
        user
      })
    } catch (err) {
      console.log(err)
    }
  },
  putUser: async (req, res) => {
    const { name } = req.body
    const userId = helpers.getUser(req).id
    const { file } = req
    let img

    if (!name || name.length > 20) {
      req.flash('error_messages', '使用者名稱不存在')
      return res.redirect('back')
    }
    try {
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        img = await uploadImg(file.path)
      }
      const user = await User.findByPk(userId)
      await user.update({
        name,
        image: file ? img.data.link : user.image
      })
      req.flash('success_messages', '使用者簡介已更新！')
      res.redirect(`/users/${userId}`)
    } catch (err) {
      console.log(err)
    }
  },
  getTopUser: async (req, res) => {
    try {
      let users = await User.findAll({
        include: [
          { model: User, as: 'Followers' }
        ]
      })
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users: users })
    } catch (err) {
      console.log(err)
    }
  },
  addFollowing: async (req, res) => {
    try {
      await Followship.create({
        followerId: helpers.getUser(req).id,
        followingId: req.params.userId
      })
      req.flash('success_messages', '成功追蹤！')
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
      req.flash('success_messages', '已取消追蹤')
      return res.redirect('back')
    } catch (err) {
      console.log(err)
    }
  },
  addLike: async (req, res) => {
    try {
      await Like.create({
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      })
      req.flash('success_messages', 'Like！')
      res.redirect('back')
    } catch (err) {
      console.log(err)
    }
  },
  removeLike: async (req, res) => {
    try {
      const like = await Like.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          RestaurantId: req.params.restaurantId
        }
      })
      like.destroy()
      return res.redirect('back')
    } catch (err) {
      console.log(err)
    }
  }

}

module.exports = userController
