const express = require('express')
const router = express.Router()
const authorization = require('./authorization')
const tasksRoutes = require('./tasks.routes')

router.use('/', authorization)
router.use('/todos', tasksRoutes)

module.exports = router