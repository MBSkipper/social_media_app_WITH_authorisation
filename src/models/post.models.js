const mongoose = require('mongoose')
const User = require('./users.models')

const postSchema = mongoose.Schema ({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    content: {
        type: String,
        required: [true, 'content is required'],
        minLength: 20
    },
    likes: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
        } ]
}, {
    timestamps: true
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post

/*
DESIGN REQUIRED
Post - many:1 relationship ie one user multiple posts
        - author (ObjectId ref - > refers to User model)
        - content (String)
        - postPic (String)
        - likes (Array[ObjectId ref - > User)]) - see comment sect'n below
        - timestamps (Date)

*/