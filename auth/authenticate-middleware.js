const jwt = require('jsonwebtoken')
const secret = require('../secrets')

module.exports = (req, res, next) => {
  const token = req.headers.authorization

  if (req.decodedJwt) {
    next()
  } else if (token) {
    jwt.verify(token, secret, (error, decodedJwt) => {
      if (error) {
        res.status(401).json({ you: 'shall not pass!' })
      } else {
        req.decodedJwt = decodedJwt
        next()
      }
    })
  } else {
    res.status(401).json({ you: 'shall not pass!' })
  }
}
