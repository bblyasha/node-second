const express = require("express")
const router = express.Router()
const UserController = require("../controllers/userController")
const UserService = require("../services/userServices")
const Sentry = require("@sentry/node")
const { route } = require("./authorization")

/**
 * @swagger
 * /api/todos:
 *  get:
 *      summary: Get all todos of current user
 *      tags:
 *        - Todos
 *      description: Returns todos array
 *      responses:
 *        200:
 *          description: Successful response
 */

router.get('/', (req,res) => {
    try {
        const tasks = UserService.getTasks()
        res.send(tasks)
    } catch (err) {
        Sentry.captureException(err)
    }
})

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo for current user
 *     tags:
 *        - Todos
 *     description: Creating a new todo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: {"id":"1","title":"Buy bread","isCompleted":true,"idUser":5}
 *     responses:
 *       200:
 *         description: Todo has been successfully created.
 *       400:
 *         description: Bad request.
 */

router.post('/', (req,res) => {
    try {
        const newTask = req.body
        UserController.addTask(newTask)
        res.send(newTask)
    } catch (err) {
        Sentry.captureException(err)
    }
})

/**
 * @swagger
 * /api/todos/{id}:
 *   patch:
 *     summary: Updates todo title for todo with id = {id}
 *     tags:
 *        - Todos
 *     description: Updates todo title for todo with id = {id}
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: {"title": "Buy bread"}
 *     responses:
 *       200:
 *         description: Task data has been successfully updated.
 *       400:
 *         description: Bad request.
 */

router.patch('/:id', (req,res) => {
    try {
        const data = req.body
        const taskId = req.params.id
        const taskToUpdate = UserController.updateTask(taskId,data)
        if(!taskToUpdate) {
            res.sendStatus(404)
        }
        res.send(taskToUpdate)
    } catch (err) {
        Sentry.captureException(err) 
    }
})

/**
 * @swagger
 * /api/todos/{id}/isCompleted:
 *   patch:
 *     summary: Updates isCompleted property value to the opposite 
 *     tags:
 *        - Todos
 *     description: Updates isCompleted property value to the opposite
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID.
 *     responses:
 *       200:
 *         description: Task data has been successfully updated.
 *       400:
 *         description: Bad request.
 */

router.patch('/:id/isCompleted', (req,res) => {
    try {
        const taskId = req.params.id
        const  i = UserController.updateIsCompleted(taskId)
        if(i == -1) {
            res.send(false)
        } 
        else res.send(true)
    } catch (err) {
        Sentry.captureException(err)
    }
})

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete todo with {id}
 *     tags:
 *        - Todos
 *     description: Deletes todo by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID.
 *     responses:
 *       200:
 *         description: User has been successfully deleted.
 *       400:
 *         description: Bad request.
 */

router.delete('/:id', (req,res) => {
    try {
        const taskId = req.params.id
        const i = UserController.deleteTask(taskId)
        if(i == -1) {
            res.send(false)
        } 
        else res.send(true)
    } catch (err) {
        Sentry.captureException(err)
    }
})

module.exports = router