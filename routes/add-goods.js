const { Router } = require('express')
const Goods = require('../models/goods')

const router = Router()

router.get('/', (req, res) => {
   res.render('add-goods', {
      title: 'Новый товар',
   })
})

router.post('/', async (req, res) => {
   const goodses = new Goods(req.body.gtitle, req.body.gprice, req.body.gpic)

   await goodses.save()

   res.redirect('/catalog')
})

module.exports = router
