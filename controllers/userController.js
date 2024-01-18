require('dotenv').config()
const { use } = require("../routes");
const UserService = require("../services/userServices")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const {validationErrors} = require('../helpers/validation')
const Sentry = require('@sentry/node')
const {User} = require("../models/userModel");


class UserController {
    async login(req,res) {
        try {
            const {email, password} = req.body
            validationErrors(req,res)
            const user = await User.findOne({email})
            if (user) {
                const compareUser = await bcrypt.compare(password, user.password)
                const id = user.id
                if (compareUser) {
                    const token = jwt.sign({id},process.env.ACCESS_TOKEN_SECRET)
                    return res.json({token})
                }
                return res.status(400).json({message: 'Неверно введен пароль'})
            }
            return res.status(400).json({message: 'Пользователь не найден'})
            } catch (err) {
                res.status(400).json({message: 'Ошибка входа'})
                Sentry.captureException(err)
            }
    }

    async register(req,res) {
        try {
            const {email, password} = req.body
            validationErrors(req,res)
            const foundUser = await User.findOne({email})
            if (!foundUser) {
                const saltRounds = 4
                const salt = await bcrypt.genSalt(saltRounds)
                const passwordToString = String(password)
                const hashPass = await bcrypt.hash(passwordToString,salt)
                const createdUser = new User({
                    email,
                    password: hashPass
                })
                await createdUser.save()
                return res.json({message: 'Пользователь был успешно зарегистрирован'})
            } else return res.status(400).json({message: 'Пользователь с таким именем уже существует!'})
        } catch (err) {
            Sentry.captureException(err);
            res.status(400).json({message: 'Ошибка регистрации'})
        }
    }

    async getAllTasks(req, res) {
        try {
            const tasks = await UserService.getTodos()
            res.send(tasks);
        } catch (err) {
            Sentry.captureException(err);
            res.status(500).send('Internal Server Error');
        }
    }

    async getUserTasks(req, res) {
        try {
            const userId = req.id;
            const tasks = await UserService.getTodoByUserId(userId)
            res.send(tasks);
        } catch (err) {
            Sentry.captureException(err);
            res.status(500).send('Internal Server Error')
        }
    }

    async addTask(req, res) {
        try {
            validationErrors(req,res)
            const newTask = req.body
            const idUser = req.id
            const tasks = await UserService.addTodo(newTask,idUser)
            res.send(tasks)
        } catch (err) {
            Sentry.captureException(err);
            res.status(500).json({message: 'Internal Server Error'});
        }
    }

    async updateTask(req, res) {
        try {
            validationErrors(req,res)
            const data = req.body
            const taskId = req.params.id
            const tasks = await UserService.updateTodo(taskId, data)
            res.send(tasks)
        } catch (err) {
            Sentry.captureException(err);
            res.status(500).json({message: 'Internal Server Error'});
        }
    }

    async updateIsCompleted (req,res) {
        try {
            validationErrors(req,res)
            const taskId = req.params.id
            const updatedTask = await UserService.changeCompeledStatus(taskId)
            res.send(updatedTask)
        } catch(err) {
            Sentry.captureException(err)
            res.status(500).json({message: 'Internal Server Error'});
        }
    }

    async deleteTask(req,res) {
        try {
            validationErrors(req,res)
            const taskId = req.params.id
            const tasks = await UserService.deleteTodo(taskId)
            res.send(tasks)
        } catch (err) {
            Sentry.captureException(err)
            res.status(500).json({message: 'Internal Server Error'});
        }
    }
}

module.exports = new UserController