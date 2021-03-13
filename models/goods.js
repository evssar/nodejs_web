const { Schema, model } = require('mongoose')

const goods = new Schema({
   title: {
      type: String,
      required: true
   },
   price: {
      type: Number,
      required: true
   },
   pic: String,
   desc: String
});

module.exports = model('Goods', goods);