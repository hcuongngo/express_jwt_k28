const express = require('express')
const app = express()
const PORT = 3000

app.get("/", (req, res) => {
  res.send("Hello ExpressJS")
})

app.listen(PORT, () => {
  console.log(`Running in ${PORT}`)
})
