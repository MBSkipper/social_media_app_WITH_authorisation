const mongoose = require('mongoose')
const User = require('./users.models')
const Post = require('./post.models')

const commentSchema = mongoose.Schema ({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Post,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    content: {
        type: String,
        required: [true, 'content is required'],
        minLength: 4
    }, 
}, {
    timestamps: true
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment


/*NOTES TO CODE

Line 3 - Post model is required here so imported by const Post = require('./post.models')
Line 8 - ref: Post - means reference to Post schema
 */