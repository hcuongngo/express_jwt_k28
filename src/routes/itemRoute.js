const express = require('express')
const itemRoute = express.Router()
const { checkAccessToken, checkAuthorizationAdmin } = require('../middleware/auth.js')

itemRoute.get("/", checkAccessToken, getItems)
itemRoute.get("/:id", checkAccessToken, getItemById)
itemRoute.get("/pagination", checkAccessToken, getItemsPagination)
itemRoute.post("/", checkAccessToken, checkAuthorizationAdmin, createNewItem)
itemRoute.put("/", checkAccessToken, checkAuthorizationAdmin, updateItem)

