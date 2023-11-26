require('dotenv').config()
const { use } = require("../routes");
const UserService = require("../services/userServices")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const uuid = require("uuid")

class UserController {
    async login(data) {
        const {email, password} = data
        const user = UserService.getOneUser(email)
        if (user) {
            const compareUser = await bcrypt.compare(password, user.password)
            const id = user.id
            if (compareUser) {
                const token = jwt.sign({id},process.env.ACCESS_TOKEN_SECRET)
                return token
            }
        } else {
            return null
        }

    }

    async register(data) {
        const {email, password} = data
        const foundUser = UserService.getOneUser(email)
        if (!foundUser) {
            const uniqId = uuid.v4()
            const saltRounds = 4
            const salt = await bcrypt.genSalt(saltRounds)
            const passwordToString = String(password)
            const hashPass = await bcrypt.hash(passwordToString,salt)
            const createdUser = UserService.createUser({
                id: uniqId,
                email,
                password: hashPass
            })
            return createdUser
        } else return null
    }

    addTask(data) {
        const tasks = UserService.getTasks()
        const {title, isCompleted, idUser} = data
        const uniqId = uuid.v4()
        tasks.push({id: uniqId, title, isCompleted, idUser})
        UserService.saveTasks(tasks)
    }

    updateTask(taskId, data) {
        const tasks = UserService.getTasks()
        const taskToUpdate = tasks.find(item => item.id == taskId)
        if (!taskToUpdate) {
            return null
        }
        Object.assign(taskToUpdate,data)
        const indexToReplace = tasks.findIndex(task => task.id == taskId)
        tasks[indexToReplace] = taskToUpdate
        UserService.saveTasks(tasks)
        return taskToUpdate
    }

    updateIsCompleted (taskId) {
        const tasks = UserService.getTasks()
        const i = tasks.findIndex(task => task.id == taskId)
        tasks[i].isCompleted = !tasks[i].isCompleted
        UserService.saveTasks(tasks)
        return i
    }

    deleteTask(taskId) {
        const tasks = UserService.getTasks()
        const i = tasks.findIndex(task => task.id == taskId)
        if (i == -1) {
            return null
        }
        tasks.splice(i,1)
        UserService.saveTasks(tasks)
        return i
    }
}

module.exports = new UserController