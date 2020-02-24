const request = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const server = require('../api/server')
const db = require('../database/dbConfig')
const jwtSecret = require('../secrets')

describe('/auth', () => {
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

  describe('exising user login', () => {
    it('should return a 200 status on successful login', () =>
      request(server)
        .post('/api/auth/register')
        .send({
          username: 'tuna',
          password: 'password',
        })
        .then(() => {
          request(server)
            .post('/auth/api/login')
            .send({ username: 'tuna', password: 'password' })
            .expect(200)
        }))

    it('should return a token on successful login', () => {
      const hash = bcrypt.hashSync('password', 10)

      return request(server)
        .post('/api/auth/register')
        .send({
          username: 'tuna',
          password: 'password',
        })
        .then(() => {
          request(server)
            .post('/auth/api/login')
            .send({ username: 'tuna', password: 'password' })
            .expect({ message: 'Welcome tuna!', token: hash })
        })
    })
  })
})

beforeEach(async () => db('users').truncate())
