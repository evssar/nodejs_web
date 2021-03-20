const { Router } = require('express')
const { Schema, model } = require('mongoose')
const SessionSchema = new Schema({_id: String}, { strict: false });
const Sessions = model('sessions', SessionSchema);
const User = require('../models/user')
const bcrypt = require('bcryptjs');
const router = Router()
const { validationResult } = require('express-validator')
const { signupValidators } = require('../utils/validators')
const mailRegister = require('../utils/emails/registration')
const mailer = require('../utils/mailer')

router.get('/login', (req, res) => {
   var isLogin = true

   if (req.query.login) {
      isLogin = false
   }

   res.render('login', {
      title: 'Авторизация в магазине',
      isLogin: isLogin,
      errSignup: req.flash('err-signup'),
      errSignin: req.flash('err-signin'),
   })
})

router.post('/signup', signupValidators, async (req, res) => {
   const errors = validationResult(req)

   if (!errors.isEmpty()) {
      req.flash('err-signup', errors.array()[0].msg)
      return res.status(422).redirect(res.redirect('/auth/login/?login=false'))
   }

   try {
      const { name, email, password, repeat } = req.body;
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashPassword });

      await user.save();
      res.redirect('/auth/login');
      mailer(mailRegister(email))
   } catch (err) {
      if (err.keyPattern.email) {
         req.flash(
            'err-signup',
            'Пользователь с адресом ' +
            err.keyValue.email +
            ' уже зарегистрирован'
         )
      } else {
         console.log(err)
      }

      res.redirect('/auth/login/?login=false')
   }
})

router.post('/signin', async (req, res) => {
   try {
      const { email, password } = req.body
      const existUser = await User.findOne({ email })

      if (existUser) {
         const checkPass = await bcrypt.compare(password, existUser.password)
         if (checkPass) {
            req.session.isAdmin = existUser.isAdmin
            req.session.isAuth = true
            const existSession = await Sessions.findOne({
               'session.user': existUser._id,
            }).lean()
            if (existSession) {
               req.session.shopCart = existSession.session.shopCart

               await Sessions.deleteOne({ _id: existSession._id }, (err) => {
                  if (err) throw err
               })
            }
            req.session.user = existUser._id
            req.session.save((err) => {
               if (err) throw err
               res.redirect('/')
            })
         } else {
            req.flash('err-signin', 'Неверный пароль')
            res.redirect('/auth/login')
         }
      } else {
         req.flash(
            'err-signin',
            'Пользователь с адресом ' + email + ' не зарегистрирован'
         )

         res.redirect('/auth/login')
      }
   } catch (err) {
      console.log(err);
      req.flash(
         'err-signin',
         'Что-то пошло не так. Попробуйте обновить страницу'
      )

      res.redirect('/auth/login')
   }
})

router.get('/exit', async (req, res) => {
   try {
      req.session.destroy(function (error) {
         if (error) {
            return next(error);
         } else {
            req.session = null;
            return res.redirect('/');
         }
      });
   } catch (error) {
      console.log(error);
   }
})

module.exports = router