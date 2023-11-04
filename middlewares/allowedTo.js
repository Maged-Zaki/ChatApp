const { statusText, appError } = require("../utils")

const allowedTo = (...roles) => {
    return (req, res, next) => {
        if (roles.includes(req.currentUser.role)) {
            next()
        } else {
            const error = appError.create(statusText.FAIL, "role not allowing this action", 403)
            return next(error)
        }
    }
}



module.exports = {
    allowedTo
}