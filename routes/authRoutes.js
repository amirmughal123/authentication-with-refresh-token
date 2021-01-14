const { Router } = require('express')
const router = Router();

const middlewares = require('../middlewares/checkAuth')

const authController = require('../controllers/authController')

router.post('/signup', authController.signup_post )

router.post('/login', authController.login_post )

router.post('/logout', authController.logout)

router.post('/protected', middlewares.checkAuth , authController.check)

module.exports = router;
