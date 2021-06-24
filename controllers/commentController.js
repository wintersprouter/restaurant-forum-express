const db = require('../models')
const Comment = db.Comment
const helpers = require('../_helpers')

const commentController = {
  postComment: async (req, res) => {
    const { text, restaurantId } = req.body
    if (!text) {
      req.flash('error_messages', '請填寫評論內容！')
      return res.redirect('back')
    }
    if (text.length > 150) {
      req.flash('error_messages', '評論字數不可超過150字')
      return res.redirect('back')
    }
    try {
      await Comment.create({
        text,
        RestaurantId: restaurantId,
        UserId: helpers.getUser(req).id
      })
      req.flash('success_messages', '新增評論成功！')
      res.redirect(`/restaurants/${restaurantId}`)
    } catch (err) {
      console.log(err)
    }
  },
  deleteComment: async (req, res) => {
    const id = req.params.id
    try {
      const comment = await Comment.findByPk(id)
      comment.destroy()
      req.flash('success_messages', '評論刪除成功')
      res.redirect(`/restaurants/${comment.RestaurantId}`)
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = commentController
