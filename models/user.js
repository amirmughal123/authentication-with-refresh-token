const mongoose = require('mongoose')
const jwt = require ('jsonwebtoken')
const bcrypt = require('bcrypt')
const { isEmail } = require('validator')

const Token = require('./token')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'password is required]'],
    minlength: [6, 'minimum password length is 6'],
  },
})

userSchema.methods = {
  createAccessToken : async function (){
    const { _id } = this
    try{
      console.log('ID', _id)
      const accessToken = jwt.sign({ _id }, process.env.ACCESS_TOKEN_KEY, {
        expiresIn: 1000 * 60 * 10
      })
      return accessToken
    }
    catch(err){
      console.log('Error Access token', err)
    }
  },

  createRefreshToken : async function (){
    try {
      const { _id } = this
      const refreshToken = jwt.sign({ _id }, process.env.REFRESH_TOKEN_KEY, {
        expiresIn: 1000 * 60 * 60 * 24
      })
      await Token.create({ refreshToken  })
      return refreshToken
    }
    catch (err){
      console.log('Error refresh token', err)
    } 
  } 
}

userSchema.pre('save', async function(next){
  if (this.password){
    try{
      const salt = await bcrypt.genSalt(process.env.SALT_ROUNDS)
      this.password = await bcrypt.hash(this.password, salt)
    }
    catch(err){
      console.log('Error in userschema pre hook', err)
    }
  }
  else {
    res.send('Your password is missing')
  }
  return next()
})

const user = mongoose.model('Users', userSchema)

module.exports = user