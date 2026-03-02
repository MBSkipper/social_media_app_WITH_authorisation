const Comment = require('../models/comment.models')
const Post = require('../models/post.models')
const User = require('../models/users.models') 

const fetchComments = async (req, res) => {
    try {
        const { post } = req.query
        const postComment = await Comment.find({ post }).populate('author', 'username fullName').populate('post', 'content')

        res.json({
            status: 'SUCCESS',
            data: postComment
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

const createComment = async (req, res) => {
    try {
        const { post, author, content } = req.body

        const user = await User.findById(author) 
        if(!user) {
            return res.status(400).json({
            status: "FAILED",
            message: 'Author not found'
            })
        } 

        const postToComment = await Post.findById(post)
        if(!postToComment) {
            return res.status(400).json({
            status: "FAILED",
            message: 'Post not found'
            })
        } 

        await Comment.create({
            post,
            author,
            content
        })

        res.json({
            status: 'SUCCESS',
            message: 'Comment created successfully!'
        })
    
    } catch(error) {
        console.error(error);
        res.status(500).json({
            status: "FAILED, something went wrong",
            error: error.message
        })
    }
}


const updateComment = async (req, res) => {
    try {
        const { id } = req.params
        const { content } = req.body

        await Comment.findByIdAndUpdate( id, { content })

        res.json({
            status:'SUCCESS',
            message: 'Comment updated successfully!'
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "FAILED",
            error: error.message
        })
    }
}

const deleteComment = async (req, res) => {
    try{
        const { id } = req.params
        await Comment.findByIdAndDelete(id)
        res.json({
            status: 'SUCCESS',
            message: 'Comment deleted successfully!'
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
    fetchComments,
    createComment,
    updateComment,
    deleteComment,
}

/**
 NOTES TO CODE
 
 */