const errorHandlerMiddleware = (err, req, res, next)=> {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Error occured, try again later'

  res.status(statusCode).json({
    success: false,
    error: message
  })
}

module.exports = errorHandlerMiddleware