const path = require("path")





const frontendChat = async(req, res, next) => {
    return res.sendFile("templates/index.html", {root: "static"})
}


const frontendLogin = async(req, res, next) => {
    return res.sendFile("templates/login.html", {root: "static"})
}




module.exports = {
    frontendChat,
    frontendLogin
}