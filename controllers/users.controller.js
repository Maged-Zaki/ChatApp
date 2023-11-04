const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const path = require("path")
// local
const {statusText, appError, generate} = require("../utils") 
const {asyncWrapper} = require("../middlewares/asyncWrapper")

// models
const {User, UserProfile} = require("../models/users.model")




const getAllUsers = asyncWrapper(async (req, res, next) => {
    const allUsers = await UserProfile.find({}, {__v: false})
    return res.status(200).json({
        status: statusText.SUCCESS,
        message: "all available users found",
        data: allUsers
    })
})



const login = async (req, res, next)  => {
    const {email, password} = req.body

    if(!email || !password) {
        const error = appError.create(statusText.FAIL, "email and password are required", 400)
        return next(error)
    }

    // check if user exists
    const user = await UserProfile.findOne({email: email})
    
    if(!user) {
        const error = appError.create(statusText.FAIL, "Invalid email", 400)
        return next(error)
    }
    // validate user password
    const passwordCorrect = await bcrypt.compare(password, user.password)

    if(!passwordCorrect) {
        const error = appError.create(statusText.FAIL, "Invalid password", 400)
        return next(error)
    }

    // generate JWT
    const token =  generate({
        userId: user._id,
        firstName: user.first_name,
        lastName: user.last_name,
        email,
        role: user.role
    })

    return res.cookie("access_token", token, {maxAge: 3600000, httpOnly: true}).status(200).json(
        {
            status: statusText.SUCCESS,
            message: "logged in successfully",
            data: {
                token
            }
        }
    )
}

const logout = asyncWrapper(async (req, res, next) => {
    res.clearCookie("access_token")
    
    return res.status(200).json({
        status: statusText.SUCCESS,
        message: "logged out successfully",
        statusCode: 200
    })
})


const register = asyncWrapper(async (req, res, next)  => {
    // destruct from the req body
    const {firstName, lastName, email, password, role} = req.body
    

    if (password.length < 8) {
        const error = appError.create(statusText.FAIL, "password must be atleast 8 characters   ", 400)
        return next(error)
    }

    // check if email already exists in DB
    const user = await UserProfile.findOne({email: email})
    
    if(user) {
        const error = appError.create(statusText.FAIL, "user with that email already exists", 400)
        return next(error)
    }

    
    // hash the password with a salt
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    // generate id from User model
    const newUser = new User()
    
    

    // create user profile and validate data
    const userProfile = new UserProfile({
        _id: newUser._id,
        first_name: firstName,
        last_name: lastName,
        email,
        password: hashedPassword,
        role: role ? role.toUpperCase() : "USER"
    })

    // save user and user_profile
    await newUser.save()
    await userProfile.save()

    // generate token and pass payload as an argument
    const token = generate({
        userId: newUser._id,
        firstName,
        lastName,
        email,
        role: userProfile.role
    })
                                            // maxAge is two minues 
    return res.cookie("access_token", token, {maxAge: 3600000, httpOnly: true}).status(201).json({
        status: statusText.SUCCESS,
        message: "Registered successfully",
        data: {
            firstName,
            lastName,
            email,
            role,
            token,
        }
    })
})




module.exports = {
    getAllUsers,
    login,
    register,
    logout
}