const express = require('express')
const router = express.Router()
//const upload = require('../middlewares/upload') // enables use of file upload if needed 
const { 
    isAuthenticated,
    isCommentAuthor,
    isCommentOrPostAuthor
} = require('../middlewares/auth.middlewares')

const {
    fetchComments,
    createComment,
    updateComment,
    deleteComment,
} = require('../controllers/comment.controllers')
    
router.use(isAuthenticated) //protects all routes below

router.get('/comments',fetchComments)

router.post('/comments', createComment)

router.patch('/comments/:id', isCommentAuthor, updateComment)

router.delete('/comments/:id',isCommentOrPostAuthor, deleteComment)


module.exports = router