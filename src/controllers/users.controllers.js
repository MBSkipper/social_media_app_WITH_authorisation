const Post = require('../models/post.models')
const User = require('../models/users.models')

const fetchUsers = async (req, res) => {
    try {
        const users = await User.find() 

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

const createUser = async (req, res) => {
    try {
        const { username, email, fullName, bio } = req.body

        await User.create({
            username, 
            email, 
            fullName, 
            bio,
            profilePic: req.file ? `/uploads/${req.file.filename}` : undefined
        })

        res.json({
            status: 'SUCCESS',
            message: 'User created successfully!'
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
    createUser,
    updateUser,
    deleteUser
}

/*
NOTES TO CODE

 Line 7-8 - attaches base url to the uploaded image ie profilePic.  Full url appears in database data NOTE it is not clickable to click thru to the uploaded image
 
 Line 34 - profilePic: req.file ? `/uploads/${req.file.filename}` : undefined - this makes upload of profile pic optional so that if no file is uploaded the server does not crash

 Line 55 - user can only update fullName and bio, the rest of the document cannot be updated
 
 */