const supertest = require('supertest')
require('dotenv').config()

const server = require('../src/index.js')
const request = supertest(server)

describe('GET /api/v1/flickr', () => {
    it('should get image from flickr api', async done => {
        request
            .get('/api/v1/flickr')
            .query({ tag: "test" })
            .query({ page: 1 })
            .then(res => {
                expect(res.status).toBe(200)
                expect(res.body.status).toBe(true)
                expect(res.body.message).toBe("Successfully get image")
                expect(typeof(res.body.data)).toBe('object')
                done()
            })
    })
})