const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const helper = require('../utils/list_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const saltRounds = 10
        const passwordHash = await bcrypt.hash('sekret', saltRounds)
        const user = new User({ username: 'root', password: passwordHash})
        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const userAtStart = await helper.usersInDb()

        const newUser = {
            username: 'Kern Elder',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(userAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const userAtStart = await helper.usersInDb() 

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        expect(result.body.error).toContain('`username` to be unique')
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(userAtStart.length)
    })
})