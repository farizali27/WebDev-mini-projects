const authenticationMiddleware = async (req, res, next)=> {
  console.log('authenticated')
  next()
}

module.exports = authenticationMiddleware