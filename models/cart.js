class Cart {
    static async add(cart, goods) {
        const i = cart.goodses.findIndex(
            (c) => c._id.toString() === goods._id.toString()
         )
         const goodsToCart = cart.goodses[i]
   
         if (goodsToCart) {
            // есть в корзине
            goodsToCart.count++
            cart.goodses[i] = goodsToCart
         } else {
            // еще нет
            goods.count = 1 // добавлем счетчик товаров одного типа
            cart.goodses.push(goods)
         }
   
         cart.price = cart.goodses.reduce((acc, goods) => acc + goods.price * goods.count, 0)
         return new Promise((resolve, reject) => {
            resolve(cart)
         })
    }

    static async remove(cart, goodsId) {
        const i = cart.goodses.findIndex((c) => c._id.toString() === goodsId.toString())
        const goods = cart.goodses[i]

        if (goods.count === 1) {
            cart.goodses = cart.goodses.filter((c) => c._id.toString() !== goodsId.toString())
        } else {
            cart.goodses[i].count--
        }

        cart.price = cart.goodses.reduce((acc, goods) => acc + goods.price * goods.count, 0)
        return new Promise((resolve, reject) => {
            resolve(cart)
         })
    }
}

module.exports = Cart