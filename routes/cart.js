const { Router } = require('express')
const fs = require('fs')
const path = require('path')
const Goods = require('../models/goods')
const router = Router()

router.get('/', async (req, res) => {
    const cart = await Cart.get()
    res.render('cart', {
        title: 'Корзина',
        isCart: true,
        goodses: cart.goodses,
        sumPrice: cart.price,
    })
})

router.post('/add/:id', async (req, res) => {
    const product = await Goods.getById(req.params.id)
    console.log(product)
    const cart = await Cart.add(product)
    res.json(cart)
})


router.post('/remove', async (req, res) => {
    await Cart.remove(req.body.id)
    res.redirect('/cart')
 })

 router.delete('/remove/:id', async (req, res) => {
    const cart = await Cart.remove(req.params.id)
    res.json(cart)
 })

class Cart {
    static async get() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'cart.json'),
                'utf-8',
                (err, data) => {
                    if (err) reject(err)
                    else resolve(JSON.parse(data))
                }
            )
        })
    }

    static async add(product) {
        const cart = await Cart.get()
        const i = cart.goodses.findIndex((c) => c.id === product.id)
        const productToCart = cart.goodses[i]

        console.log(product)

        if (productToCart) {
            // есть в корзине
            productToCart.count++
            cart.goodses[i] = productToCart
        } else {
            // еще нет
            product.count = 1 // добавлем счетчик товаров одного типа
            cart.goodses.push(product)
        }

        cart.price += +product.price // принудительно приводим к числу

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'cart.json'),
                JSON.stringify(cart),
                (err) => {
                    if (err) reject(err)
                    else resolve(cart)
                }
            )
        })
    }

    static async remove(id) {
        const cart = await Cart.get()
        const i = cart.goodses.findIndex((c) => c.id === id)
        const goods = cart.goodses[i]

        if (goods.count === 1) {
            // если осталься только 1 такой товар
            cart.goodses = cart.goodses.filter((c) => c.id !== id)
        } else {
            // изменить количество
            cart.goodses[i].count--
        }

        cart.price -= goods.price

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'cart.json'),
                JSON.stringify(cart),
                (err) => {
                    if (err) reject(err)
                    else resolve(cart)
                }
            )
        })
    }
}

module.exports = router