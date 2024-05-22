const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const { handleResponseSuccess, handleResponseError } = require("../utils/response.js")
const { hashPassword, checkEmailUser, checkPasswordUser } = require("../utils")
const { generateAccessToken, generateRefreshToken, sampleRefreshTokens, SECRET_KEY_REFRESH_TOKEN } = require("../middleware/auth.js")

const users = [
  { email: "user1@gmail.com", password: bcrypt.hashSync("user1", 10), role: "admin" },
  { email: "user2@gmail.com", password: bcrypt.hashSync("user2", 10), role: "user" },
]

const register = async (req, res) => {
  try {
    const newUser = req.body
    const { password } = newUser
    newUser.password = await hashPassword(password)
    users.push({ ...newUser, role: "user" })
    const cloneNewUser = { ...newUser, role: "user" }
    delete cloneNewUser.password
    handleResponseSuccess(res, 201, "Register success", cloneNewUser)
  } catch (error) {
    handleResponseError(res, 500, "Server Error")
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const checkedEmailUser = checkEmailUser(users, email)
    if (!checkedEmailUser) {
      handleResponseError(res, 401, "Email is incorrect")
      return
    }
    const checkedPasswordUser = await checkPasswordUser(password, checkedEmailUser.password)
    if (!checkedPasswordUser) {
      handleResponseError(res, 401, "Password is incorrect")
      return
    }

    const accessToken = generateAccessToken(checkedEmailUser.email, checkedEmailUser.password, checkedEmailUser.role)
    const refreshToken = generateRefreshToken(checkedEmailUser.email, checkedEmailUser.password, checkedEmailUser.role)
    sampleRefreshTokens.push(refreshToken)
    const cloneUser = { ...checkedEmailUser }
    delete cloneUser.password
    handleResponseSuccess(res, 200, "Login success", {
      data: cloneUser,
      accessToken,
      refreshToken,
    })
  } catch (error) {
    handleResponseError(res, 500, "Server Error")
  }
}

const refreshToken = (req, res) => {
  try {
    const authorizationHeader = req.headers['authorization']
    const refreshToken = authorizationHeader.split(" ")[1]
    jwt.verify(refreshToken, SECRET_KEY_REFRESH_TOKEN, (err, decoded) => {
      const newAccessToken = generateAccessToken(decoded.email, decoded.password, decoded.role)
      handleResponseSuccess(res, 200, "Refresh token success", {
        newAccessToken
      })
    })
  } catch (error) {
    handleResponseError(res, 500, "Server Error")
  }
}

const changePassword = async (req, res) => {
  try {
    const { email, password, newPassword } = req.body
    const checkedEmailUser = checkEmailUser(users, email)
    if (!checkedEmailUser) {
      handleResponseError(res, 401, "Email is incorrect")
      return
    }
    const checkedPasswordUser = await checkPasswordUser(password, checkedEmailUser.password)
    if (!checkedPasswordUser) {
      handleResponseError(res, 401, "Password is incorrect")
      return
    }
    checkedEmailUser.password = await hashPassword(newPassword)
    handleResponseSuccess(res, 200, "Change password success")
  } catch (error) {
    handleResponseError(res, 500, "Server Error")
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body
    const checkEmailUser = users.find(users => users.email === email)
    if (!checkEmailUser) {
      handleResponseError(res, 401, "Email is incorrect")
      return
    }
    checkEmailUser.password = await hashPassword(newPassword)
    handleResponseSuccess(res, 200, "Reset password successfully")
  } catch (error) {
    handleResponseError(res, 500, "Server Error")
  }
}

const logout = (req, res) => {
  handleResponseSuccess(res, 200, "Logout")
}

module.exports = {
  register,
  login,
  refreshToken,
  changePassword,
  forgotPassword,
  logout,
}