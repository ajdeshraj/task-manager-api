const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

// POST request to add new task
router.post('/tasks', (req, res) => {
    const task = new Task(req.body)
    task.save().then(() => {
        res.status(201).send(task)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

// GET request to get all tasks from db
router.get('/tasks', async (req, res) => {
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
router.get('/tasks/:id', async (req, res) => {
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
router.patch('/tasks/:id', async (req, res) => {
    // Checking for valid updates
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid Updates'})
    }

    try {
        // Using findByIdAndUpdate(Mongoose) doesn't allow Middleware
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidator: true})

        const task = await Task.findById(req.params.id)
        updates.forEach((update) => task[update] = req.body[update])
        
        await task.save()

        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

// DELETE request to delete task by id from db
router.delete('/tasks/:id', async (req, res) => {
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

module.exports = router
