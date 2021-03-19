const { Router } = require('express')
const multer = require('multer')
const util = require('util')
const { validationResult } = require('express-validator')
const { goodsValidator } = require('../utils/validators')
const Goods = require('../models/goods')
const { Utils } = require('../models/Utils')
const upload = require('../utils/upload')
const router = Router()

router.get('/', async (req, res) => {
   const goodses = await Goods.find()
   res.render('catalog', {
      title: 'Кталог VR-оборудования',
      isCatalog: true,
      goodses,
   })
})

router.get('/add', async (req, res) => {
   res.render('add-goods', {
      title: 'Новый товар',
      isAdd: true,
   })
})

router.get('/products/:id', async (req, res) => {
   const id = req.params.id
   const goods = await Goods.findById(req.params.id)
   res.render('gcard', {
      goods,
   })
})

router.post('/add', upload.single('gpic'), goodsValidator, async (req, res) => {
   try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
         return res.status(422).render('add-goods', {
            title: 'Новый товар',
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
               title: req.body.gtitle,
               price: req.body.gprice,
               desc: req.body.gdesc,
            }
         })
      }

      const goodses = new Goods({
         title: req.body.gtitle,
         price: req.body.gprice,
         pic: req.file ? '/img/' + req.file.filename : '',
         desc: req.body.gdesc
      })

      await goodses.save();
      res.redirect('/catalog');
   } catch (error) {
      console.log(error)

      var message = ''

      if (err instanceof multer.MulterError) {
         message = `Ошибка загрузки файла: ${err.message}`
      } else if (err) {
         message = `Что-то пошло не так. Попробуйте обновить страницу.`
      }

      return res.status(422).render('add-goods', {
         title: 'Новый товар',
         isAdd: true,
         error: errors.array()[0].msg,
         data: {
            title: req.body.gtitle,
            price: req.body.gprice,
            desc: req.body.gdesc,
         }
      })
   }
})

router.get('/:id/edit', async (req, res) => {
   const goods = await Goods.findById(req.params.id)
   res.render('edit-goods', {
      goods: goods
   })
})

router.post('/edit', upload.single('gpic'), async (req, res) => {
   const { gid } = req.body
   delete req.body.gid
   console.log(gid)
   const goods = Utils.convGoods(req.body, req.file)
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
