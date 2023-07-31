const express = require('express')
const app = express()
const multer = require('multer')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(png)$/)) {
            return callback(new Error('Only Images are accepted'))
        }

        callback(undefined, true)
    }
})

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
