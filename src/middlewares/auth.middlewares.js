const jwt = require('jsonwebtoken')
const Post = require('../models/post.models')
const Comment = require('../models/comment.models')

//Authentication middleware
const isAuthenticated = (req, res, next ) => {
    try {
        const { token } = req.headers
        const {_id } = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req._id = _id

        next()     
    } catch(error) {
        return res.status(401).send('Authentication failed. Please login first')
    }
}

//Authorization middlewares 
const isProfileOwner = (req, res, next) => {
    const currentUserId = req._id

    if(currentUserId != req.params.id) {
    return res.status(403).send('Authorisation failed. You do not own this profile.')
    }
    next()
}

const isPostAuthor = async(req, res, next) => {
    try {
        const currentUserId = req._id
        const postId = req.params.id

        const post = await Post.findById(postId)
        if(!post) {
            return res.status(400).send('Post does not exist')
        }

        if(currentUserId != post.author) {
            return res.status(403).send('Authorisation failed. You do not own this post.')
        }
        next()
    } catch (error) {
        return res.status(500).send('Something went wrong')
    }
}

const isCommentAuthor = async(req, res, next) => {
    try {
        const currentUserId = req._id
        const commentId = req.params.id

        const comment = await Comment.findById(commentId)
        if(!comment) {
            return res.status(400).send('Comment does not exist')
        }

        if(currentUserId != comment.author) {
            return res.status(403).send('Authorisation failed. You do not own this comment.')
        }
        next()
    } catch (error) {
        return res.status(500).send('Something went wrong')
    }
}

const isCommentOrPostAuthor = async(req, res, next) => {
    try {
        const currentUserId = req._id
        const commentId = req.params.id

        const comment = await Comment.findById(commentId).populate('post')
        if(!comment) {
            return res.status(400).send('Comment does not exist')
        }

        if(currentUserId == comment.author || currentUserId == comment.post.author) {
            next()
        } else {
            return res.status(403).send('Authorisation failed. You do not own this comment or the owner of this post.')
        }
    } catch (error) {
        return res.status(500).send('Something went wrong')
    }
}

module.exports = {
    isAuthenticated,
    isProfileOwner,
    isPostAuthor,
    isCommentAuthor,
    isCommentOrPostAuthor
}



/*
NOTES TO CODE
Line 1 - import jsonwebtoken
Line 6 - destructures token from req.headers
Line 7 - destructure {_id} from the complete object to only collect the id information 
Line 8 - append the _id to the req request to get the _id
Lines 17 - 24 Authorization middleware - for checking whether user can update/ delete.  Checks whether the request id != params id if they don't match the response error status (403) - forbidden- is sent.  If they do match then user may proceed ie next() enables this
Lines 36 - 39 exports the modules isAuthenticated, isCurrentUser & isPostAuthor

*/