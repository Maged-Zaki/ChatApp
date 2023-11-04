

class AppError extends Error {
    constructor() {
        super()
    }

    create(status, message, statusCode) {
        this.status = status
        this.message = message
        this.statusCode = statusCode 
        return this
    }
}


module.exports = new AppError()


