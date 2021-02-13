const { Router } = require('express')

const router = Router()

router.get('/', (req, res) => {
   res.render('catalog', {
      title: 'Каталог VR-оборудования',
      isCatalog: true,
   })
})

module.exports = router
