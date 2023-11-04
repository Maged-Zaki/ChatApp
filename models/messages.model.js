const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')



const messageSchema = new mongoose.Schema({
    user_id: {
        type: ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    message_content: {
        type: String,
        required: true,
        minlength: 1
    },
    date: {
        type: Date,
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    }
})

const Message = mongoose.model("Message", messageSchema)


module.exports = {
    Message
}