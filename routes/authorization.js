const express = require("express")
const router = express.Router()
const UserController = require("../controllers/userController")
const UserService = require("../services/userServices")
const {authenticateToken} = require("../authMiddleware")
const jwt = require('jsonwebtoken')
const Sentry = require("@sentry/node")



router.get('/registeredUsers', authenticateToken, (req,res) => {
    try {
        const users = UserService.getRegisteredUsers()
        res.send(users)
    } catch (err) {
        res.json({message: err})
    }
})

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Log in user with email and password
 *     tags:
 *        - Users
 *     description: Log in user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: {"email":"h@h","password":"hhh"}
 *     responses:
 *       200:
 *         description: Todo has been successfully created.
 *       400:
 *         description: Bad request.
 */

router.post('/login', async (req,res) => {
    try {
        const token = await UserController.login(req.body)
        if (token == null) res.status(400).json({message: "Пользователь не найден"})
        res.send(token)
    } catch(err) {
        Sentry.captureException(err)
    }
})

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register user with email and password
 *     tags:
 *        - Users
 *     description: Register user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: {"email":"h@h","password":"hhh"}
 *     responses:
 *       200:
 *         description: Todo has been successfully created.
 *       400:
 *         description: Bad request.
 */

router.post('/register', async (req,res) => {
    try {
        const data = req.body
        const createdUser =  await UserController.register(data)
        if (createdUser == null) res.status(400).json({message: "Пользователь с таким именем уже существует"})
        res.send(createdUser)
    } catch (err) {
        Sentry.captureException(err)
    }
})



module.exports = router