const express = require("express")
const router = express.Router()
const UserController = require("../controllers/userController")
const UserService = require("../services/userServices")
const {authenticateToken} = require("../authMiddleware")
const jwt = require('jsonwebtoken')
const Sentry = require("@sentry/node")
const {userValidation, validationErrors} = require('../helpers/validation')

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
 *             example: {"email":"natalya@mail.ru","password":"natalya"}
 *     responses:
 *       200:
 *         description: Todo has been successfully created.
 *       400:
 *         description: Bad request.
 */

router.post('/login', userValidation, UserController.login)

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
 *             example: {"email":"natalya@mail.ru","password":"natalya"}
 *     responses:
 *       200:
 *         description: Todo has been successfully created.
 *       400:
 *         description: Bad request.
 */

router.post('/register', userValidation, UserController.register)



module.exports = router