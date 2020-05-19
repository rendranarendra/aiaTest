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

