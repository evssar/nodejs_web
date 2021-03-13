const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const mainRouter = require('./routes/main')
const catRouter = require('./routes/catalog')
const cartRouter = require('./routes/cart')
const mongoose = require('mongoose')
const h = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const session = require('express-session')
const varsMw = require('./middleware/vars')
const MongoSession = require('connect-mongodb-session')(session)

const app = express()
const PORT = process.env.PORT || 3000
const SERV = process.env.SERV || 'localhost'
const MDB_PASS = 'absolute'
const MDB_URL = `mongodb+srv://nodejs:${MDB_PASS}@cluster0.d5gxy.mongodb.net/vrbase?retryWrites=true&w=majority`
const store = new MongoSession({
   collection: 'sessions',
   uri: MDB_URL,
})

const hbs = exphbs.create({
   handlebars: allowInsecurePrototypeAccess(h),
   defaultLayout: 'main',
   extname: 'hbs',
})

h.registerHelper('mult', function (var1, var2) {
   return new h.SafeString(var1 * var2)
})

app.use(
   session({
      secret: 'very_secret_string',
      resave: false,
      saveUninitialized: false,
      store,
   })
)

app.use(varsMw)

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use('/', mainRouter)
app.use('/catalog', catRouter)
app.use('/cart', cartRouter)

async function start() {
   try {
      await mongoose.connect(MDB_URL, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      })
      app.listen(PORT, () => {
         console.log(`Server running at ${PORT}`)
      })
   } catch (error) {
      console.log(error)
   }
}

start()
