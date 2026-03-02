const express = require('express')
const router = express.Router()
//const upload = require('../middlewares/upload') // enables use of file upload if needed 

const {
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    togglePostLike
} = require('../controllers/post.controllers')

router.get('/posts',fetchPosts, )

router.post('/posts', createPost)

router.patch('/posts/:id', updatePost)

router.delete('/posts/:id', deletePost)

router.post('/posts/:id/like-toggle', togglePostLike)

module.exports = router
