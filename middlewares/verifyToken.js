const JWT = require("jsonwebtoken")


// local
const {statusText, appError} = require("../utils")




const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token
    
    if (!token) {
        const error = appError.create(statusText.FAIL, "Not cookie found", 401)
        return next(error)
    }

    try {
        const decodedToken = JWT.verify(token, process.env.SECRET_KEY)
        // after verification add user info to the request
        req.currentUser = decodedToken
        
        return next()
    } catch(error) {
        const tokenError = appError.create(statusText.FAIL, "Invalid or expired JWT", 403)
        return next(tokenError)
    }
}

module.exports = {
    verifyToken
}