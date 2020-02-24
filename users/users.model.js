const db = require('../database/dbConfig')

const findBy = filter =>
  db('users')
    .select('*')
    .where(filter)

const insert = user =>
  db('users')
    .insert(user)
    .then(ids => findBy({ id: ids[0] }).first())

module.exports = { findBy, insert }
