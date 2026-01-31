const {StatusCodes} = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next)=> {
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  let message = err.message || 'Error occured, try again later'

  res.status(statusCode).json({
    success: false,
    error: message
  })
}

module.exports = errorHandlerMiddleware