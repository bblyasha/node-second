require('dotenv').config()
const { MongoClient } = require('mongodb')
const client = new MongoClient(process.env.URL1)
const mongoose = require('mongoose')

async function getConnect() {
    return MongoClient.connect(process.env.URL1).then(client)
}

async function useDefaultDb(client) {
    const db = await client.db('Todo-list')
    return db
}

const db = async () => {
    mongoose.connect(process.env.URL2)
    .then(() => console.log('Mongoose is connected'))
}

module.exports = {
    getConnect,
    useDefaultDb,
    db
}