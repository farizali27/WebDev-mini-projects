const errorHandlerMiddleware = (req, res)=> {
  res.status(500).send('Error occured, try again later')
}

module.exports = errorHandlerMiddleware