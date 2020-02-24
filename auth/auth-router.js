const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const jwtSecret = require('../secrets')
const Users = require('../users/users.model')

const generateToken = ({ id, username }) =>
  jwt.sign(
    {
      subject: id,
      username,
    },
    jwtSecret,
    {
      expiresIn: '1d',
    }
  )

router.post('/register', async (req, res) => {
  const user = req.body
  const hash = bcrypt.hashSync(user.password, 10)
  const hashedUser = { ...user, password: hash }

  try {
    const registeredUser = await Users.insert(hashedUser)
    res.status(201).json({
      user: { id: registeredUser.id, username: registeredUser.username },
      token: generateToken(registeredUser),
    })
  } catch (error) {
    res.status(500).json({ message: 'User registration failed.', error })
  }
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const userToLogin = await Users.findBy({ username }).first()

    if (userToLogin && bcrypt.compareSync(password, userToLogin.password)) {
      res.status(200).json({
        message: `Welcome ${username}!`,
        token: generateToken(userToLogin),
      })
    } else {
      res.status(401).json({ message: 'You shall not pass!' })
    }
  } catch (error) {
    res.status(500).json({ message: 'User login failed.', error })
  }
})

module.exports = router
