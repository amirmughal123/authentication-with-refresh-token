const { Router } = require('express')
const router = Router();

const tokenController = require('../controllers/tokenController')

router.post('/refresh_token', tokenController.generateAccessToken)

module.exports = router