const mongoose = require('mongoose')
const validator = require("validator")


// local
const {roles} = require("../utils") 

// just to save id
const userSchema = new mongoose.Schema()

const User = mongoose.model('User', userSchema)

//user_profile schema 
const userProfileSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        minlength: 1
    },
    last_name: {
        type: String,
        required: true,
        minlength: 1
    },  
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, "must be a valid email address"] 
    },
    password: {
        type: String,
        required: true,
        minlength: 8  //not working since password that comes here is the hashed password and we dont validate the number of characters or numbers      
    },
    role: {
        type: String,
        enum: Object.values(roles),
        default: roles.USER,
    }
})

const UserProfile = mongoose.model('User_profile', userProfileSchema)


module.exports = {
    User,
    UserProfile
}