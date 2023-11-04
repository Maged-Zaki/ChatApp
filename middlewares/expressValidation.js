const {body} = require("express-validator")



const passwordValidator = [
    body("password").isLength({min: 8}).withMessage("password must be at least 8 characters")
]








module.exports = {
    passwordValidator
}