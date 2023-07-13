const express = require('express')
const app = express()
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

app.use(express.json())

app.post('/users', (req, res) => {
    const user = new User(req.body)
    user.save().then(() => {
        res.send(user)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

app.post('/tasks', (req, res) => {
    const task = new Task(req.body)
    task.save().then(() => {
        res.send(task)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
