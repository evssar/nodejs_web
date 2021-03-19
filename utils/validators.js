const { body, validationResult } = require('express-validator')

exports.signupValidators = [
    body('name', 'Имя не должно содержать цифр или символов').isAlpha('ru-RU').trim(),
    body('email').isEmail().withMessage('Некорректный email').normalizeEmail(),
    body('password', 'Пароль не должен быть меньше 6 симовлов').isLength({
        min: 6,
        max: 30,
    }).trim(),
    body('repeat').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Пароль не совпадают')
        }
        return true
    }).trim(),
]

exports.goodsValidator = [
    body('gtitle', 'Название не можем быть меньше 3 символов')
       .isLength({ min: 3 })
       .trim(),
    body('gprice', 'Цена должна быть числом').isNumeric(),
 ]