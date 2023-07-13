const express = require('express')
const app = express()
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

app.use(express.json())

// POST request to add new user
app.post('/users', async (req, res) => {
    const user = new User(req.body)
    // Async await implementation
    try {
        await user.save()
        res.status(201).send(user)
    }
    catch (error) {
        res.status(400).send(error)
    }

    // Old Code
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((error) => {
    //     res.status(400).send(error)
    // })
})

// GET request to get all users from db
app.get('/users', async (req, res) => {
    // Async await implementation
    try {
        const users = await User.find({})
        res.send(users)
    }
    catch (error) {
        res.status(500).send(error)
    }
    
    // Old Code
    // User.find({}).then((users) => {
    //     res.send(users)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
})

// GET request to get single user from db
app.get('/users/:id', async (req, res) => {
    // Async await implementation
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    }
    catch (error) {
        res.status(500).send(error)
    }

    // Old Code
    // User.findById(_id).then((user) => {
    //     if (!user) {
    //         return res.status(404).send()
    //     }
    //     res.send(user)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
})

// PATCH request to update user based on id
app.patch('/users/:id', async (req, res) => {
    // Checking for valid updates
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'age', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid Updates'})
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

app.delete('/users/:id', async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

// POST request to add new task
app.post('/tasks', (req, res) => {
    const task = new Task(req.body)
    task.save().then(() => {
        res.status(201).send(task)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

// GET request to get all tasks from db
app.get('/tasks', async (req, res) => {
    // Async await implementation
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    }
    catch (error) {
        res.status(500).send(error)
    }

    // Old Code
    // Task.find({}).then((tasks) => {
    //     res.send(tasks)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
})

// GET request to get single task from db
app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    // Async await implementation
    try {
        const task = await Task.findById(_id)
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    }
    catch (error) {
        res.status(500).send(error)
    }

    // Old Code
    // Task.findById(_id).then((task) => {
    //     if (!task) {
    //         return res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
})

// PATCH request to update task based on id
app.patch('/tasks/:id', async (req, res) => {
    // Checking for valid updates
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid Updates'})
    }

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidator: true})
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
