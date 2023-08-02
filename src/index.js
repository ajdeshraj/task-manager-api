const express = require('express')
const app = express()
const multer = require('multer')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
