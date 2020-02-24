const request = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const server = require('../api/server')
const db = require('../database/dbConfig')
const jwtSecret = require('../secrets')

describe('/jokes', () => {
  describe('register a new user', () => {
    it('should return 201 status code when user is registered', () =>
      request(server)
        .post('/api/auth/register')
        .send({
          username: 'tuna',
          password: 'password',
        })
        .expect(201))

    it("should return the registered user's username, id, and token", () => {
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

      const hash = bcrypt.hashSync('password', 10)

      return request(server)
        .post('/api/auth/register')
        .send({
          username: 'tuna',
          password: 'password',
        })
        .expect({
          user: { id: 1, username: 'tuna' },
          token: generateToken({ id: 1, username: 'tuna', password: hash }),
        })
    })
  })
})

beforeEach(async () => db('users').truncate())
