const faker = require('faker')

function create() {
    return {
        username: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }
}

module.exports = {
    create
}
