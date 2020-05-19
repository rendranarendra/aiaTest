const mongoose = require('mongoose')
const Schema = mongoose.Schema
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
    username: {
        type: String,
        requiredl: true,
        unique: true,
    },
    image: {
        type: String,
        default: 'https://ik.imagekit.io/rendranarendra/IMG-1584035165791_ixW9Mdk38',
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
})

class User extends mongoose.model('User', userSchema) {
    static register(bodyParams) {
        return new Promise((resolve, reject) => {

            let encrypted_password = bcrypt.hashSync(bodyParams.password, 10)

            let params = {
                username: bodyParams.username,
                email: bodyParams.email,
                password: encrypted_password
            }

            this.create(params)
                .then(data => {

                    let token = jwt.sign({ _id: data._id, role: data.role }, process.env.JWT_SIGNATURE_KEY)

                    resolve({
                        _id: data._id,
                        username: data.username,
                        email: data.email,
                        token: token
                    })
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
}

module.exports = User