const jwt = require ('jsonwebtoken')

const Token = require('../models/token')

module.exports.generateAccessToken = async (req, res) => {
  try{
    const { refreshToken } = req.body
    if (refreshToken){
      const token = await Token.findOne({ refreshToken })
      if (token) {
        const payload = jwt.verify(token.refreshToken, process.env.REFRESH_TOKEN_KEY)
        const accessToken = jwt.sign({ user: payload }, process.env.ACCESS_TOKEN_KEY, {
          expiresIn: 1000 * 60 * 10
        });
        return res.status(200).json({ accessToken })
      }
      else {
        return res.status(403).json({ error: 'Access denied, invalid token' })
      }
    }
    else {
      return res.status(403).json({ error: 'Access denied, token missing!' })
    }
  }catch(error) {
    return res.status(500).json({ error: "Internal Server Error!"})
  }
}