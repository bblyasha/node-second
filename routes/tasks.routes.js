const express = require("express")
const router = express.Router()
const UserController = require("../controllers/userController")
const { route } = require("./authorization")
const {authenticateToken} = require("../authMiddleware")
const {createTodo, changeTitle, changeIsComleted, deleteTodo} = require('../helpers/validation')


//router.get('/', authenticateToken, UserController.getAllTasks)

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

router.get('/', authenticateToken, UserController.getUserTasks)

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

router.post('/', authenticateToken, createTodo, UserController.addTask)

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

router.patch('/:id', authenticateToken, changeTitle, UserController.updateTask)

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

router.patch('/:id/isCompleted', authenticateToken, changeIsComleted, UserController.updateIsCompleted)

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

router.delete('/:id', authenticateToken, deleteTodo, UserController.deleteTask)

module.exports = router