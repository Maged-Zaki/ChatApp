const http = require("http");
const express = require("express")
const mongoose  = require("mongoose")
const { Server } = require("socket.io")
const path = require("path")
const cookieParser = require("cookie-parser")
require("dotenv").config()

// local
const {usersRouterAPI, chatRouterAPI, chatRouterMain} = require("./routers")
const {statusText, frontendVerifyToken} =  require("./utils")

const app = express()
// we use express app here so we can combine both features and be able to use socket io
const httpServer = http.createServer(app) 
// socket io server 
const io = new Server(httpServer)

// connect to database
mongoose.connect(process.env.MONGODB_URL).then(() => console.log("Connected to MongoDB")).catch((error) => console.log("error connecting to MongoDB ", error))

// parses the body automatically
app.use(express.json())
// parses the cookie that comes with request
app.use(cookieParser())

// add /static so we can access static files
app.use("/static", express.static(path.join(__dirname, "static")))


// api routes
app.use('/api', usersRouterAPI)
app.use('/api/chat', chatRouterAPI)

// frontend routes
app.use('/', chatRouterMain)



// socket io handling
io.on("connection", (socket) => {
    console.log("User connected with id:", socket.id)

    // check if token is valid then send message to all users  //incase user edited the front end part and changed the if conditions 
    let cookie = socket.handshake.headers.cookie
    
        // listen to send message
        socket.on("send-message", (messageDB) => {
            if(frontendVerifyToken(cookie)) 
                socket.broadcast.emit("show-message-to-all-users", messageDB)
        })

        socket.on("delete-message", (messageId) => {
            if(frontendVerifyToken(cookie)) 
                io.emit("show-delete-message-status", messageId)
        })


        // disconnected users
        socket.on("disconnect", () => {
            console.log("User disconnected with id:", socket.id)
        })  
    })




// global error handler for erros coming from routes
app.use((error, req, res, next) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message, 
        code: error.statusCode
    })
})
// global error handler for not found pages 404
app.all("*", (req, res) => {
    res.status(404).json({status: "error", message: "404 page not found"})
})


httpServer.listen(process.env.PORT, () => {
    console.log("listening on port " + process.env.PORT)
})