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
        const data = fs.readFileSync('tasks.json', "utf8")
        return JSON.parse(data)
    }

    saveTasks(data) {
        fs.writeFileSync('tasks.json', JSON.stringify(data), 'utf8')
    }
}

module.exports = new UserService