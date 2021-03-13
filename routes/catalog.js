const { Router } = require('express')
const fs = require('fs')
const path = require('path')
const Goods = require('../models/goods')
const { Utils } = require('../models/Utils')
const router = Router()

router.get('/', async (req, res) => {
   const goodses = await Goods.find()
   res.render('catalog', {
      title: 'Кталог VR-оборудования',
      isCatalog: true,
      goodses,
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
      const goods = await Goods.findById(req.params.id)
      res.render('gcard', {
         goods,
      })
   }
})

router.post('/add', async (req, res) => {
   const goodses = new Goods({
      title: req.body.gtitle,
      price: req.body.gprice,
      pic: req.body.gpic,
      desc: req.body.gdesc
   })

   try {
      await goodses.save()
      res.redirect('/catalog')
   } catch (error){
      console.log(error)
   }
})

router.get('/:id/edit', async (req, res) => {
   const goods = await Goods.findById(req.params.id)
   res.render('edit-goods', {
      goods: goods
   })
})

router.post('/edit', async (req, res) => {
   const { gid } = req.body
   delete req.body.gid
   const goods = Utils.convGoods(req.body)
   await Goods.findByIdAndUpdate(gid, goods)
   res.redirect('/catalog')
})

router.post('/delete', async (req, res) => {
   const { gid } = req.body
   delete req.body.gid
   await Goods.findByIdAndDelete(gid)
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
