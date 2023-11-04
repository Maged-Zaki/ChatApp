const express = require('express')

// local
const controller = require("../controllers/users.controller")
const {roles} = require("../utils")

// middlewares
const {verifyToken} = require("../middlewares/verifyToken") 
const {allowedTo} = require("../middlewares/allowedTo")
const { passwordValidator } = require("../middlewares/expressValidation")

usersRouterAPI = express.Router()


usersRouterAPI.route('/users')
    .get(verifyToken, allowedTo(roles.ADMIN), controller.getAllUsers)

usersRouterAPI.route('/login')
    .post(controller.login)

usersRouterAPI.route('/logout')
    .get(controller.logout)


usersRouterAPI.route('/register')
    .post(controller.register)









module.exports = usersRouterAPI
