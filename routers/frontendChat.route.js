const express = require("express")


// local
const controller = require("../controllers/frontendChat.controller")

const chatRouterMain = express.Router()






chatRouterMain.route('/')
    .get(controller.frontendChat)


chatRouterMain.route('/login')
    .get(controller.frontendLogin)










module.exports = chatRouterMain