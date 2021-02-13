const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const mainRouter = require('./routes/main')
const catRouter = require('./routes/catalog')
const addRouter = require('./routes/add-goods')

const PORT = process.env.PORT || 3000
const SERV = process.env.SERV || 'localhost'

const app = express()

const hbs = exphbs.create({
   defaultLayout: 'main',
   extname: 'hbs',
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use('/', mainRouter)
app.use('/catalog', catRouter)
app.use('/catalog/add', addRouter)

app.listen(PORT, SERV, () => {
   console.log(`Server running as ${SERV}:${PORT}`)
})
