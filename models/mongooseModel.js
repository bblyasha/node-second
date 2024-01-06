const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        required: false
    }
})

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const Todo = mongoose.model('Todo', todoSchema)
const User = mongoose.model('User', userSchema)

module.exports = {
    Todo,
    User
}