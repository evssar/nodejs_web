module.exports = function (req, res, next) {
    console.log('Time:', Date.now());
    
    if (!req.session.shopCart) {
        req.session.shopCart = { goodses: [], price: 0 }
    }
    
    res.locals.shopCart = req.session.shopCart
    next()
}