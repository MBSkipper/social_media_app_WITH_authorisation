const jwt = require('jsonwebtoken')

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

//Authorization middleware 
const isProfileOwner = (req, res, next) => {
    if(req._id != req.params.id) {
    return res.status(403).send('Authorisation failed. You are not permitted to perform this operation.')
    }
    next()
}


module.exports = {
    isAuthenticated,
    isProfileOwner
}



/*
NOTES TO CODE
Line 1 - import jsonwebtoken
Line 6 - destructures token from req.headers
Line 7 - destructure {_id} from the complete object to only collect the id information 
Line 8 - append the _id to the req request to get the _id
Lines 17 - 27 Authorization middleware - for checking whether user can update/ delete.  Checks whether the request id != params id if they don't match the response error status (403) - forbidden- is sent.  If they do match then user may proceed ie next() enables this
Lines 29 - 31 exports the modules isAuthenticated and isCurrentUser

*/