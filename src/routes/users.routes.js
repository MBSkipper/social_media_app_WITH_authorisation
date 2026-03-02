const express = require('express')
const router = express.Router()
const upload = require('../middlewares/upload') // enables use of file upload if needed 

const {
    fetchUsers,
    signUpUser,
    signInUser,
    updateUser,
    deleteUser
} = require('../controllers/users.controllers')

router.get('/users',fetchUsers, )

router.post('/users/signup', upload.single('profilePic'), signUpUser)
router.post('/users/signin', signInUser)

router.patch('/users/:id', upload.single('profilePic'), updateUser)

router.delete('/users/:id', deleteUser)

module.exports = router


/*
NOTES TO CODE

Line 14 - this route enables a user to be created.  The code upload.single('profilePic') enables the form field name profilePic (see users.models.js) to hold the uploaded file.
 */