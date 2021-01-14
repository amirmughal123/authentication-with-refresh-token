const jwt = require("jsonwebtoken")


module.exports.checkAuth = (req, res, next) => {
  const token = req.get("x-auth-token")
  console.log('Token', token)
  if (token) {
    try{
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_KEY)
      req.user = payload.user
      next()
    }catch(error){
      if (error.name == "TokenExpiredError") {
        return res.status().json({ 
          error: "Session timed out,please login again" 
        })
      }
      else if (error.name == "JsonWebTokenError") {
        return res.status(401).json({ 
          error: "Invalid token,please login again!" 
        });
      }
      else {
        return res.status(400).json({
          error
        })
      }
    }
  }
  else {
    return res.status(401).json({ 
      error: "Access denied, token missing!" 
    });
  }
}