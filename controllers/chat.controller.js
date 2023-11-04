
const path = require("path")

// local
const { asyncWrapper } = require("../middlewares/asyncWrapper")
const {statusText, appError} = require("../utils/") 

// models
const {User, UserProfile} = require("../models/users.model")
const {Message} = require("../models/messages.model")



const allMessages = asyncWrapper(async (req, res, next) => {
    // pagination
    let limit = req.query.limit || 20
    let page = req.query.page || 1
    let skip = (page - 1) * limit


    const messages = await Message.find({}, {__v: false}).sort("-date").skip(skip).limit(limit)
    

    return res.status(200).json({
        status: statusText.SUCCESS,
        message: "all messages found",
        statusCode: 200,
        user: {
            name: `${req.currentUser.firstName} ${req.currentUser.lastName}`,
            userId: req.currentUser.userId
        },
        data: messages
    })
})

const sendMessage = asyncWrapper(async (req, res, next) => {
    const {message} = req.body
    const currentUser = req.currentUser

    const newMessage = new Message({
        user_id: currentUser.userId,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        message_content: message,
        date: new Date()
    }) 
    await newMessage.save()

    return res.status(201).json({
        status: statusText.SUCCESS,
        message: "message saved successfully",
        user: {
            name: `${currentUser.firstName} ${currentUser.lastName}`,
            userId: req.currentUser.userId
        },
        statusCode: 201,
        data: newMessage
    })
})

const deleteMessage = asyncWrapper(async (req, res, next) => {
    const dbMessage = await Message.findOne({_id: req.params.messageId})
    if(!dbMessage) {
        const error = appError.create(statusText.FAIL, "No message available", 400)
        return next(error)
    }
    // handle delete requests from unauthorised users and if is admin continue otherwise ensure  requester is the owner of the message
    if (req.currentUser.role !== "ADMIN") {
        if (dbMessage.user_id.toString() !== req.currentUser.userId) {
            const error = appError.create(statusText.FAIL, "Unauthorized", 401)
            return next(error)
        }
    }

    // update and save 
    dbMessage.deleted = true
    await dbMessage.save()

    return res.status(200).json({
        status: statusText.SUCCESS,
        message: "Message deleted",
        data: dbMessage
    })
})









module.exports = {
    sendMessage,
    deleteMessage,
    allMessages
}