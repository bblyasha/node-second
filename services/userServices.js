const fs = require('fs')
const { use } = require('../routes')
const {ObjectId} = require('mongodb')
const {getConnect, useDefaultDb} = require('../config/db')

class UserService {

    async getTodos() {
        return new Promise(async (res,rej) => {
            const client = await getConnect()
            const db = await useDefaultDb(client)
            const todos = await db.collection('todos').find({}).toArray()
            client.close()
            res(todos)
        })
    }

    async getTodoByUserId(idUser) {
        return new Promise(async (res,rej) => {
            const client = await getConnect()
            const db = await useDefaultDb(client)
            const todos = await db.collection('todos').find({idUser}).toArray()
            client.close()
            res(todos)
        })
    }

    async addTodo(newTask, idUser) {
        return new Promise(async (res,rej) => {
            const client = await getConnect()
            const db = await useDefaultDb(client)
            const todoWithUserId = {...newTask, idUser}
            const todos = await db.collection('todos').insertOne(todoWithUserId)
            client.close()
            res(todos)
        })
    }

    async updateTodo(id,title) {
        return new Promise(async (res,rej) => {
            const client = await getConnect()
            const db = await useDefaultDb(client)
            const todos = await db.collection('todos').updateOne({ _id: new ObjectId(id) }, { $set: {title} })
            client.close()
            res(todos)
        })
    }
    async changeCompeledStatus(id) {
        return new Promise(async (res, rej) => {
            const client = await getConnect();
            const db = await useDefaultDb(client);
            const todo = await db.collection('todos').findOne({ _id: new ObjectId(id) })
            if (!todo) {
                client.close();
                return rej({ message: 'Todo не найден' });
            }
    
            const newCompletedStatus = !todo.isCompleted;

            const result = await db.collection('todos').updateOne(
                { _id: new ObjectId(id) },
                { $set: { isCompleted: newCompletedStatus } }
            );
            client.close();
            res(result)
        });
    }

    async deleteTodo(id) {
        return new Promise(async (res,rej) => {
            const client = await getConnect()
            const db = await useDefaultDb(client)
            const todos = await db.collection('todos').deleteOne({_id: new ObjectId(id)})
            client.close()
            res(todos)
        })
    }
}

module.exports = new UserService