const mongoose = require('mongoose')

const userSchema = mongoose.Schema ({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'This username already exists'],
        minLength: [3,'At least 3 characters required'],
        maxLength: [15, 'No more than 15 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Another user has this email'],
    },
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
    },
    bio: {
        type: String,
        minLength: [20,'At least 20 characters required'],
    },
    profilePic: {
        type: String
    }
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)

module.exports = User


/*
NOTES TO CODE
Overview - this code defines what a user looks like, it creates a model and then exports it

Line 1 - Imports mongoose and loads the Mongoose library so that mongoose.Schema and mongoose.model and database functions can be used
Line 3 - creates User Schema and defines the structure and rules for User documents
Lines 4 - 10 validation route for username details below
Line 5 - check username is a string
Line 6 - checks that some data has been entered (otherwise record will not be created) and the error message 'Username is required' will be returned 
Line 7 - check that the username is unique otherwise return the error message 'This username already exists'.  Note this ensures there are no duplicates at database level but it is not strictly validation
Line 8 - check the minimum no of characters is 3 otherwise return the error message 'At least 3 characters required'
Line 9 - check the maximum no of characters is 15 otherwise return the error message 'No more than 15 characters'

Lines 11-15 validation route for email
Line 13 - checks that some data has been entered (otherwise record will not be created) and the error message 'Email is required' will be returned 
Line 14 - checks that the email is unique otherwise return the error message 'Another user has this email'
Lines 16-19 validation route for fullName 

Lines 20-23 validation route for bio note that this is not a required field
Lines 24-26 validation route for profile pic note that this is not a required field
Lines 27-29 {timestamps:true} is added as a second argument to mongoose.Schema({...}) to provide a timestamp so that when any document is added inside the Schema then automatically two new fields are created: 1)createdAt and 2) updatedAt

Line 32 - const User = mongoose.model('User', userSchema) converts schema to a useable Model. It links to the MongoDB collection (users) and it enables DB methods to be used ie User.find(), User.create(), new User() and user.save().  WITHOUT THIS LINE THE SCHEMA IS USELESS!!
Line 34 - module.exports = User this exports the User model.  The code must state 'module.exports...' because this is the actual returned value when another file requires this one eg const User = require('./users.models').  
Node uses this system because it uses CommonJS module system not ES Modules by default 
so CommonJS = require()+module.exports 
whereas ES Modules = import / export

module.exports = what you put inside the box
require() = opening the box

module = Object representing the current file
module.exports = What this file exposes
require() = Retrieves module.exports

In Node every file is treated as a module and in the background it wraps every file inside a function like this (function (exports, require, module, _filename, _dirname)) { my code here...}.  This means that inside every .js file Node automatically gives you require, exports, module, _filename and _dirname. So even though module was not declared it still exists

*/ 