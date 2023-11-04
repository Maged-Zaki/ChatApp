const {statusText, appError} = require("../utils")


const asyncWrapper = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(errorCaught => {
            const error = appError.create(statusText.ERROR, errorCaught.message, 500)
            return next(error)
        })
    }
}





module.exports = {
    asyncWrapper
}