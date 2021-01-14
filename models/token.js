const mongoose = require ('mongoose')

const tokenSchema = new mongoose.Schema({
  refreshToken : {
    type: 'string',
    require: true,
    unique: true
  }
})

const token = mongoose.model('Token', tokenSchema)

module.exports = token