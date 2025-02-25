const errorMiddleWare = (err, req, res, next) =>{
    try{
        let error = { ...err}
        error.message = err.message
        console.error(err)
        // mongoose bad ObjectId
        if(err.name == "CastError"){
            const message = 'Resource not found'
            error = new Error(message)
            error.statusCode = 404
        }
        // mongoose duplicare key
        if(err.code  === 11000){
            const message = 'Duplicate field entered'
            error = new Error(message)
            error.statusCode = 400
        }
        // mongoose validationError
        if(err.name === "validationError"){
            const message = Object.values(err.errors).map(val => val.message)
            error = new Error(message.join(', '))
            error.statusCode = 400
        }
        res.status(error.statusCode || 500).json({success : false, error: error.message || "Server Error"})
    }catch(error){
        next(error)
    }
}

export default errorMiddleWare