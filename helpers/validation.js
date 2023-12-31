const { query, body, param, validationResult} = require('express-validator');

function validationErrors (req,res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
}


function createTodo () {
    return [
        body('title')
          .notEmpty()
          .withMessage('Поле title является обязательным')
          .isString()
          .withMessage('Поле title должно быть строкой')
          .isLength({ min: 3 })
          .withMessage('Поле title должно содержать не менее 3 символов'),
      
        body('isCompleted')
          .notEmpty()
          .withMessage('Поле isCompleted является обязательным')
          .isBoolean()
          .withMessage('Поле isCompleted должно быть булевым значением'),
      ]
}

function changeTitle () {
    return [
        body('title')
          .notEmpty()
          .withMessage('Поле title является обязательным')
          .isString()
          .withMessage('Поле title должно быть строкой')
          .isLength({ min: 3 })
          .withMessage('Поле title должно содержать не менее 3 символов'),
        
        param('id')
          .notEmpty()
          .withMessage('Поле id является обязательным')
          .isString()
          .withMessage('Поле id должно быть строкой')
    ]
}

function changeIsComleted() {
    return [
        param('id')
          .notEmpty()
          .withMessage('Поле id является обязательным')
          .isString()
          .withMessage('Поле id должно быть строкой')
    ]
}

function deleteTodo() {
    return [
        param('id')
          .notEmpty()
          .withMessage('Поле id является обязательным')
          .isString()
          .withMessage('Поле id должно быть строкой')
    ]
}


function userValidation() {
    return [
    body('email')
      .notEmpty()
      .withMessage('Поле email является обязательным')
      .isEmail()
      .withMessage('Некорректный формат email'),

    body('password')
      .notEmpty()
      .withMessage('Поле password является обязательным')
      .isLength({ min: 6 })
      .withMessage('Пароль должен содержать не менее 6 символов')
    ]
}

module.exports = {
    createTodo,
    changeTitle,
    changeIsComleted,
    deleteTodo,
    userValidation,
    validationErrors
};
