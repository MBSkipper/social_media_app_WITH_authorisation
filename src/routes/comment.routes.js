const express = require('express')
const router = express.Router()
//const upload = require('../middlewares/upload') // enables use of file upload if needed 

const {
    fetchComments,
    createComment,
    updateComment,
    deleteComment,
} = require('../controllers/comment.controllers')
    
router.get('/comments',fetchComments, )

router.post('/comments',createComment )

router.patch('/comments/:id', updateComment)

router.delete('/comments/:id',deleteComment)


module.exports = router