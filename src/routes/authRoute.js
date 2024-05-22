const express = require('express')
const authRoute = express.Router()

const { register, login, refreshToken, changePassword, forgotPassword, logout } = require('../controller/authController.js')
const { checkRefreshToken, checkAccessToken } = require('../middleware/auth.js')

authRoute.post("/register", register)
authRoute.post("/login", login)

// middleware verify refresh token
authRoute.get("/refresh-token", checkRefreshToken, refreshToken)

// middleware verify access token
authRoute.put("/change-password", checkAccessToken, changePassword)
authRoute.put("/forgot-password", forgotPassword)
authRoute.post("/logout", checkAccessToken, logout)
module.exports = authRoute