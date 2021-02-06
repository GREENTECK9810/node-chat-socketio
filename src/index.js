const express = require('express')
const userRoute = require('./routers/user')
require('./db/mongoose')

const port = 3000
const app = express()

app.use(express.json())
app.use(userRoute)

app.listen(port, () => {
    console.log('listening on port '+ port)
})