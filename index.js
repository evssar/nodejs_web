const express = require('express')
const path = require('path')
const ExpressHandlebars = require('express-handlebars')
const varsMiddleware = require('./middleware/vars')
const mainRouter = require('./routes/main')
const catRouter = require('./routes/catalog')
const cartRouter = require('./routes/cart')
const authRoute = require('./routes/auth')
const mongoose = require('mongoose')
const handlebars = require('handlebars')
const flash = require('connect-flash')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const session = require('express-session')
const MongoSession = require('connect-mongodb-session')(session)
const settings = require('./settings/index')

const app = express()

const store = new MongoSession({
   collection: 'sessions',
   uri: settings.MDB_URL,
   autoIndex: true
})

mongoose.set('debug', true);

const expressHandlebars = ExpressHandlebars.create({
   handlebars: allowInsecurePrototypeAccess(handlebars),
   defaultLayout: 'main',
   extname: 'hbs',
   helpers: require('./utils/helpers'),
})

app.use(
   session({
      secret: settings.SECRET,
      resave: false,
      saveUninitialized: false,
      store,
   })
)

app.use(varsMiddleware)
app.use(flash())

app.engine('hbs', expressHandlebars.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(express.static(settings.DIR_PUBLIC))
app.use(express.urlencoded({ extended: true }))

app.use('/', mainRouter)
app.use('/catalog', catRouter)
app.use('/cart', cartRouter)
app.use('/auth', authRoute)

async function start() {
   try {
      await mongoose.connect(settings.MDB_URL, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      })
      app.listen(settings.PORT, () => {
         console.log(`Server running at ${settings.PORT}`)
      })
   } catch (error) {
      console.log(error)
   }
}

start()
