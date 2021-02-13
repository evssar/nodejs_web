const uuid = require('uuid').v4
const fs = require('fs')
const path = require('path')

class Goods {
   constructor(title, price, pic) {
      this.id = uuid()
      this.title = title
      this.price = price
      this.pic = pic
   }

   toJSON() {
      return {
         id: this.id,
         title: this.title,
         price: this.price,
         pic: this.pic,
      }
   }

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

   async save() {
      const goodses = await Goods.get()
      goodses.push(this.toJSON())

      return new Promise((resolve, reject) => {
         fs.writeFile(
            path.join(__dirname, '..', 'data', 'db.json'),
            JSON.stringify(goodses),
            (err) => {
               if (err) reject(err)
               else resolve()
            }
         )
      })
   }
}

module.exports = Goods
