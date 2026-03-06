const express = require('express')
const router = express.Router()
const upload = require('../middlewares/upload') // enables use of file upload if needed 
const { 
    isAuthenticated, 
    isPostAuthor
} = require('../middlewares/auth.middlewares')

const {
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    togglePostLike
} = require('../controllers/post.controllers')

router.use(isAuthenticated) //protects all routes below

router.get('/posts',fetchPosts, )

router.post('/posts', createPost)

router.patch('/posts/:id', isPostAuthor, updatePost)

router.delete('/posts/:id', isPostAuthor, deletePost)

router.post('/posts/:id/like-toggle', togglePostLike)

module.exports = router
