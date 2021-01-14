const bcrypt = require('bcrypt')

const User = require ('../models/user')
const Token = require ('../models/token')

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body
    try{
      const user = await User.create({ email, password })
      console.log('User', user)
      const accessToken = await user.createAccessToken()
      const refreshToken = await user.createRefreshToken()
      res.status(201).json({
        success: true, 
        data: {
          id: user._id,
          email : user.email
        }, 
        accessToken, 
        refreshToken
      })
    }catch (err) {
      res.send(err.message)
    }
  }

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body
  if (email && password){
    try {
      const user = await User.findOne({ email: email })
      if (user){
        try {
            const isPassword = await bcrypt.compare(password, user.password)
            if (isPassword){
              const accessToken = await user.createAccessToken()
              const refreshToken = await user.createRefreshToken()
              res.status(201).json({ 
                success: true , 
                accessToken,
                refreshToken,
                data: {
                  id: user._id,
                  email: user.email
                }  
              })
            }
            res.json({ success: false, message: 'Invalid! password' })   
        }
        catch (err){
          res.json({ success: false, message: err })
        }
      }
      else {
        res.json({ success: false, message: 'Invalid! email address' })
      }
    }
    catch (err) {
      return res.json({ success: false, message: err })
    }
  }
  else {
    res.json({ success: false, message: 'Missing! Your authentication credentials are missing'})
  }
}

module.exports.logout = async (req, res) => {
  try {
    const {refreshToken} = req.body
    const isDeleted = await Token.findOneAndDelete({ refreshToken })
    if (isDeleted){
      return res.status(200).json({
        success: true,
      })
    }
    else {
      return res.status(400).json({ 
        success: false,
        error: 'Failed to Logout' 
      })
    }
  }catch (error) {
    return res.status(500).json({ 
      success: false,
      error: "Internal Server Error" 
    })
  }
}

module.exports.check = (req, res) => {
  res.send('ok')
}