const goods = {
    name: 'Oculus Rift',
    price: 4000
}

module.exports = {
    goods: goods,
    getPrice() {
        console.log(goods.price)
    }
}