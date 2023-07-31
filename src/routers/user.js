const express = require('express')
const multer = require('multer')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')

const upload = multer({
    dest: 'avatars'
})

// POST request to add new user
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    // Async await implementation
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
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

// GET request to get user data
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// POST request to sign in users
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }
    catch {
        res.status(400).send()
    }
})

// POST request to logout user
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()

        res.send()
    }
    catch (error) {
        res.status(500).send()
    }
})

// POST request to logout user from all active sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    }
    catch (error) {
        res.status(500).send()
    }
})

// PATCH request to update user based on id
router.patch('/users/me', auth, async (req, res) => {
    // Checking for valid updates
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'age', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid Updates'})
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

// DELETE request to delete user by id from db
router.delete('/users/me', auth, async(req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

// POST request to upload profile picture for user
router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
    res.send()
})

module.exports = router
