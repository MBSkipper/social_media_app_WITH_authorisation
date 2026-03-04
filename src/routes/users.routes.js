const express = require('express')
const router = express.Router()
const upload = require('../middlewares/upload') // enables use of file upload if needed 
const { isAuthenticated } = require ('../middlewares/auth.middlewares')

const {
    fetchUsers,
    signUpUser,
    signInUser,
    updateUser,
    deleteUser
} = require('../controllers/users.controllers')

router.get('/users',isAuthenticated, fetchUsers, )

router.post('/users/signup', upload.single('profilePic'), signUpUser)
router.post('/users/signin', signInUser)

router.patch('/users/:id', isAuthenticated, upload.single('profilePic'), updateUser)

router.delete('/users/:id', isAuthenticated, deleteUser)

module.exports = router


/*
NOTES TO CODE
Note - the code router.use(isAuthenticated) - enables router to apply isAuthenticated to all routes.  However because two routes: signUp and signIn, are not protected routes this approach cannot be used here.  (If this code were used it should be placed before all routes). Instead isAuthenticated must be passed into each protected route on lines 14, 19, 20

Line 14 - this is a protected route so isAuthenticated must be passed in here enabling only registered logged in users to get a list of all users
Line 16 - this route enables a user to be created.  The code upload.single('profilePic') enables the form field name profilePic (see users.models.js) to hold the uploaded file.

Lines 19 & 21 - these are protected routes enabling only registered logged in users to update or delete
 */