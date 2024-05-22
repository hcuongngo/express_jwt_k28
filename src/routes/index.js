const express = require('express')
const rootRoute = express.Router()

const authRoute = require("./authRoute.js")

rootRoute.use("/auth", authRoute)
rootRoute.use("/items", itemRoute)
module.exports = rootRoute
