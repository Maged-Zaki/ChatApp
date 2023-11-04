const JWT = require("jsonwebtoken")


const generate = (payload) => {
    return JWT.sign(payload, process.env.SECRET_KEY, {expiresIn: "1h"})
}



module.exports = {
    generate
}