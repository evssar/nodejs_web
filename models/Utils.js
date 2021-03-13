class Utils {
    static convGoods(gobj) {
       return {
          title: gobj.gtitle,
          price: gobj.gprice,
          pic: gobj.gpic,
          desc: gobj.gdesc,
       }
    }
 }

 module.exports = { Utils }