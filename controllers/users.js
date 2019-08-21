const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('blogs')
    response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response, next) => {
    try {

        const body = request.body

        if (body.username === undefined || body.password === undefined
            || body.username.length < 3 || body.password.length < 3) {
                return response.status(400).json({ error: 'Username or password missing or length less than 3'})
        } 

        const userNames = await User .find({})
        const res = userNames.map(uNames => uNames.username)

        if(res.includes(body.username)) {
            return response.status(400).json({ error: '`username` to be unique'})
        }
       
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            password: passwordHash,
        })

        const savedUser = await user.save()

        response.json(savedUser.toJSON())

    } catch (exception) {
        next(exception)
    }
    
})

module.exports = usersRouter