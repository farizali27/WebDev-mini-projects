const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(err.message)

  let statusCode = err.statusCode || 500
  let message = err.message || 'Something went wrong, try again later'
  
  return res.status(statusCode).json({
    success: false,
    error: message,
  })
}

module.exports = errorHandlerMiddleware