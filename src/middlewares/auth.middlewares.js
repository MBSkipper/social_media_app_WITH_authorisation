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

module.exports = {
    isAuthenticated
}



/*
NOTES TO CODE
Line 1 - import jsonwebtoken
Line 6 - destructures token from req.headers
Line 7 - destructure {_id} from the complete object to only collect the id information 
Line 8 - append the _id to the req request to get the _id
Lines 16 - 17 exports the module is Authenticated

*/