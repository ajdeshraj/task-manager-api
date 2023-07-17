const express = require('express')
const app = express()
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled')
//     }
//     else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Site is down. Check back soon!')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})

const jwt = require('jsonwebtoken')

const myFunction = async () => {
    const token = jwt.sign({_id: 'abc1234'}, 'thisisrandom', {expiresIn: '7 days'})
    console.log(token)

    const data = jwt.verify(token, 'thisisrandom')
    console.log(data)
}

myFunction()
