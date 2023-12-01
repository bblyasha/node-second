const fs = require('fs')
const { use } = require('../routes')

class UserService {
    getRegisteredUsers() {
        const data = fs.readFileSync('users.json', "utf8")
        return JSON.parse(data)
    }

    getOneUser(data) {
        const users = this.getRegisteredUsers()
        const user = users.find(u => u.email == data)
        return user
    }

    createUser(data) {
        const users = this.getRegisteredUsers()
        users.push(data)
        fs.writeFileSync('users.json', JSON.stringify(users), 'utf8')
        return data
    }

    getTasks() {
        const todos = fs.readFileSync('tasks.json', "utf8")
        return JSON.parse(todos)
    }

    getUserTasks(userId) {
        const todos = this.getTasks()
        const userTodos = todos.filter(todo => todo.idUser == userId)
        return userTodos
    }

    saveTasks(updateTodos) {
        fs.writeFileSync('tasks.json', JSON.stringify(updateTodos), 'utf8')
    }
}

module.exports = new UserService