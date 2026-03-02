const Post = require('../models/post.models')
const User = require('../models/users.models') 

const fetchPosts = async (req, res) => {
    try {
        const { author } = req.query
        const post = await Post.find( { author }).populate('author', 'username fullName').populate('likes', 'username fullName')

        res.json({
            status: 'SUCCESS',
            data: post
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

const createPost = async (req, res) => {
    try {
        const { author, content } = req.body

        const user = await User.findById(author) 
        if(!user) {
            return res.status(400).json({
            status: "FAILED",
            message: 'Author not found'
            })
        } 

        await Post.create({
            author,
            content
        })

        res.json({
            status: 'SUCCESS',
            message: 'Post created successfully!'
        })
    
    } catch(error) {
        console.error(error);
        res.status(500).json({
            status: "FAILED, something went wrong",
            error: error.message
        })
    }
}


const updatePost = async (req, res) => {
    try {
        /**/
         console.log("params:", req.params);
        console.log("body:", req.body);
        console.log("query:", req.query);
         /**/

        const { id } = req.params
        const { content } = req.body
        /** */
        const updated = await Post.findByIdAndUpdate( 
            id, 
            { content }, 
            { new: true, runValidators: true } /** */
        )

        if (!updated) {
        return res.status(404).json({ status: "FAILED", error: "Post not found" });
    }

        res.json({
            status:'SUCCESS',
            message: 'Post updated successfully!'
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "FAILED",
            error: error.message
        })
    }
}

const deletePost = async (req, res) => {
    try{
        const { id } = req.params
        await Post.findByIdAndDelete(id)
        res.json({
            status: 'SUCCESS',
            message: 'Post deleted successfully!'
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "FAILED",
            error: error.message
        })
    }
}

const togglePostLike = async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.body

        const post = await Post.findById(id)
        if(!post) {
            return res.status(400).json({
            status: "FAILED",
            message: 'Post not found'
            })
        } 

        const alreadyLiked = post.likes.some(id => id.toString() == userId)
        if(alreadyLiked) {
            post.likes = post.likes.filter(id => id.toString() != userId)

        } else {
            post.likes.push(userId)
         }   
            
        await post.save()
        

        res.json({
            status: 'SUCCESS',
            message: `Post ${alreadyLiked ? 'unliked' : 'liked' } successfully!`
        })
    
    } catch(error) {
        console.error(error);
        res.status(500).json({
            status: "FAILED, something went wrong",
            error: error.message
        })
    }
}


module.exports = {
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    togglePostLike
}

/**
 NOTES TO CODE
 Line 7 - const post = await Post.find( { author }).populate('author', 'username fullName'), this element - .populate('author', 'username fullName') populates the GET post with the author's username and fullName when the author's posts are searched in Postman
 */