const express = require('express')


// local
const controller = require("../controllers/chat.controller")
const {verifyToken} = require("../middlewares/verifyToken")


chatRouterAPI = express.Router()

chatRouterAPI.route('/')
    .get(verifyToken, controller.allMessages)
    .post(verifyToken, controller.sendMessage)
    
chatRouterAPI.route('/delete/:messageId')
.delete(verifyToken, controller.deleteMessage)






module.exports = chatRouterAPI
