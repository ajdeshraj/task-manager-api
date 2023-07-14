const express = require('express')
const User = require('../models/user')
const router = new express.Router()

// POST request to add new user
router.post('/users', async (req, res) => {
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
router.get('/users', async (req, res) => {
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
router.get('/users/:id', async (req, res) => {
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
router.patch('/users/:id', async (req, res) => {
    // Checking for valid updates
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'age', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid Updates'})
    }

    try {
        // Using findByIdAndUpdate(Mongoose) doesn't allow Middleware
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        const user = await User.findById(req.params.id)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

// DELETE request to delete user by id from db
router.delete('/users/:id', async(req, res) => {
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

module.exports = router
