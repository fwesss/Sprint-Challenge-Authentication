const db = require('../database/dbConfig')
const { findBy, insert } = require('./users.model')

describe('users model', () => {
  describe('findBy', () => {
    it('should return a list of 1 user with a username matching the request', async () => {
      await insert({ username: 'Tuna', password: 'Treats' })
      await insert({ username: 'Scout', password: 'Bones' })

      expect(await findBy({ username: 'Tuna' })).toEqual([
        {
          id: 1,
          username: 'Tuna',
          password: 'Treats',
        },
      ])
    })
  })
})

beforeEach(async () => db('users').truncate())
