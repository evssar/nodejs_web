const uuid = require('uuid').v4
const fs = require('fs')
const path = require('path')

class Goods {
   constructor(title, price, pic, desc) {
      this.id = uuid()
      this.title = title
      this.price = price
      this.pic = pic
      this.desc = desc
   }

   toJSON() {
      return {
         id: this.id,
         title: this.title,
         price: this.price,
         pic: this.pic,
         desc: this.desc
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

   static async getById(id) {
      const goodses = await Goods.get()
      return goodses.find((c) => c.id === id)
   }

   static async delete(id) {
      let goodses = await Goods.get()
      goodses = goodses.filter((c) => c.id !== id)
      console.log(goodses)

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

   static async update(goods) {
      const updGoods = {
         id: goods.gid,
         title: goods.gtitle,
         price: goods.gprice,
         pic: goods.gpic,
         desc: goods.gdesc
      }
      console.log(updGoods)
      const goodses = await Goods.get()
      const upid = goodses.findIndex((c) => c.id === updGoods.id)

      goodses[upid] = updGoods

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
