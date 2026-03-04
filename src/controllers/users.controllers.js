const User = require('../models/users.models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const fetchUsers = async (req, res) => {
    try {
        const users = await User.find().select('username fullName profilePic bio -_id') 

        users.map(user => {
            user.profilePic = process.env.BASE_URL + user.profilePic
        })

        res.json({
            status: 'SUCCESS',
            data: users
        })
    } catch(error) {
        console.error(error);
        res.status(500).json({
            message: 'Something went wrong',
            status: "FAILED",
            error: error.message
        })
    }
}

const signUpUser = async (req, res) => {
    try {
        const { username, email, password, fullName, bio } = req.body

        const encryptedPassword = await bcrypt.hash(password, 10)

        await User.create({
            username, 
            email, 
            password: encryptedPassword,
            fullName, 
            bio,
            profilePic: req.file ? `/uploads/${req.file.filename}` : undefined
        })

        res.json({
            status: 'SUCCESS',
            message: 'User registered successfully!'
        })
    } catch(error) {
        console.error(error);
        res.status(500).json({
            status: "FAILED",
            error: error.message
        })
    }
}

const signInUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if(!user) {
            return res.status(401).json ({
                status: 'FAILED',
                message: 'User with this email does not exist.  Please register first.'
            })
        }

        const passwordMatch = await bcrypt.compare(password, user.password )
        if(!passwordMatch) {
            return res.status(401).json ({
                status: 'FAILED',
                message: 'Invalid credentials'
            })
        }

        const { _id } = user
        const token = jwt.sign({ _id }, process.env.JWT_SECRET_KEY, { expiresIn: 24*60*60 })

        res.json({
            status: 'SUCCESS',
            message: 'User logged in successfully!',
            token
        })
    } catch(error) {
        console.error(error);
        res.status(500).json({
            status: "FAILED",
            error: error.message
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const { fullName, bio } = req.body

        await User.findByIdAndUpdate( id, { fullName,bio })

        res.json({
            status:'SUCCESS',
            message: 'User updated successfully!'
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "FAILED",
            error: error.message
        })
    }
}

const deleteUser = async (req, res) => {
    try{
        const { id } = req.params
        await User.findByIdAndDelete(id)
        res.json({
            status: 'SUCCESS',
            message: 'User deleted successfully!'
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "FAILED",
            error: error.message
        })
    }
}


module.exports = {
    fetchUsers,
    signUpUser,
    signInUser,
    updateUser,
    deleteUser
}

/*
NOTES TO CODE

Line 7 - The code:  .select('username fullName profilePic bio') this is a mongoose method that enables only the non sensitive parts of the user details to be displayed ie it excludes email and password, when GET method for the all users API returns data it excludes email and password because only the selected fields are listed.  To remove the id automatically created by the server -_id (minus _id) removes it

 Line 9-10  - attaches base url to the uploaded image ie profilePic.  Full url appears in database data NOTE it is not clickable to click thru to the uploaded image. 
 
 Line 34 - profilePic: req.file ? `/uploads/${req.file.filename}` : undefined - this makes upload of profile pic optional so that if no file is uploaded the server does not crash

 Line 55 - user can only update fullName and bio, the rest of the document cannot be updated

 Line 58 - the findOne method in mongoose is neater here 

 Line 66 - const passwordMatch = await bcrypt.compare(password, user.password - user.password is teh encrypted password.  Compare is a method of bcrypt - refer to bcrypt documentation

 Line 75 - deconstruct to get id from user

 Line 76 - const token = jwt.sign({ _id }, process.env.JWT_SECRET_KEY), { expiresIn: 24*60*60 } - this uses jsonwebtoken and method sign ie jwt.sign, a SECRET KEY has been created in the .env file and the option expiresIn created in seconds for one day hence 24*60*60.  It is assigned to the constant as the token.

 Line 81 - the token is also returned in the client response
 
 */