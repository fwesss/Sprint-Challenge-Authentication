const db = require('../database/dbConfig')
const { findBy, insert } = require('./users.model')

describe('users model', () => {
  describe('insert', () => {
    it('should add a user to the database', async () => {
      await insert({ username: 'Tuna', password: 'Treats' })
      await insert({ username: 'Scout', password: 'Treats' })

      expect(await findBy({ password: 'Treats' })).toHaveLength(2)
    })

    it('should return the inserted employee', async () => {
      expect(
        await insert({
          username: 'Tuna',
          password: 'Treats',
        })
      ).toEqual({
        id: 1,
        username: 'Tuna',
        password: 'Treats',
      })
    })
  })

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
