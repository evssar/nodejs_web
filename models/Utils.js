class Utils {
    static convGoods(gobj, file) {
       return {
          title: gobj.gtitle,
          price: gobj.gprice,
          pic: file ? '/img/' + file.filename : '',
          desc: gobj.gdesc,
       }
    }
 }

 module.exports = { Utils }