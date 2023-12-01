const express = require("express")
const router = express.Router()
const UserController = require("../controllers/userController")
const UserService = require("../services/userServices")
const Sentry = require("@sentry/node")
const { route } = require("./authorization")
const {authenticateToken} = require("../authMiddleware")
const {createTodo, changeTitle, changeIsComleted, deleteTodo,validationErrors} = require('../helpers/validation')

/**
 * @swagger
 * /api/todos:
 *  get:
 *      summary: Get all todos of current user
 *      tags:
 *        - Todos
 *      security: 
 *        - bearerAuth: []
 *      description: Returns todos array
 *      responses:
 *        200:
 *          description: Successful response
 */

router.get('/', authenticateToken, (req,res) => {
    try {
        const userId = req.id
        const tasks = UserService.getUserTasks(userId)
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
 *     security: 
 *        - bearerAuth: []
 *     description: Creating a new todo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: {"title":"Buy bread","isCompleted":true}
 *     responses:
 *       200:
 *         description: Todo has been successfully created.
 *       400:
 *         description: Bad request.
 */

router.post('/', authenticateToken, createTodo(), (req,res) => {
    try {
        validationErrors(req, res)
        const newTask = req.body
        const idUser = req.id
        UserController.addTask(newTask,idUser)
        res.send(newTask)
    } catch (err) {
        Sentry.captureException(err)
        res.status(500).json({ message: 'Internal Server Error'})
    }
})

/**
 * @swagger
 * /api/todos/{id}:
 *   patch:
 *     summary: Updates todo title for todo with id = {id}
 *     tags:
 *        - Todos
 *     security: 
 *        - bearerAuth: []
 *     description: Updates todo title for todo with id = {id}
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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

router.patch('/:id', authenticateToken, changeTitle(), (req,res) => {
    try {
        validationErrors(req, res)
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
 *     security: 
 *        - bearerAuth: []
 *     description: Updates isCompleted property value to the opposite
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID.
 *     responses:
 *       200:
 *         description: Task data has been successfully updated.
 *       400:
 *         description: Bad request.
 */

router.patch('/:id/isCompleted', authenticateToken, changeIsComleted(), (req,res) => {
    try {
        validationErrors(req, res)
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
 *     security: 
 *        - bearerAuth: []
 *     description: Deletes todo by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID.
 *     responses:
 *       200:
 *         description: User has been successfully deleted.
 *       400:
 *         description: Bad request.
 */

router.delete('/:id', authenticateToken, deleteTodo(), (req,res) => {
    try {
        validationErrors(req, res)
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