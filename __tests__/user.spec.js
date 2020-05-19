const supertest = require('supertest')
const mongoose = require('mongoose')
require('dotenv').config()

const server = require('../src/index.js')
const request = supertest(server)

const userFixtures = require('../src/fixtures/userFixture.js')
const staticUser = userFixtures.create()

async function removeAllCollections() {
    const collections = Object.keys(mongoose.connection.collections)
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName]
        await collection.deleteMany()
    }
}

async function dropAllCollections() {
    const collections = Object.keys(mongoose.connection.collections)
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName]
        try {
            await collection.drop()
        } catch (error) {
            if (error.message === 'ns not found') return
            if (error.message.includes('a background operation is currently running')) return
            console.log(error.message)
        }
    }
}

beforeAll(async (done) => {
    mongoose
        .connect(process.env.DB_CONNECTION_TEST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        .then(() => {
            console.log('database connected')
        })
        .catch(err => console.error(err))
    await removeAllCollections()
    done()
})

afterAll(async (done) => {
    await dropAllCollections()
    await mongoose.connection.close()
    done()
})


describe('POST /api/v1/users', () => {
    it('should create new user', async done => {
        staticUser.password_confirmation = staticUser.password
        request
            .post('/api/v1/users')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(staticUser))
            .then(res => {
                expect(res.status).toBe(201)
                let { status, message, data } = res.body
                expect(status).toBe(true)
                expect(message).toBe("Your account has been created")
                expect(data).toHaveProperty('username')
                expect(data).toHaveProperty('email')
                expect(data).toHaveProperty('token')
                done()
            })
    })

    it('should not create new user due to registered email', async done => {
        let userSample = {
            ...staticUser
        }
        request
            .post('/api/v1/users')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(userSample))
            .then(res => {
                expect(res.status).toBe(422)
                let { status, message, data, errors } = res.body
                expect(status).toBe(false)
                expect(message).toBe('A problem has been encountered while creating your account')
                expect(data).toBe(null)
                expect(errors).toHaveProperty('name', 'MongoError')
                done()
            })
    })
})

describe('POST /api/v1/auth', () => {
    it('should log user in', async done => {
        request
            .post('/api/v1/auth')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(staticUser))
            .then(res => {
                expect(res.status).toBe(200)
                let { status, message, data } = res.body
                expect(status).toBe(true)
                expect(message).toBe("You've successfully logged in")
                expect(data).toHaveProperty('username')
                expect(data).toHaveProperty('token')
                done()
            })
    })

    it('should log user in because user is not registered', async done => {
        let invalidUser = {
            username: 'invalid',
            password: 'invalid'
        }
        request
            .post('/api/v1/auth')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(invalidUser))
            .then(res => {
                expect(res.status).toBe(422)
                let { status, message, data, errors } = res.body
                expect(status).toBe(false)
                expect(message).toBe("Login failed")
                expect(data).toBe(null)
                expect(errors).toBe('User not found!')
                done()
            })
    })

    it('should not log user in', async done => {
        let userSample = {
            ...staticUser,
            password: ""
        }
        request
            .post('/api/v1/auth')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(userSample))
            .then(res => {
                expect(res.status).toBe(422)
                let { status, message, data, errors } = res.body
                expect(status).toBe(false)
                expect(message).toBe('Login failed')
                expect(data).toBe(null)
                expect(errors).toBe('Incorrect Password!')
                done()
            })
    })
})

describe('GET /api/v1/users', () => {
    it('should get current user information', async done => {
        request
            .post('/api/v1/auth')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(staticUser))
            .then(res => {
                let token = res.body.data.token
                request
                    .get('/api/v1/users')
                    .set('Authorization', 'Bearer ' + token)
                    .then(res => {
                        expect(res.status).toBe(200)
                        let { status, message, data } = res.body
                        expect(status).toBe(true)
                        expect(message).toBe('Current user information: ')
                        expect(data).toHaveProperty('username')
                        expect(data).toHaveProperty('email')
                        done()
                    })
            })
    })

    it('should not get current user information due to invalid token', async done => {
        request
            .get('/api/v1/users')
            .set('Authorization', "")
            .then(res => {
                expect(res.status).toBe(401)
                let { status, message, data, errors } = res.body
                expect(status).toBe(false)
                expect(message).toBe('Invalid Token')
                expect(data).toBe(null)
                expect(errors).toHaveProperty('name', 'JsonWebTokenError')
                done()
            })
    })
})
