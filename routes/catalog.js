const { Router } = require('express')
const fs = require('fs')
const path = require('path')
const Goods = require('../models/goods')
const router = Router()

router.get('/', async (req, res) => {
   let goodses = await Catalog.get()
   res.render('catalog', {
      title: 'Каталог VR-оборудования',
      goodses: goodses,
      isCatalog: true,
   })
})

router.get('/:id', async (req, res) => {
   const id = req.params.id
      if (id === 'add') {
      res.render('add-goods', {
         title: 'Новый товар',
         isAdd: true,
      })
   } else {
      const goods = await Goods.getById(req.params.id)
      res.render('gcard', {
         goods,
      })
   }
})

router.post('/add', async (req, res) => {
   const goodses = new Goods(req.body.gtitle, req.body.gprice, req.body.gpic, req.body.gdesc)
   await goodses.save()
   res.redirect('/catalog')
})

router.get('/:id/edit', async (req, res) => {
   const id = req.params.id
   const goods = await Goods.getById(id)
   console.log(goods)
   res.render('edit-goods', {
      goods: goods
   })
})

router.post('/edit', async (req, res) => {
   await Goods.update(req.body)
   res.redirect('/catalog')
})

router.post('/delete', async (req, res) => {
   await Goods.delete(req.body.gid)
   res.redirect('/catalog')
})

class Catalog {
   static get() {
      return new Promise((resolve, reject) => {
         fs.readFile(
            path.join(__dirname, '..', 'data', 'db.json'),
            'utf-8',
            (err, data) => {
               if (err) reject(err)
               else resolve(JSON.parse(data))
            }
         )
      })
   }
}

module.exports = router
