const JWT = require("jsonwebtoken")


// local
const appError = require("../utils/appError")
const {statusText} = require("../utils/statusText")
const cookie = require("cookie")




const frontendVerifyToken = (cookieString) => {
    if (!cookieString) return false


    let {access_token} = cookie.parse(cookieString)
    

    // validate token and return false in case cookie not found or invalid
    if (!access_token) return false
    
    try {
        JWT.verify(access_token, process.env.SECRET_KEY)
        return true
    } catch (error) {
        return false
    }


    // try {
    //     const decodedToken = JWT.verify(token, process.env.SECRET_KEY)
    //     // after verification add user info to the request
    //     req.currentUser = decodedToken
        
    //     return next()
    // } catch(error) {
    //     const tokenError = appError.create(statusText.FAIL, "Invalid or expired JWT", 403)
    //     return next(tokenError)
    // }
}


module.exports = {
    frontendVerifyToken
}