const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')
const {sendWelcomeEmail, sendCancelEmail} = require('../emails/account')

// POST request to add new user
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    // Async await implementation
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
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
        sendCancelEmail(req.user.email, req.user.name)
        res.send(req.user)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

// Calling multer
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jgp|jpeg|png)$/)) {
            return callback(new Error('Only JPG, JPEG and PNG files are accepted'))
        }

        callback(undefined, true)
    }
})

// POST request to upload profile picture for user
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    // Normalising file (image) uploaded
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

// DELETE request to delete profile picture for user
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error() 
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }
    catch (error) {
        res.status(404).send(error)
    }
})

module.exports = router
