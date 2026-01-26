const registerUser = async (req, res)=> {
  res.status(200).send('registered')
}

const loginUser = async (req, res)=> {
  res.status(200).send('logged in')
}

module.exports = {
  loginUser,
  registerUser
}