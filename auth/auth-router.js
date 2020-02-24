import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import jwtSecret from '../secrets'
import Users from '../users/users.model'

const router = Router()

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
    res
      .status(201)
      .json({ user: registeredUser, token: generateToken(registeredUser) })
  } catch (error) {
    res.status(500).json({ message: 'User registration failed.', error })
  }
})

router.post('/login', (req, res) => {
  // implement login
})

export default router
