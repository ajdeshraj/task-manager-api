const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')

// POST request to add new task
router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch(error) {
        res.status(400).send(error)
    }
})

// GET request to get all tasks from db
// GET /tasks?completed=(true or false)
// GET /tasks?limit=(number value)&skip=(number value)
// limit gives number of results to show and skip gives number of results to skip before showing the results
// GET /tasks?sortBy=(field to sort):(asc or desc)
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    // Async await implementation
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort            }
        }).execPopulate()
        res.send(req.user.tasks)
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
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    // console.log(_id)
    // Async await implementation
    try {
        // const task = await Task.findById(_id)
        const task = await Task.findOne({_id, owner: req.user._id})
        // console.log(task)
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
router.patch('/tasks/:id', auth, async (req, res) => {
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

        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        // const task = await Task.findById(req.params.id)

        if (!task) {
            res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

// DELETE request to delete task by id from db
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
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
