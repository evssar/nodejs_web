const toCurrency = (price) => {
   return new Intl.NumberFormat('ru-RU', {
      currency: 'rub',
      style: 'currency',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
   }).format(price)
}

function configureEvents() {
   document.querySelectorAll('.ajax-remove').forEach((element) => {
      const goodsId = element.getAttribute('data-id')
      element.addEventListener('click', () => {
         removeGoodsFromCart(goodsId)
      })
   })

   document.querySelectorAll('.ajax-add').forEach((element) => {
      const goodsId = element.getAttribute('data-id')
      console.log(goodsId)
      element.addEventListener('click', () => {
         addGoodsToCart(goodsId)
      })
   })
}

document.querySelectorAll('.price').forEach((node) => {
   node.textContent = toCurrency(node.textContent)
})

function removeGoodsFromCart(goodsId) {
   var cart = document.querySelector('#cart')

   fetch('/cart/remove/' + goodsId, {
      method: 'delete',
   })
      .then((res) => res.json())
      .then((cartData) => {
         if (cartData.goodses.length) {
            const html = cartData.goodses
               .map((c) => {
                  return `
            <tr>
            <td>${c.title}</td>
               <td>${c.count}</td>
               <td class="price">${c.price}</td>
               <td class="price mult">${c.count * c.price}</td>
               <td>
                  <button class="uk-button-small uk-button-danger ajax-remove" data-id="${c.id
                     }">Удалить</button>
               </td>
            </tr>
            `
               })
               .join('')
            cart.querySelector('tbody').innerHTML = html
            let cartSum = 0
            cart.querySelectorAll('.mult').forEach((node) => {
               cartSum += +node.innerHTML
            })
            cart.querySelector('.sum').innerHTML = cartSum
            cart.querySelectorAll('.price').forEach((node) => {
               node.textContent = toCurrency(node.textContent)
            })
         } else {
            cart.innerHTML = '<p>Корзина пуста</p>'
         }

         configureEvents()
      })
}

function addGoodsToCart(goodsId) {
   console.log(goodsId)
   var body = JSON.stringify({ "id": goodsId })
   console.log(body)
   fetch('/cart/add/' + goodsId, {
      method: 'POST'
   })
      .then((res) => res.json())
      .then((cart) => {
         console.log("Product added to cart")
         configureEvents()
      })
}

configureEvents()